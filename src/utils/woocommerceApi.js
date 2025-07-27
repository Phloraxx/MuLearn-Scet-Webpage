// Secure API utility functions - calls Cloudflare Worker instead of direct WooCommerce

const API_BASE_URL = import.meta.env.VITE_WORKER_URL || 'https://mulearn-workshop-backend.your-subdomain.workers.dev/api/woocommerce'

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
