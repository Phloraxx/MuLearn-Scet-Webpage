import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  FaCheck, 
  FaTimes, 
  FaEye, 
  FaExternalLinkAlt,
  FaSpinner, 
  FaUser, 
  FaSignOutAlt, 
  FaTasks,
  FaFilter,
  FaSearch,
  FaDownload,
  FaFlag,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUsers,
  FaChartBar
} from 'react-icons/fa'
import { getTaskSubmissions, updateTaskStatus, clearAdminCache } from '../utils/woocommerceApi'

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [debugMode, setDebugMode] = useState(false)

  const ADMIN_PASSWORD = 'WASDQWE'

  // Task definitions for reference
  const taskDefinitions = {
    1: { title: "Intro to Command Line", difficulty: "Easy", color: "green" },
    2: { title: "Intro to GitHub", difficulty: "Medium", color: "blue" },
    3: { title: "GitHub Enablement Task", difficulty: "INSANE HARD", color: "red" }
  }

  // Check authentication on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuthenticated')
    const authTimestamp = localStorage.getItem('adminAuthTimestamp')
    const currentTime = new Date().getTime()
    const authExpiry = 2 * 60 * 60 * 1000 // 2 hours in milliseconds
    
    // Check if auth is valid and not expired
    if (savedAuth === 'true' && authTimestamp && (currentTime - parseInt(authTimestamp)) < authExpiry) {
      setIsAuthenticated(true)
      loadSubmissions()
    } else {
      // Clear expired auth
      localStorage.removeItem('adminAuthenticated')
      localStorage.removeItem('adminAuthTimestamp')
      setIsAuthenticated(false)
    }
  }, [])

  // Filter submissions based on status and search term
  useEffect(() => {
    let filtered = submissions

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(sub => sub.status === filterStatus)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.githubUrl.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredSubmissions(filtered)
  }, [submissions, filterStatus, searchTerm])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuthenticated', 'true')
      localStorage.setItem('adminAuthTimestamp', new Date().getTime().toString())
      loadSubmissions()
      setAuthError('')
    } else {
      setAuthError('Invalid password')
      setTimeout(() => setAuthError(''), 3000)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminAuthTimestamp')
    setPassword('')
    setSubmissions([])
    setFilteredSubmissions([])
  }

  const loadSubmissions = async () => {
    setLoading(true)
    setError('')
    
    try {
      console.log('🔧 ADMIN OPTIMIZATION: Loading task submissions with smart caching')
      const startTime = performance.now()
      
      const data = await getTaskSubmissions()
      
      const endTime = performance.now()
      console.log(`✅ Admin data loaded in ${(endTime - startTime).toFixed(2)}ms`)
      console.log(`📊 Loaded ${data.length} submissions for admin review`)
      
      // Transform the data to match our needs
      const transformedSubmissions = data.map(submission => {
        return {
          id: submission.id,
          orderId: submission.orderId,
          taskId: submission.taskId,
          taskTitle: submission.taskTitle || 'Unknown Task',
          githubUrl: submission.githubUrl || '',
          studentName: submission.studentName || 
                      `${submission.billing?.first_name || ''} ${submission.billing?.last_name || ''}`.trim() || 'Unknown',
          studentEmail: submission.studentEmail || submission.billing?.email || 'Unknown',
          submissionDate: submission.submittedAt || submission.date_created,
          status: submission.adminStatus?.status || 'pending',
          adminNotes: submission.adminStatus?.notes || '',
          reviewedAt: submission.adminStatus?.reviewedAt || null,
          reviewedBy: submission.adminStatus?.reviewedBy || null
        }
      }).filter(submission => 
        // Only include submissions that have proper task data
        submission.taskId && submission.githubUrl && submission.studentEmail !== 'Unknown'
      )

      console.log(`📋 Transformed ${transformedSubmissions.length} valid submissions for admin interface`)
      
      // If no real submissions, add some test data for development
      if (transformedSubmissions.length === 0 && debugMode) {
        const testSubmissions = [
          {
            id: 'test-1',
            orderId: 'test-1',
            taskId: '1',
            taskTitle: 'Intro to Command Line',
            githubUrl: 'https://github.com/testuser/command-line-task',
            studentName: 'Test Student 1',
            studentEmail: 'test1@sahrdaya.ac.in',
            submissionDate: new Date().toISOString(),
            status: 'pending',
            adminNotes: '',
            reviewedAt: null,
            reviewedBy: null
          },
          {
            id: 'test-2',
            orderId: 'test-2',
            taskId: '2',
            taskTitle: 'Intro to GitHub',
            githubUrl: 'https://github.com/testuser/github-task',
            studentName: 'Test Student 2',
            studentEmail: 'test2@sahrdaya.ac.in',
            submissionDate: new Date().toISOString(),
            status: 'approved',
            adminNotes: 'Great work!',
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Admin'
          }
        ]
        setSubmissions(testSubmissions)
      } else {
        setSubmissions(transformedSubmissions)
      }
    } catch (err) {
      console.error('Error loading submissions:', err)
      setError('Failed to load submissions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateSubmissionStatus = async (submissionId, newStatus, notes = '') => {
    setUpdating(submissionId)
    setError('')
    setSuccess('')

    try {
      // Find the submission to get orderId and taskId
      const submission = submissions.find(sub => sub.id === submissionId)
      if (!submission) {
        throw new Error('Submission not found')
      }

      await updateTaskStatus(submission.orderId, submission.taskId, {
        status: newStatus,
        notes: notes,
        reviewedBy: 'Admin',
        reviewedAt: new Date().toISOString()
      })

      // Update local state
      setSubmissions(prevSubmissions => 
        prevSubmissions.map(sub => 
          sub.id === submissionId 
            ? { 
                ...sub, 
                status: newStatus, 
                adminNotes: notes,
                reviewedAt: new Date().toISOString(),
                reviewedBy: 'Admin'
              }
            : sub
        )
      )

      setSuccess(`Task ${newStatus === 'approved' ? 'approved' : 'flagged for retry'} successfully!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error updating submission:', err)
      setError('Failed to update submission status. Please try again.')
      setTimeout(() => setError(''), 5000)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FaCheckCircle />
      case 'rejected': return <FaExclamationTriangle />
      case 'pending': return <FaClock />
      default: return <FaClock />
    }
  }

  const getTaskColor = (taskId) => {
    const task = taskDefinitions[taskId]
    if (!task) return 'gray'
    return task.color
  }

  const getStats = () => {
    const total = submissions.length
    const pending = submissions.filter(s => s.status === 'pending').length
    const approved = submissions.filter(s => s.status === 'approved').length
    const rejected = submissions.filter(s => s.status === 'rejected').length
    
    return { total, pending, approved, rejected }
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative py-12 overflow-hidden">
        {/* Background */}
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
        
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-white/20 to-purple-200/30"></div>
        
        <div className="relative z-10 max-w-md mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-purple-600 mb-2">Admin Portal</h1>
              <p className="text-gray-600">Task Submission Management</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/" className="text-purple-600 hover:text-purple-800 text-sm">
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="min-h-screen relative py-12 overflow-hidden">
      {/* Background */}
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
      
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-white/20 to-purple-200/30"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-600">Admin Dashboard</h1>
              <p className="text-gray-600">Task Submission Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/"
                className="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-1"
              >
                <FaUser />
                <span>Home</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/20"
          >
            <div className="flex items-center space-x-3">
              <FaUsers className="text-2xl text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/20"
          >
            <div className="flex items-center space-x-3">
              <FaClock className="text-2xl text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/95 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/20"
          >
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-2xl text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/95 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/20"
          >
            <div className="flex items-center space-x-3">
              <FaExclamationTriangle className="text-2xl text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Needs Retry</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Needs Retry</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <FaSearch className="text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or task..."
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>
            </div>

            <button
              onClick={() => {
                clearAdminCache()
                loadSubmissions()
              }}
              disabled={loading}
              className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
              <span>Refresh</span>
            </button>
            
            <button
              onClick={() => setDebugMode(!debugMode)}
              className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300"
            >
              <FaEye />
              <span>{debugMode ? 'Hide' : 'Show'} Debug</span>
            </button>
          </div>
        </motion.div>

        {/* Error/Success Messages */}
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
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Debug Section */}
        {debugMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
          >
            <h3 className="font-bold text-yellow-800 mb-2">Debug Information</h3>
            <div className="text-sm">
              <p><strong>Total raw submissions:</strong> {submissions.length}</p>
              <p><strong>Filtered submissions:</strong> {filteredSubmissions.length}</p>
              <details className="mt-2">
                <summary className="cursor-pointer font-medium text-yellow-700">Raw Data (click to expand)</summary>
                <pre className="mt-2 p-2 bg-yellow-100 rounded text-xs overflow-auto max-h-64">
                  {JSON.stringify(submissions.slice(0, 3), null, 2)}
                </pre>
              </details>
            </div>
          </motion.div>
        )}

        {/* Submissions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <FaTasks />
              <span>Task Submissions ({filteredSubmissions.length})</span>
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <FaSpinner className="animate-spin text-4xl text-purple-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading submissions...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <FaTasks className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No submissions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Task</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">GitHub URL</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Submitted</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((submission, index) => (
                      <motion.tr
                        key={submission.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-800">{submission.studentName}</p>
                            <p className="text-sm text-gray-600">{submission.studentEmail}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              getTaskColor(submission.taskId) === 'green' ? 'bg-green-100 text-green-800' :
                              getTaskColor(submission.taskId) === 'blue' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              Task {submission.taskId}
                            </span>
                            <span className="text-sm text-gray-600">{submission.taskTitle}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {submission.githubUrl ? (
                            <a
                              href={submission.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800 flex items-center space-x-1 text-sm"
                            >
                              <FaExternalLinkAlt />
                              <span className="truncate max-w-32">{submission.githubUrl}</span>
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">No URL provided</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(submission.submissionDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit ${getStatusColor(submission.status)}`}>
                            {getStatusIcon(submission.status)}
                            <span className="capitalize">{submission.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {submission.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                                  disabled={updating === submission.id}
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-300 flex items-center space-x-1"
                                >
                                  {updating === submission.id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => updateSubmissionStatus(submission.id, 'rejected', 'Please retry this task')}
                                  disabled={updating === submission.id}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-300 flex items-center space-x-1"
                                >
                                  {updating === submission.id ? <FaSpinner className="animate-spin" /> : <FaFlag />}
                                  <span>Flag</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => updateSubmissionStatus(submission.id, 'pending')}
                                disabled={updating === submission.id}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-300 flex items-center space-x-1"
                              >
                                {updating === submission.id ? <FaSpinner className="animate-spin" /> : <FaEye />}
                                <span>Review</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminPage
