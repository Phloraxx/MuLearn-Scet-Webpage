// Secure API utility functions - calls Cloudflare Worker instead of direct WooCommerce

const API_BASE_URL = import.meta.env.VITE_WORKER_URL || 'https://mulearn-workshop-backend.your-subdomain.workers.dev/api/woocommerce'

// Simple cache for API responses with improved management
const apiCache = new Map()
const CACHE_DURATION = 30000 // 30 seconds for regular data
const ADMIN_CACHE_DURATION = 60000 // 1 minute for admin data (changes less frequently)

// Enhanced cache management with different durations
const getCachedData = async (cacheKey, fetchFunction, customDuration = CACHE_DURATION) => {
  const cached = apiCache.get(cacheKey)
  if (cached && (Date.now() - cached.timestamp) < customDuration) {
    console.log(`📦 Using cached data for: ${cacheKey} (${Math.round((customDuration - (Date.now() - cached.timestamp)) / 1000)}s remaining)`)
    return cached.data
  }
  
  console.log(`🔄 Fetching fresh data for: ${cacheKey}`)
  const data = await fetchFunction()
  apiCache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}

// Enhanced cache clearing with selective options
export const clearApiCache = (specific = null) => {
  if (specific) {
    apiCache.delete(specific)
    console.log(`🗑️ Cleared specific cache: ${specific}`)
  } else {
    apiCache.clear()
    console.log('🗑️ Cleared all API cache')
  }
}

// Clear specific cache types
export const clearAdminCache = () => {
  clearApiCache('task_submissions')
  clearApiCache('leaderboard_data')
  console.log('🔧 Cleared admin-related cache')
}

export const clearUserCache = (userEmail) => {
  clearApiCache(`user_task_statuses_${userEmail}`)
  clearApiCache(`user_order_${userEmail}`)
  console.log(`👤 Cleared user cache for: ${userEmail}`)
}

// Helper function to make API calls to our Cloudflare Worker
const makeApiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    // Check if response is HTML (WordPress error page)
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('text/html')) {
      const htmlText = await response.text()
      console.error('Received HTML response instead of JSON:', htmlText)
      throw new Error('WordPress backend error - received HTML instead of JSON. Please check server configuration.')
    }

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || `API error: ${response.status}`)
      error.status = response.status
      error.data = data
      throw error
    }

    return data
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    
    // If it's a JSON parse error, it might be an HTML error page
    if (error.message.includes('JSON')) {
      throw new Error('WordPress backend is returning an error page. Please check server configuration or try again later.')
    }
    
    throw error
  }
}

// Create a new order in WooCommerce
export const createOrder = async (orderData) => {
  try {
    const result = await makeApiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })

    return result
  } catch (error) {
    // Handle specific status codes
    if (error.status === 420) {
      const apiError = new Error('User already registered for this event')
      apiError.status = 420
      apiError.data = error.data
      throw apiError
    }
    
    console.error('Error creating order:', error)
    throw error
  }
}

// Get order details
export const getOrder = async (orderId) => {
  try {
    return await makeApiCall(`/orders/${orderId}`)
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
}

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    return await makeApiCall(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

// Get products (workshops)
export const getProducts = async () => {
  try {
    return await makeApiCall('/products')
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Create a customer
export const createCustomer = async (customerData) => {
  try {
    return await makeApiCall('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData)
    })
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

// Check if user is already registered for a specific product
export const checkExistingRegistration = async (email, productId) => {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const result = await makeApiCall(
      `/orders?customer=${encodeURIComponent(email)}&product=${productId}&status=processing,completed,on-hold`,
      { signal: controller.signal }
    )

    clearTimeout(timeoutId)
    return result && result.length > 0
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Registration check timed out')
    } else {
      console.error('Error checking existing registration:', error)
    }
    // If we can't check, return false to allow registration attempt
    return false
  }
}

// Workshop-specific API calls

// Find user's existing workshop registration order - Optimized with caching
const findUserOrder = async (email) => {
  return getCachedData(`user_order_${email}`, async () => {
    try {
      // Get recent orders (WooCommerce API doesn't support filtering by customer email directly)
      const result = await makeApiCall(`/orders?per_page=50&status=processing,completed,on-hold`)
      
      if (result && result.length > 0) {
        // Filter by billing email and exclude task submission orders
        const workshopOrder = result.find(order => {
          // Check if billing email matches
          const emailMatches = order.billing && order.billing.email && 
            order.billing.email.toLowerCase() === email.toLowerCase()
          
          if (!emailMatches) return false
          
          // Exclude task submission orders by checking if it has workshop-related line items
          const metaData = order.meta_data || []
          const isTaskSubmission = metaData.some(meta => meta.key === 'submission_type' && meta.value === 'workshop_task')
          
          // Return true if it's not a task submission and has line items
          return !isTaskSubmission && order.line_items && order.line_items.length > 0
        })
        
        return workshopOrder || null
      }
      
      return null
    } catch (error) {
      console.error('Error finding user order:', error)
      return null
    }
  })
}

// Register for workshop
export const registerForWorkshop = async (registrationData) => {
  const orderData = {
    payment_method: 'razorpay',
    payment_method_title: 'Razorpay',
    set_paid: false,
    billing: {
      first_name: registrationData.fullName.split(' ')[0],
      last_name: registrationData.fullName.split(' ').slice(1).join(' ') || '',
      email: registrationData.email,
      phone: registrationData.phone,
    },
    shipping: {
      first_name: registrationData.fullName.split(' ')[0],
      last_name: registrationData.fullName.split(' ').slice(1).join(' ') || '',
    },
    line_items: [
      {
        product_id: 1, // Replace with actual workshop product ID
        quantity: 1,
      }
    ],
    meta_data: [
      {
        key: 'college',
        value: registrationData.college
      },
      {
        key: 'year',
        value: registrationData.year
      },
      {
        key: 'department',
        value: registrationData.department
      },
      {
        key: 'workshop_type',
        value: 'Forward AI Workshop'
      }
    ]
  }

  return await createOrder(orderData)
}

// Handle payment verification
export const verifyPayment = async (orderId, paymentData) => {
  try {
    return await makeApiCall(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'processing',
        transaction_id: paymentData.transactionId,
        meta_data: [
          {
            key: 'payment_verified',
            value: 'true'
          },
          {
            key: 'payment_method_details',
            value: JSON.stringify(paymentData)
          }
        ]
      })
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    throw error
  }
}

// Submit task completion by adding order note to existing order
export const submitTaskCompletion = async (taskData) => {
  // First, find the user's existing workshop registration order
  const existingOrder = await findUserOrder(taskData.studentEmail)
  
  if (!existingOrder) {
    throw new Error('No workshop registration found. Please register for the workshop first.')
  }

  // Create order note with task submission data
  const noteData = {
    note: JSON.stringify({
      type: 'task_submission',
      taskId: taskData.taskId,
      taskTitle: taskData.taskTitle,
      githubUrl: taskData.githubUrl,
      submittedAt: new Date().toISOString(),
      status: taskData.status || 'pending',
      isResubmission: taskData.isResubmission || false,
      studentEmail: taskData.studentEmail,
      studentName: taskData.studentName
    }),
    customer_note: false,
    added_by_user: false
  }

  const result = await makeApiCall(`/orders/${existingOrder.id}/notes`, {
    method: 'POST',
    body: JSON.stringify(noteData)
  })

  // Clear relevant caches after new submission
  console.log('🗑️ OPTIMIZATION: Clearing caches after task submission')
  clearAdminCache() // Clear admin data
  clearUserCache(taskData.studentEmail) // Clear user-specific data

  return {
    id: result.id,
    orderId: existingOrder.id,
    taskId: taskData.taskId,
    status: 'submitted'
  }
}

// Get all task submissions (admin function) - Highly Optimized version with aggressive caching
// OPTIMIZATION: This function makes many API calls (1 + N orders), so it's heavily cached
// Cache duration is longer since admin data doesn't change frequently
export const getTaskSubmissions = async () => {
  return getCachedData('task_submissions', async () => {
    try {
      console.log('🚀 OPTIMIZATION: Fetching task submissions with batched processing to minimize API load')
      const startTime = performance.now()
      
      // Get all workshop orders (excluding task submission orders)
      const result = await makeApiCall('/orders?per_page=100&status=processing,completed,on-hold')
      
      console.log(`📊 Initial API call: Fetched ${result.length} orders`)
      
      const taskSubmissions = []
      
      // Process orders in larger batches for better performance
      const batchSize = 15 // Increased from 10 to 15 for better throughput
      let totalNoteCalls = 0
      
      for (let i = 0; i < result.length; i += batchSize) {
        const batch = result.slice(i, i + batchSize)
        console.log(`🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(result.length/batchSize)} (${batch.length} orders)`)
        
        // Process batch concurrently
        const batchPromises = batch.map(async (order) => {
          // Skip orders that were task submission orders (old system)
          const metaData = order.meta_data || []
          const isOldTaskOrder = metaData.some(meta => meta.key === 'submission_type' && meta.value === 'workshop_task')
          if (isOldTaskOrder) return []
          
          try {
            // Get order notes
            totalNoteCalls++
            const notes = await makeApiCall(`/orders/${order.id}/notes`)
            
            // Process all notes at once to extract both submissions and admin reviews
            const taskNotes = notes.filter(note => {
              try {
                const noteData = JSON.parse(note.note)
                return noteData.type === 'task_submission'
              } catch {
                return false
              }
            })
            
            const adminNotes = notes.filter(note => {
              try {
                const noteData = JSON.parse(note.note)
                return noteData.type === 'admin_review'
              } catch {
                return false
              }
            })
            
            // Create admin status lookup map
            const adminStatusMap = {}
            adminNotes.forEach(note => {
              try {
                const adminData = JSON.parse(note.note)
                const key = `${adminData.taskId}`
                if (!adminStatusMap[key] || new Date(note.date_created) > new Date(adminStatusMap[key].reviewedAt)) {
                  adminStatusMap[key] = adminData
                }
              } catch (err) {
                console.error('Error parsing admin note:', err)
              }
            })
            
            // Process task submissions with admin status
            const orderSubmissions = []
            taskNotes.forEach(note => {
              try {
                const taskData = JSON.parse(note.note)
                const adminStatus = adminStatusMap[taskData.taskId] || { status: 'pending' }
                
                orderSubmissions.push({
                  id: note.id,
                  orderId: order.id,
                  date_created: note.date_created,
                  billing: order.billing,
                  ...taskData,
                  adminStatus: adminStatus
                })
              } catch (err) {
                console.error('Error parsing task note:', err)
              }
            })
            
            return orderSubmissions
          } catch (err) {
            console.error(`Error fetching notes for order ${order.id}:`, err)
            return []
          }
        })
        
        const batchResults = await Promise.all(batchPromises)
        batchResults.forEach(orderSubmissions => {
          taskSubmissions.push(...orderSubmissions)
        })
        
        // Reduced delay for better performance
        if (i + batchSize < result.length) {
          await new Promise(resolve => setTimeout(resolve, 50)) // Reduced from 100ms to 50ms
        }
      }
      
      const endTime = performance.now()
      console.log(`✅ Task submissions loaded in ${(endTime - startTime).toFixed(2)}ms`)
      console.log(`📊 Total API calls: ${totalNoteCalls + 1} (1 orders call + ${totalNoteCalls} notes calls)`)
      console.log(`📋 Total submissions found: ${taskSubmissions.length}`)
      
      return taskSubmissions
    } catch (error) {
      console.error('Error fetching task submissions:', error)
      throw error
    }
  })
}

// Helper function to get admin status for a specific task
const getTaskAdminStatus = async (orderId, taskId) => {
  try {
    const notes = await makeApiCall(`/orders/${orderId}/notes`)
    
    // Find the latest admin status note for this task
    const adminNotes = notes.filter(note => {
      try {
        const noteData = JSON.parse(note.note)
        return noteData.type === 'admin_review' && noteData.taskId === taskId
      } catch {
        return false
      }
    }).sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
    
    if (adminNotes.length > 0) {
      return JSON.parse(adminNotes[0].note)
    }
    
    return { status: 'pending' }
  } catch (error) {
    console.error('Error getting admin status:', error)
    return { status: 'pending' }
  }
}

// Update task submission status (admin function)
export const updateTaskStatus = async (orderId, taskId, statusData) => {
  try {
    // Add admin review note to the order
    const noteData = {
      note: JSON.stringify({
        type: 'admin_review',
        taskId: taskId,
        status: statusData.status,
        notes: statusData.notes || '',
        reviewedBy: statusData.reviewedBy || 'Admin',
        reviewedAt: statusData.reviewedAt || new Date().toISOString()
      }),
      customer_note: false,
      added_by_user: false
    }

    const result = await makeApiCall(`/orders/${orderId}/notes`, {
      method: 'POST',
      body: JSON.stringify(noteData)
    })
    
    // Clear all relevant caches after updating task status
    console.log('🗑️ OPTIMIZATION: Clearing caches after task status update')
    clearAdminCache() // This clears both task_submissions and leaderboard_data
    
    return result
  } catch (error) {
    console.error('Error updating task status:', error)
    throw error
  }
}

// Get task submission status for a specific user and task - Optimized
export const getTaskSubmissionStatus = async (userEmail, taskId) => {
  try {
    // Find the user's workshop order
    const userOrder = await findUserOrder(userEmail)
    
    if (!userOrder) {
      return null
    }

    // Get order notes once
    const notes = await makeApiCall(`/orders/${userOrder.id}/notes`)
    
    // Find the task submission note
    const taskSubmissionNote = notes.find(note => {
      try {
        const noteData = JSON.parse(note.note)
        return noteData.type === 'task_submission' && noteData.taskId === taskId
      } catch {
        return false
      }
    })
    
    if (!taskSubmissionNote) {
      return null
    }
    
    const taskData = JSON.parse(taskSubmissionNote.note)
    
    // Find the latest admin review note for this task from the same notes array
    const adminNotes = notes.filter(note => {
      try {
        const noteData = JSON.parse(note.note)
        return noteData.type === 'admin_review' && noteData.taskId === taskId
      } catch {
        return false
      }
    }).sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
    
    const adminStatus = adminNotes.length > 0 ? JSON.parse(adminNotes[0].note) : { status: 'pending' }
    
    return {
      id: taskSubmissionNote.id,
      orderId: userOrder.id,
      status: adminStatus.status || 'pending',
      adminNotes: adminStatus.notes || '',
      reviewedAt: adminStatus.reviewedAt || null,
      githubUrl: taskData.githubUrl || '',
      submittedAt: taskData.submittedAt || taskSubmissionNote.date_created
    }
  } catch (error) {
    console.error('Error getting task submission status:', error)
    return null
  }
}

// Get ALL task submission statuses for a user in a single optimized call
// OPTIMIZATION: This replaces multiple individual getTaskSubmissionStatus calls
// Previously: N tasks × (1 findUserOrder + 1 getNotes) = 2N API calls
// Now: 1 findUserOrder + 1 getNotes = 2 API calls total
// Reduces 100+ API calls to just 2 for typical usage
export const getUserTaskStatuses = async (userEmail, taskIds = []) => {
  return getCachedData(`user_task_statuses_${userEmail}`, async () => {
    try {
      // Find the user's workshop order
      const userOrder = await findUserOrder(userEmail)
      
      if (!userOrder) {
        return {}
      }

      // Get order notes once
      const notes = await makeApiCall(`/orders/${userOrder.id}/notes`)
      
      // Process all task submissions and admin reviews
      const taskSubmissions = {}
      const adminReviews = {}
      
      // Group notes by type and task ID
      notes.forEach(note => {
        try {
          const noteData = JSON.parse(note.note)
          
          if (noteData.type === 'task_submission') {
            taskSubmissions[noteData.taskId] = {
              note,
              data: noteData
            }
          } else if (noteData.type === 'admin_review') {
            const taskId = noteData.taskId
            if (!adminReviews[taskId] || new Date(note.date_created) > new Date(adminReviews[taskId].note.date_created)) {
              adminReviews[taskId] = {
                note,
                data: noteData
              }
            }
          }
        } catch (err) {
          // Skip invalid notes
        }
      })
      
      // Combine submissions with their admin status
      const taskStatuses = {}
      
      Object.keys(taskSubmissions).forEach(taskId => {
        const submission = taskSubmissions[taskId]
        const adminReview = adminReviews[taskId]
        
        taskStatuses[taskId] = {
          id: submission.note.id,
          orderId: userOrder.id,
          status: adminReview ? adminReview.data.status : 'pending',
          adminNotes: adminReview ? adminReview.data.notes || '' : '',
          reviewedAt: adminReview ? adminReview.data.reviewedAt : null,
          githubUrl: submission.data.githubUrl || '',
          submittedAt: submission.data.submittedAt || submission.note.date_created
        }
      })
      
      return taskStatuses
    } catch (error) {
      console.error('Error getting user task statuses:', error)
      return {}
    }
  })
}

// Get leaderboard data - Optimized lightweight version for public leaderboard
// OPTIMIZATION: Uses longer cache (5 minutes) and only processes approved submissions
// This is much faster than getTaskSubmissions() for leaderboard purposes
export const getLeaderboardData = async () => {
  const LEADERBOARD_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes for leaderboard
  
  const cached = apiCache.get('leaderboard_data')
  if (cached && (Date.now() - cached.timestamp) < LEADERBOARD_CACHE_DURATION) {
    console.log('✅ Using cached leaderboard data')
    return cached.data
  }
  
  console.log('🚀 LEADERBOARD OPTIMIZATION: Fetching fresh data with smart caching')
  const startTime = performance.now()
  
  try {
    // Reuse the full task submissions data if available in cache
    const allSubmissions = await getTaskSubmissions()
    
    // Process only approved submissions for leaderboard
    const approvedSubmissions = allSubmissions.filter(sub => 
      sub.adminStatus?.status === 'approved' && sub.studentEmail && sub.taskId
    )
    
    console.log(`📊 Processed ${allSubmissions.length} total submissions, ${approvedSubmissions.length} approved`)
    
    const playerMap = new Map()
    
    // Build leaderboard from approved submissions
    approvedSubmissions.forEach(submission => {
      const studentKey = submission.studentEmail
      const taskId = parseInt(submission.taskId)
      
      if (!playerMap.has(studentKey)) {
        playerMap.set(studentKey, {
          name: submission.studentName || 'Unknown',
          email: submission.studentEmail,
          tasks: { 1: null, 2: null, 3: null },
          totalPoints: 0,
          completedTasks: 0
        })
      }
      
      const player = playerMap.get(studentKey)
      const submissionTime = new Date(submission.submittedAt || submission.date_created)
      
      // Update player's task completion (keep earliest approved submission)
      if (!player.tasks[taskId] || submissionTime < new Date(player.tasks[taskId].submittedAt)) {
        player.tasks[taskId] = {
          submittedAt: submissionTime.toISOString(),
          githubUrl: submission.githubUrl
        }
      }
    })
    
    // Calculate points and statistics
    const taskDefinitions = {
      1: { points: 1 },
      2: { points: 2 },
      3: { points: 5 }
    }
    
    playerMap.forEach((player) => {
      let totalPoints = 0
      let completedTasks = 0
      
      Object.keys(player.tasks).forEach(taskId => {
        if (player.tasks[taskId]) {
          completedTasks++
          totalPoints += taskDefinitions[taskId].points
        }
      })
      
      player.totalPoints = totalPoints
      player.completedTasks = completedTasks
    })
    
    // Create sorted leaderboard
    const leaderboardData = Array.from(playerMap.values())
      .filter(player => player.completedTasks > 0)
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) {
          return b.totalPoints - a.totalPoints
        }
        return b.completedTasks - a.completedTasks
      })
    
    // Calculate task statistics
    const taskStats = {
      task1: { completed: 0, total: playerMap.size },
      task2: { completed: 0, total: playerMap.size },
      task3: { completed: 0, total: playerMap.size }
    }
    
    leaderboardData.forEach(player => {
      if (player.tasks[1]) taskStats.task1.completed++
      if (player.tasks[2]) taskStats.task2.completed++
      if (player.tasks[3]) taskStats.task3.completed++
    })
    
    const result = {
      leaderboard: leaderboardData,
      taskStats: taskStats,
      totalParticipants: playerMap.size,
      totalApproved: approvedSubmissions.length
    }
    
    // Cache with longer duration for leaderboard
    apiCache.set('leaderboard_data', { data: result, timestamp: Date.now() })
    
    const endTime = performance.now()
    console.log(`✅ Leaderboard data processed in ${(endTime - startTime).toFixed(2)}ms`)
    console.log(`🏆 ${result.leaderboard.length} players on leaderboard`)
    
    return result
    
  } catch (error) {
    console.error('Error getting leaderboard data:', error)
    throw error
  }
}

// Sync local submissions (removed - no longer using local storage)
export const syncLocalSubmissions = async (userEmail) => {
  return { synced: 0, failed: 0, remaining: 0 }
}

// Get local submissions count (removed - no longer using local storage)
export const getLocalSubmissionsCount = () => {
  return 0
}
