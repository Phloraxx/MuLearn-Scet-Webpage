// Secure API utility functions - calls Cloudflare Worker instead of direct WooCommerce for task management

const API_BASE_URL = import.meta.env.VITE_WORKER_URL || 'https://mulearn-task-backend.your-subdomain.workers.dev/api/woocommerce'

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

// Task-related API calls

// Submit task completion with direct order creation for tasks
export const submitTaskCompletion = async (taskData) => {
  // Create a new order specifically for task submission
  const orderData = {
    payment_method: 'Task Submission',
    payment_method_title: 'Task Submission',
    set_paid: true,
    status: 'processing',
    billing: {
      first_name: taskData.studentName.split(' ')[0] || 'Student',
      last_name: taskData.studentName.split(' ').slice(1).join(' ') || '',
      email: taskData.studentEmail,
    },
    line_items: [
      {
        name: `Task: ${taskData.taskTitle}`,
        quantity: 1,
        total: '0'
      }
    ],
    meta_data: [
      {
        key: 'submission_type',
        value: 'task_submission'
      },
      {
        key: 'task_id',
        value: taskData.taskId
      },
      {
        key: 'task_title',
        value: taskData.taskTitle
      },
      {
        key: 'github_url',
        value: taskData.githubUrl
      },
      {
        key: 'submitted_at',
        value: new Date().toISOString()
      },
      {
        key: 'is_resubmission',
        value: taskData.isResubmission || false
      }
    ]
  }

  const order = await createOrder(orderData)

  // Clear relevant caches after new submission
  console.log('🗑️ OPTIMIZATION: Clearing caches after task submission')
  clearAdminCache() // Clear admin data
  clearUserCache(taskData.studentEmail) // Clear user-specific data

  return {
    id: order.id,
    orderId: order.id,
    taskId: taskData.taskId,
    status: 'submitted'
  }
}

// Get all task submissions (admin function) - Optimized for new order-based approach
export const getTaskSubmissions = async () => {
  return getCachedData('task_submissions', async () => {
    try {
      console.log('🚀 OPTIMIZATION: Fetching task submissions from orders')
      const startTime = performance.now()
      
      // Get all orders that are task submissions
      const result = await makeApiCall('/orders?per_page=100&status=processing,completed,on-hold')
      
      console.log(`📊 Initial API call: Fetched ${result.length} orders`)
      
      const taskSubmissions = []
      
      // Filter for task submission orders only
      result.forEach(order => {
        const metaData = order.meta_data || []
        const isTaskSubmission = metaData.some(meta => meta.key === 'submission_type' && meta.value === 'task_submission')
        
        if (isTaskSubmission) {
          // Extract task data from meta_data
          const taskId = metaData.find(meta => meta.key === 'task_id')?.value
          const taskTitle = metaData.find(meta => meta.key === 'task_title')?.value
          const githubUrl = metaData.find(meta => meta.key === 'github_url')?.value
          const submittedAt = metaData.find(meta => meta.key === 'submitted_at')?.value
          const isResubmission = metaData.find(meta => meta.key === 'is_resubmission')?.value || false
          
          // Get admin status from order status
          let adminStatus = { status: 'pending' }
          if (order.status === 'completed') {
            adminStatus = { status: 'approved' }
          } else if (order.status === 'cancelled') {
            adminStatus = { status: 'rejected' }
          }
          
          taskSubmissions.push({
            id: order.id,
            orderId: order.id,
            date_created: order.date_created,
            billing: order.billing,
            taskId: taskId,
            taskTitle: taskTitle,
            githubUrl: githubUrl,
            submittedAt: submittedAt,
            isResubmission: isResubmission,
            studentEmail: order.billing?.email,
            studentName: `${order.billing?.first_name} ${order.billing?.last_name}`.trim(),
            adminStatus: adminStatus
          })
        }
      })
      
      const endTime = performance.now()
      console.log(`✅ Task submissions loaded in ${(endTime - startTime).toFixed(2)}ms`)
      console.log(`📋 Total submissions found: ${taskSubmissions.length}`)
      
      return taskSubmissions
    } catch (error) {
      console.error('Error fetching task submissions:', error)
      throw error
    }
  }, ADMIN_CACHE_DURATION)
}

// Update task submission status (admin function) - Now updates order status directly
export const updateTaskStatus = async (orderId, taskId, statusData) => {
  try {
    // Map task status to order status
    let orderStatus = 'processing' // pending
    if (statusData.status === 'approved') {
      orderStatus = 'completed'
    } else if (statusData.status === 'rejected') {
      orderStatus = 'cancelled'
    }
    
    // Update the order status and add admin feedback
    const result = await makeApiCall(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: orderStatus,
        meta_data: [
          {
            key: 'admin_feedback',
            value: statusData.notes || ''
          },
          {
            key: 'reviewed_by',
            value: statusData.reviewedBy || 'Admin'
          },
          {
            key: 'reviewed_at',
            value: statusData.reviewedAt || new Date().toISOString()
          }
        ]
      })
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

// Get task submission status for a specific user and task - Now uses direct order lookup
export const getTaskSubmissionStatus = async (userEmail, taskId) => {
  try {
    // Get all orders and find task submission orders for this user and task
    const result = await makeApiCall('/orders?per_page=50&status=processing,completed,on-hold,cancelled')
    
    const taskOrder = result.find(order => {
      // Check if it's a task submission for this user and task
      const metaData = order.meta_data || []
      const isTaskSubmission = metaData.some(meta => meta.key === 'submission_type' && meta.value === 'task_submission')
      const matchesTask = metaData.some(meta => meta.key === 'task_id' && meta.value === taskId)
      const matchesUser = order.billing?.email?.toLowerCase() === userEmail.toLowerCase()
      
      return isTaskSubmission && matchesTask && matchesUser
    })
    
    if (!taskOrder) {
      return null
    }
    
    // Extract data from order
    const metaData = taskOrder.meta_data || []
    const githubUrl = metaData.find(meta => meta.key === 'github_url')?.value || ''
    const submittedAt = metaData.find(meta => meta.key === 'submitted_at')?.value || taskOrder.date_created
    const adminFeedback = metaData.find(meta => meta.key === 'admin_feedback')?.value || ''
    const reviewedAt = metaData.find(meta => meta.key === 'reviewed_at')?.value || null
    
    // Map order status to task status
    let status = 'pending'
    if (taskOrder.status === 'completed') {
      status = 'approved'
    } else if (taskOrder.status === 'cancelled') {
      status = 'rejected'
    }
    
    return {
      id: taskOrder.id,
      orderId: taskOrder.id,
      status: status,
      adminNotes: adminFeedback,
      reviewedAt: reviewedAt,
      githubUrl: githubUrl,
      submittedAt: submittedAt
    }
  } catch (error) {
    console.error('Error getting task submission status:', error)
    return null
  }
}

// Get ALL task submission statuses for a user in a single optimized call
// Now works with direct order lookup instead of workshop registration dependency
export const getUserTaskStatuses = async (userEmail, taskIds = []) => {
  return getCachedData(`user_task_statuses_${userEmail}`, async () => {
    try {
      // Get all orders and filter for task submissions by this user
      const result = await makeApiCall('/orders?per_page=100&status=processing,completed,on-hold,cancelled')
      
      const userTaskOrders = result.filter(order => {
        // Check if it's a task submission for this user
        const metaData = order.meta_data || []
        const isTaskSubmission = metaData.some(meta => meta.key === 'submission_type' && meta.value === 'task_submission')
        const matchesUser = order.billing?.email?.toLowerCase() === userEmail.toLowerCase()
        
        return isTaskSubmission && matchesUser
      })
      
      const taskStatuses = {}
      
      // Process each task order
      userTaskOrders.forEach(order => {
        const metaData = order.meta_data || []
        const taskId = metaData.find(meta => meta.key === 'task_id')?.value
        
        if (taskId) {
          const githubUrl = metaData.find(meta => meta.key === 'github_url')?.value || ''
          const submittedAt = metaData.find(meta => meta.key === 'submitted_at')?.value || order.date_created
          const adminFeedback = metaData.find(meta => meta.key === 'admin_feedback')?.value || ''
          const reviewedAt = metaData.find(meta => meta.key === 'reviewed_at')?.value || null
          
          // Map order status to task status
          let status = 'pending'
          if (order.status === 'completed') {
            status = 'approved'
          } else if (order.status === 'cancelled') {
            status = 'rejected'
          }
          
          taskStatuses[taskId] = {
            id: order.id,
            orderId: order.id,
            status: status,
            adminNotes: adminFeedback,
            reviewedAt: reviewedAt,
            githubUrl: githubUrl,
            submittedAt: submittedAt
          }
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
