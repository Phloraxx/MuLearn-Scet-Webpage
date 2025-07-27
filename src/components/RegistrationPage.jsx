import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaIdCard, FaHashtag, FaSignOutAlt } from 'react-icons/fa'
import { createOrder, getProducts } from '../utils/woocommerceApi'

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

  // Workshop details - FREE WORKSHOP
  const workshopDetails = {
    title: "Commit to Git",
    productId: 1443,
    price: 0,
    currency: "INR",
    duration: "2 Days",
    date: "August 15-16, 2025",
    venue: "Sahrdaya College of Engineering & Technology",
    isFree: true
  }

  // Check if user is already logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('workshopUser')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setRegistrationData(prev => ({
          ...prev,
          email: userData.email,
          fullName: userData.name
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
      
      const userData = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        googleId: decoded.sub
      }
      
      // Save user to localStorage for session persistence
      localStorage.setItem('workshopUser', JSON.stringify(userData))
      
      setUser(userData)
      setRegistrationData(prev => ({
        ...prev,
        email: userData.email,
        fullName: userData.name
      }))
      
      setCurrentStep(2)
    } catch (err) {
      setError('Failed to process Google login. Please try again.')
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
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const required = ['fullName', 'srno', 'phone', 'year', 'department', 'mulearnId']
    for (let field of required) {
      if (!registrationData[field].trim()) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase().replace('srno', 'SR Number').replace('mulearnid', 'MuLearn ID')}`)
        return false
      }
    }
    
    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(registrationData.phone)) {
      setError('Please enter a valid 10-digit Indian phone number')
      return false
    }

    // Validate MuLearn ID format (assuming it should be alphanumeric)
    if (registrationData.mulearnId.length < 3) {
      setError('Please enter a valid MuLearn ID')
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
        setLoading(false)
        return
      }
      
      // Create order data for WordPress/WooCommerce
      const orderData = {
        payment_method: 'free',
        payment_method_title: 'Free Registration',
        set_paid: true, // Since it's free, mark as paid
        status: 'processing',
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
        throw new Error('Invalid response from WordPress')
      }
      
    } catch (err) {
      console.error('Registration error:', err)
      setError(`Registration failed: ${err.message}. Please try again or contact support.`)
      setRegistrationStatus('failed')
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
                    {productStock.quantity} seats remaining
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
                <h2 className="text-2xl font-bold text-purple-600">Welcome to Free Workshop Registration</h2>
                <p className="text-gray-600">Please login with your Google account to continue with your free registration</p>
                
                {productStock?.inStock ? (
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="outline"
                      size="large"
                    />
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
              <p className="text-gray-600">Please provide additional information for your free registration</p>
              
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
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaGraduationCap className="inline mr-2" />
                    Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={registrationData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
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
                Complete Free Registration
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
              <h2 className="text-2xl font-bold text-purple-600">Confirm Your Registration</h2>
              <p className="text-gray-600">Review your details and confirm your free workshop registration</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-purple-600">Workshop Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Workshop:</span>
                  <span className="font-medium">{workshopDetails.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{workshopDetails.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{workshopDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <span className="font-medium">{workshopDetails.venue}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Registration Fee:</span>
                  <span className="text-green-600 text-xl">FREE</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg space-y-2">
              <h3 className="text-lg font-semibold text-purple-600">Registration Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><strong>Name:</strong> {registrationData.fullName}</div>
                <div><strong>Email:</strong> {registrationData.email}</div>
                <div><strong>SR Number:</strong> {registrationData.srno}</div>
                <div><strong>Phone:</strong> {registrationData.phone}</div>
                <div><strong>Year:</strong> {registrationData.year}</div>
                <div><strong>Department:</strong> {registrationData.department}</div>
                <div><strong>MuLearn ID:</strong> {registrationData.mulearnId}</div>
              </div>
            </div>

            <button
              onClick={confirmRegistration}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaCheckCircle />
              )}
              {loading ? 'Confirming Registration...' : 'Confirm Free Registration'}
            </button>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-lg font-medium transition-colors duration-300"
            >
              Back to Edit Details
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
                  <h2 className="text-2xl font-bold text-purple-600">Registration Successful!</h2>
                  <p className="text-gray-600">
                    Your free registration for {workshopDetails.title} has been confirmed.
                    You will receive a confirmation email shortly.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-800">
                      🎉 Welcome aboard! Your seat is reserved for this FREE workshop.
                      Workshop details and joining instructions will be sent to your email.
                    </p>
                    {localStorage.getItem('workshopOrderId') && (
                      <p className="text-green-700 text-sm mt-2">
                        Registration ID: #{localStorage.getItem('workshopOrderId')}
                      </p>
                    )}
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">What's Next?</h4>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• Check your email for confirmation details</li>
                      <li>• Join our WhatsApp group for updates</li>
                      <li>• Mark your calendar: {workshopDetails.date}</li>
                      <li>• Prepare your laptop for hands-on sessions</li>
                    </ul>
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
                      If the problem persists, please contact our support team with the error details.
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
        animate={{ scale: 1, opacity: 0.3 }}
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
        {[...Array(6)].map((_, i) => (
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
              duration: 3 + Math.random() * 2,
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