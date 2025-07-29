import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaIdCard, FaHashtag, FaSignOutAlt, FaWhatsapp } from 'react-icons/fa'
import { createOrder, getProducts, checkExistingRegistration } from '../utils/woocommerceApi'

const RegistrationPage = () => {
  const [user, setUser] = useState(null)
  const [registrationData, setRegistrationData] = useState({
    email: '',
    fullName: '',
    srno: '',
    phone: '',
    year: '',
    department: '',
    mulearnId: ''
  })
  const [currentStep, setCurrentStep] = useState(1) // 1: Login, 2: Details, 3: Confirm, 4: Success
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [registrationStatus, setRegistrationStatus] = useState('')
  const [productStock, setProductStock] = useState(null)
  const [stockLoading, setStockLoading] = useState(false)
  const [checkingExistingRegistration, setCheckingExistingRegistration] = useState(false)

  // Workshop details - FREE WORKSHOP
  const workshopDetails = {
    title: "Commit to Git",
    productId: 1433,
    price: 0,
    currency: "INR",
    duration: "1 Day",
    date: "Monday, August 04, 2025",
    venue: "Sahrdaya College of Engineering & Technology",
    isFree: true
  }

  // Check if user is already logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('workshopUser')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        
        // If it's an old saved user without parsed name, parse it now
        if (!userData.actualName && userData.name) {
          const fullNameFromGoogle = userData.name
          let actualName = fullNameFromGoogle
          let srNumber = ''
          
          const nameMatch = fullNameFromGoogle.match(/^(.+?)\s+(SCT\d+|\d{5,})$/i)
          if (nameMatch) {
            actualName = nameMatch[1].trim()
            srNumber = nameMatch[2].toUpperCase()
          }
          
          userData.actualName = actualName
          userData.srNumber = srNumber
          
          // Update localStorage with parsed data
          localStorage.setItem('workshopUser', JSON.stringify(userData))
        }
        
        setUser(userData)
        setRegistrationData(prev => ({
          ...prev,
          email: userData.email,
          fullName: userData.actualName || userData.name,
          srno: userData.srNumber || ''
        }))
        setCurrentStep(2)
      } catch (err) {
        console.error('Error loading saved user:', err)
        localStorage.removeItem('workshopUser')
      }
    }
  }, [])

  // Check product stock
  const checkProductStock = async () => {
    try {
      setStockLoading(true)
      const products = await getProducts()
      const workshop = products.find(product => product.id === workshopDetails.productId)
      
      if (workshop) {
        setProductStock({
          inStock: workshop.stock_status === 'instock',
          quantity: workshop.stock_quantity,
          stockStatus: workshop.stock_status
        })
        
        if (workshop.stock_status !== 'instock') {
          setError('Sorry, this workshop is currently out of stock.')
        }
      } else {
        setError('Workshop not found. Please contact support.')
      }
    } catch (err) {
      console.error('Error checking stock:', err)
      setError('Unable to check workshop availability. Please try again.')
    } finally {
      setStockLoading(false)
    }
  }

  // Check stock when component mounts
  useEffect(() => {
    checkProductStock()
  }, [])

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true)
      setError('')
      
      // Decode the JWT token to get user info
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]))
      
      // Parse name to extract actual name and SR number
      const fullNameFromGoogle = decoded.name
      let actualName = fullNameFromGoogle
      let srNumber = ''
      
      // Check if the name contains SR number pattern (assuming format like "John Doe SCT12345" or "John Doe 12345")
      const nameMatch = fullNameFromGoogle.match(/^(.+?)\s+(SCT\d+|\d{5,})$/i)
      if (nameMatch) {
        actualName = nameMatch[1].trim()
        srNumber = nameMatch[2].toUpperCase()
      }
      
      const userData = {
        email: decoded.email,
        name: decoded.name, // Keep original name for display
        actualName: actualName, // Parsed name
        srNumber: srNumber, // Extracted SR number
        picture: decoded.picture,
        googleId: decoded.sub
      }
      
      // Save user to localStorage for session persistence
      localStorage.setItem('workshopUser', JSON.stringify(userData))
      
      setUser(userData)
      setRegistrationData(prev => ({
        ...prev,
        email: userData.email,
        fullName: actualName,
        srno: srNumber
      }))
      
      // Check if user is already registered
      setCheckingExistingRegistration(true)
      try {
        const isAlreadyRegistered = await checkExistingRegistration(userData.email, workshopDetails.productId)
        if (isAlreadyRegistered) {
          setRegistrationStatus('already_registered')
          setCurrentStep(4)
          return
        }
      } catch (checkError) {
        console.warn('Could not check existing registration, proceeding with normal flow:', checkError)
        // Show a brief info message that we couldn't check
        setError('Could not verify existing registration status. You can proceed with registration - any duplicates will be detected.')
        setTimeout(scrollToTop, 100)
        setTimeout(() => setError(''), 5000) // Clear after 5 seconds
      } finally {
        setCheckingExistingRegistration(false)
      }
      
      setCurrentStep(2)
    } catch (err) {
      setError('Failed to process Google login. Please try again.')
      setTimeout(scrollToTop, 100)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('workshopUser')
    localStorage.removeItem('workshopOrderId')
    localStorage.removeItem('workshopRegistrationData')
    setUser(null)
    setRegistrationData({
      email: '',
      fullName: '',
      srno: '',
      phone: '',
      year: '',
      department: '',
      mulearnId: ''
    })
    setCurrentStep(1)
    setError('')
    setRegistrationStatus('')
  }

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.')
    setTimeout(scrollToTop, 100)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const scrollToTop = () => {
    // Try multiple methods to ensure scrolling works
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  const validateForm = () => {
    const required = ['fullName', 'srno', 'phone', 'year', 'department', 'mulearnId']
    for (let field of required) {
      if (!registrationData[field].trim()) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase().replace('srno', 'SR Number').replace('mulearnid', 'MuLearn ID')}`)
        setTimeout(scrollToTop, 100) // Small delay to ensure error is rendered first
        return false
      }
    }
    
    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(registrationData.phone)) {
      setError('Please enter a valid 10-digit Indian phone number')
      setTimeout(scrollToTop, 100)
      return false
    }

    // Validate MuLearn ID format (assuming it should be alphanumeric)
    if (registrationData.mulearnId.length < 3) {
      setError('Please enter a valid MuLearn ID')
      setTimeout(scrollToTop, 100)
      return false
    }
    
    return true
  }

  const handleDetailsSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (validateForm()) {
      setCurrentStep(3)
    }
  }

  const confirmRegistration = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Check stock again before proceeding
      if (productStock && !productStock.inStock) {
        setError('Sorry, this workshop is out of stock.')
        setTimeout(scrollToTop, 100)
        setLoading(false)
        return
      }
      
      // Create order data for WordPress/WooCommerce
      const orderData = {
        payment_method: 'free',
        payment_method_title: 'Free Registration',
        set_paid: true, // Since it's free, mark as paid
        status: 'completed',
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
            product_id: workshopDetails.productId, // Updated to use 1443
            quantity: 1,
          }
        ],
        meta_data: [
          {
            key: 'sr_number',
            value: registrationData.srno
          },
          {
            key: 'year_of_study',
            value: registrationData.year
          },
          {
            key: 'department',
            value: registrationData.department
          },
          {
            key: 'mulearn_id',
            value: registrationData.mulearnId
          },
          {
            key: 'workshop_type',
            value: workshopDetails.title
          },
          {
            key: 'registration_source',
            value: 'Portfolio Website'
          },
          {
            key: 'registration_date',
            value: new Date().toISOString()
          },
          {
            key: 'google_user_id',
            value: user?.googleId || ''
          }
        ]
      }

      console.log('Sending order data to WordPress:', orderData)
      
      // Send to WordPress
      const response = await createOrder(orderData)
      
      console.log('WordPress response:', response)
      
      // Check if the response indicates user already purchased
      if (response && response.code === 'woocommerce_rest_customer_already_purchased') {
        setRegistrationStatus('already_registered')
        setCurrentStep(4)
        setError('')
        return
      }
      
      if (response && response.id) {
        setRegistrationStatus('success')
        setCurrentStep(4)
        
        // Store order ID for reference
        localStorage.setItem('workshopOrderId', response.id)
        localStorage.setItem('workshopRegistrationData', JSON.stringify({
          ...registrationData,
          orderId: response.id,
          orderNumber: response.number,
          registrationDate: new Date().toISOString()
        }))
      } else {
        throw new Error('Registration completed but no order ID received')
      }
      
    } catch (err) {
      console.error('Registration error:', err)
      console.error('Error status:', err.status)
      console.error('Error type:', typeof err.status)

      // Handle specific error status codes
      if (err.status === 420) {
        console.log('Handling 420 error - already registered')
        setRegistrationStatus('already_registered')
        setCurrentStep(4)
        setError('')
      } else {
        console.log('Handling other error:', err.message)
        setError(`Registration failed: ${err.message}. Please try again or contact support.`)
        setRegistrationStatus('failed')
        // Scroll to top to show error message
        setTimeout(scrollToTop, 100)
      }
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl font-bold text-purple-600">Welcome to Workshop Registration</h2>
            {/* Stock Status */}
            {stockLoading ? (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <FaSpinner className="animate-spin mx-auto text-blue-500 mb-2" />
                <p className="text-blue-700">Checking workshop availability...</p>
              </div>
            ) : productStock ? (
              <div className={`p-4 rounded-lg border ${
                productStock.inStock 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`font-medium ${
                  productStock.inStock ? 'text-green-700' : 'text-red-700'
                }`}>
                  {productStock.inStock 
                    ? '✅ Workshop seats available!' 
                    : '❌ Workshop is currently out of stock'
                  }
                </p>
                {productStock.quantity !== null && productStock.inStock && (
                  <p className="text-green-600 text-sm">
                    Around {productStock.quantity} seats remaining
                  </p>
                )}
              </div>
            ) : null}

            {/* User already logged in */}
            {user ? (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    {user.picture && (
                      <img 
                        src={user.picture} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div className="text-left">
                      <p className="font-medium text-purple-800">{user.name}</p>
                      <p className="text-sm text-purple-600">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-purple-600 hover:text-purple-800 text-sm flex items-center justify-center space-x-1 mx-auto"
                  >
                    <FaSignOutAlt />
                    <span>Switch Account</span>
                  </button>
                </div>
                {productStock?.inStock ? (
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300"
                  >
                    Continue with Registration
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Workshop Out of Stock
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">Please login with your Sahrdaya Google account to continue with your registration</p>
                
                {productStock?.inStock ? (
                  <div className="flex justify-center">
                    {loading || checkingExistingRegistration ? (
                      <div className="flex items-center space-x-2 text-purple-600">
                        <FaSpinner className="animate-spin" />
                        <span>{checkingExistingRegistration ? 'Checking registration status...' : 'Processing login...'}</span>
                      </div>
                    ) : (
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="outline"
                        size="large"
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-red-700">
                      Registration is currently unavailable as the workshop is out of stock.
                    </p>
                    <button
                      onClick={checkProductStock}
                      className="mt-2 text-red-600 hover:text-red-800 font-medium"
                    >
                      Refresh Stock Status
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-purple-600">Complete Your Details</h2>
              <p className="text-gray-600">Please provide additional information for your registration</p>
              
              {/* Auto-fill info */}
              {user && (user.actualName !== user.name || user.srNumber) && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    ✨ We've automatically filled your name and SR number from your Google account. 
                    Please verify the details below are correct.
                  </p>
                </div>
              )}
              
              {/* User info with logout option */}
              {user && (
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {user.picture && (
                      <img 
                        src={user.picture} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm text-purple-700">Logged in as {user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-1"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaUser className="inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={registrationData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaEnvelope className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registrationData.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaIdCard className="inline mr-2" />
                    SR Number *
                  </label>
                  <input
                    type="text"
                    name="srno"
                    value={registrationData.srno}
                    onChange={handleInputChange}
                    placeholder="Enter your SR Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaPhone className="inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={registrationData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaGraduationCap className="inline mr-2" />
                    Year of Study *
                  </label>
                  <select
                    name="year"
                    value={registrationData.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Faculty">Faculty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaGraduationCap className="inline mr-2" />
                    Department *
                  </label>
                  <select
                    name="department"
                    value={registrationData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="CS">Computer Science (CS)</option>
                    <option value="BM">Biomedical Engineering (BM)</option>
                    <option value="EEE">Electrical & Electronics Engineering (EEE)</option>
                    <option value="EC">Electronics & Communication (EC)</option>
                    <option value="BT">Biotechnology (BT)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaHashtag className="inline mr-2" />
                    MuLearn ID *
                  </label>
                  <input
                    type="text"
                    name="mulearnId"
                    value={registrationData.mulearnId}
                    onChange={handleInputChange}
                    placeholder="Enter your MuLearn ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Don't have a MuLearn ID? <a href="https://mulearn.org" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Register here</a>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300"
              >
                Complete Registration
              </button>
            </form>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-purple-600">
                Almost there, {registrationData.fullName.split(' ')[0]}! 🎉
              </h2>
              <p className="text-gray-600">
                You're just one click away from securing your spot in this amazing workshop!
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-purple-600">
                🎯 Your Workshop Adventure Awaits!
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Workshop:</span>
                  <span className="font-medium">{workshopDetails.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{workshopDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <span className="font-medium">{workshopDetails.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{workshopDetails.duration}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Registration Fee:</span>
                  <span className="text-green-600 text-xl">FREE 🎁</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border-l-4 border-purple-400">
                <p className="text-sm text-purple-700">
                  <strong>Hey {registrationData.fullName.split(' ')[0]}!</strong> This workshop is completely free, 
                  but your enthusiasm and participation are priceless! 💜
                </p>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg space-y-2">
              <h3 className="text-lg font-semibold text-purple-600">
                📝 {registrationData.fullName.split(' ')[0]}'s Registration Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><strong>Name:</strong> {registrationData.fullName}</div>
                <div><strong>Email:</strong> {registrationData.email}</div>
                <div><strong>SR Number:</strong> {registrationData.srno}</div>
                <div><strong>Phone:</strong> {registrationData.phone}</div>
                <div><strong>Year:</strong> {registrationData.year}</div>
                <div><strong>Department:</strong> {registrationData.department}</div>
                <div><strong>MuLearn ID:</strong> {registrationData.mulearnId}</div>
              </div>
              <div className="bg-white p-3 rounded-lg mt-3 border border-purple-200">
                <p className="text-xs text-purple-600">
                  <strong>✨ Looking good, {registrationData.fullName.split(' ')[0]}!</strong> 
                  All your details are in order. Ready to dive into the world of Git? 🚀
                </p>
              </div>
            </div>

            <button
              onClick={confirmRegistration}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Securing {registrationData.fullName.split(' ')[0]}'s spot...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  <span>Yes, Reserve My Spot! 🎯</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-lg font-medium transition-colors duration-300"
            >
              ← Wait, let me double-check my details
            </button>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="space-y-4">
              {registrationStatus === 'success' ? (
                <>
                  <FaCheckCircle className="text-6xl text-green-500 mx-auto" />
                  <h2 className="text-2xl font-bold text-purple-600">
                    🎉 Woohoo, {registrationData.fullName.split(' ')[0]}!
                  </h2>
                  <p className="text-lg font-medium text-green-600">
                    You're officially registered for {workshopDetails.title}!
                  </p>
                  <p className="text-gray-600">
                    Your confirmation email is on its way to your inbox. 
                    Get ready for an awesome learning experience! 🚀
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-800">
                      🎉 Welcome to the team, {registrationData.fullName.split(' ')[0]}! 
                      Your seat is reserved and we can't wait to see you there.
                      This is going to be an incredible journey into the world of Git!
                    </p>
                    {localStorage.getItem('workshopOrderId') && (
                      <p className="text-green-700 text-sm mt-2">
                        Your Registration ID: #{localStorage.getItem('workshopOrderId')} 
                        (Keep this handy! 📝)
                      </p>
                    )}
                  </div>
                                    {/* WhatsApp Group Join Button */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                    <h4 className="font-semibold text-green-800 mb-3">
                      🎉 Join Our Workshop WhatsApp Group!
                    </h4>
                    <p className="text-green-700 text-sm mb-4">
                      Stay connected with fellow participants, get important updates, and share your learning journey!
                    </p>
                    <motion.button
                      onClick={() => window.open('https://chat.whatsapp.com/ECY5zCuIf2r0vbUVLBRIC2', '_blank')}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 mx-auto shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaWhatsapp className="text-xl" />
                      Join WhatsApp Group
                    </motion.button>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      🎯 What's Next for {registrationData.fullName.split(' ')[0]}?
                    </h4>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• 📧 Check your email for all the exciting details</li>
                      <li>• 💬 Join our WhatsApp group for live updates and fun</li>
                      <li>• 📅 Mark your calendar: {workshopDetails.date}</li>
                      <li>• 💻 Get your hands ready for hands-on coding magic</li>
                      <li>• ☕ Bring your enthusiasm (and maybe some coffee)!</li>
                    </ul>
                  </div>
                </>
              ) : registrationStatus === 'already_registered' ? (
                <>
                  <FaCheckCircle className="text-6xl text-blue-500 mx-auto" />
                  <h2 className="text-2xl font-bold text-blue-600">
                    Hey {user?.name ? user.name.split(' ')[0] : 'there'}! 👋
                  </h2>
                  <p className="text-lg font-medium text-blue-600">
                    You're already registered for {workshopDetails.title}!
                  </p>
                  <p className="text-gray-600">
                    Your registration is confirmed and your seat is reserved.
                    No need to register again - you're all set! 🎊
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800">
                      ✅ Your registration is active, {user?.name ? user.name.split(' ')[0] : 'friend'}! 
                      If you haven't received a confirmation email, please check your spam folder 
                      or contact a MuLearn execom member.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">
                      🎉 You're All Set, {user?.name ? user.name.split(' ')[0] : 'Champion'}!
                    </h4>
                    <p className="text-green-700 text-sm">
                      Your seat is confirmed for this workshop. We're excited to see you there 
                      and can't wait to learn together! 🚀
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">Workshop Details</h4>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• Date: {workshopDetails.date}</li>
                      <li>• Venue: {workshopDetails.venue}</li>
                      <li>• Duration: {workshopDetails.duration}</li>
                      <li>• Type: Workshop</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 text-sm">
                      💡 Need to update your registration details? No worries! 
                      Just reach out to Sourav P Bijoy with your email address 
                      and we'll help you make any necessary changes. We're here to help! 😊
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2 mx-auto"
                  >
                    <FaSignOutAlt />
                    <span>Register with Different Account</span>
                  </button>
                  
                  {/* WhatsApp Group Join Button for Already Registered Users */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center mt-4">
                    <h4 className="font-semibold text-green-800 mb-3">
                      💬 Join Our Workshop WhatsApp Group!
                    </h4>
                    <p className="text-green-700 text-sm mb-4">
                      Stay updated with workshop announcements and connect with other participants!
                    </p>
                    <motion.button
                      onClick={() => window.open('https://chat.whatsapp.com/ECY5zCuIf2r0vbUVLBRIC2', '_blank')}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 mx-auto shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaWhatsapp className="text-xl" />
                      Join WhatsApp Group
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-6xl text-red-500 mx-auto" />
                  <h2 className="text-2xl font-bold text-red-600">Registration Failed</h2>
                  <p className="text-gray-600">
                    There was an issue with your registration. Please try again.
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-red-800 text-sm">
                      If the problem persists, please contact 6282883870 with the error details.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-lg font-semibold transition-colors duration-300"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen relative py-12 overflow-hidden">
      {/* Background SVG with subtle animation */}
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img 
          src="/assets/blob-scene-haikei.svg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-white/20 to-purple-200/30"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <motion.div
                  key={step}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step <= currentStep
                      ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-lg'
                      : 'bg-white/70 text-gray-500 border-2 border-purple-200'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: step * 0.1 }}
                >
                  {step}
                </motion.div>
              ))}
            </div>
            <div className="h-3 bg-purple-100 rounded-full shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 rounded-full shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 4) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-purple-600 mt-2 font-medium">
              <span>Login</span>
              <span>Details</span>
              <span>Register</span>
              <span>Confirm</span>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Step Content */}
          {renderStep()}
        </motion.div>
      </div>
    </div>
  )
}

export default RegistrationPage