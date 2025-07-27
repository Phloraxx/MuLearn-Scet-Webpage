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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
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
