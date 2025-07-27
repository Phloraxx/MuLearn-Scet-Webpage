// WordPress WooCommerce API utility functions

const API_BASE_URL = import.meta.env.VITE_WOOCOMMERCE_API_URL || 'https://pay.mulearnscet.in/wp-json/wc/v3'
const CONSUMER_KEY = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY
const CONSUMER_SECRET = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET

// Basic authentication for WooCommerce API
const getAuthHeaders = () => {
  if (CONSUMER_KEY && CONSUMER_SECRET) {
    const credentials = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`)
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    }
  }
  return {
    'Content-Type': 'application/json',
  }
}

// Create a new order in WooCommerce
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    })

    // Handle specific status codes
    if (response.status === 420) {
      // User already registered for this event
      const errorData = await response.json().catch(() => ({}))
      const error = new Error('User already registered for this event')
      error.status = 420
      error.data = errorData
      throw error
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error = new Error(`HTTP error! status: ${response.status}`)
      error.status = response.status
      error.data = errorData
      throw error
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

// Get order details
export const getOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
}

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

// Get products (workshops)
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Create a customer
export const createCustomer = async (customerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(customerData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
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
    
    const response = await fetch(`${API_BASE_URL}/orders?customer=${email}&product=${productId}&status=processing,completed,on-hold`, {
      headers: getAuthHeaders(),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      // If we can't check, return false to allow registration attempt
      console.warn('Could not check existing registration:', response.status)
      return false
    }

    const orders = await response.json()
    return orders && orders.length > 0
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
    // This would typically involve verifying the payment with the payment gateway
    // and then updating the order status in WooCommerce
    
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
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
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error verifying payment:', error)
    throw error
  }
}
