import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  FaTerminal, 
  FaGithub, 
  FaFire, 
  FaCheckCircle, 
  FaSpinner, 
  FaUser, 
  FaSignOutAlt, 
  FaExternalLinkAlt,
  FaTasks,
  FaTrophy,
  FaBolt,
  FaClock,
  FaDownload,
  FaExclamationTriangle,
  FaUpload
} from 'react-icons/fa'
import { submitTaskCompletion, getUserTaskStatuses, clearApiCache } from '../utils/woocommerceApi'
import { getCurrentUser, saveTaskProgress as saveProgress, clearUserData } from '../utils/userUtils'

const TasksPage = () => {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Intro to Command Line",
      description: "Master the basics of command line interface and terminal operations",
      url: "https://learn.mulearn.org/challenge/intro-to-command-line",
      difficulty: "Easy",
      icon: FaTerminal,
      color: "from-green-400 to-green-600",
      completed: false,
      githubUrl: "",
      submittedAt: null
    },
    {
      id: 2,
      title: "Intro to GitHub",
      description: "Learn version control with Git and GitHub fundamentals",
      url: "https://learn.mulearn.org/challenge/intro-to-github",
      difficulty: "Medium",
      icon: FaGithub,
      color: "from-blue-400 to-blue-600",
      completed: false,
      githubUrl: "",
      submittedAt: null
    },
    {
      id: 3,
      title: "GitHub Enablement Task",
      description: "INSANE HARD challenge - Advanced GitHub workflow and collaboration",
      url: "https://github.com/gtech-mulearn/Github-Enablment-Task",
      difficulty: "INSANE HARD",
      icon: FaFire,
      color: "from-red-500 to-orange-600",
      completed: false,
      githubUrl: "",
      submittedAt: null
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submittingTaskId, setSubmittingTaskId] = useState(null)
  const [loadingStatuses, setLoadingStatuses] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      // Redirect to registration if not logged in
      window.location.href = '/register'
      return
    }

    setUser(user)
    loadTaskProgress(user.email)
  }, [])

  const loadTaskProgress = async (email) => {
    // Load task progress from localStorage or backend
    const savedProgress = localStorage.getItem(`taskProgress_${email}`)
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress)
        setTasks(prevTasks => 
          prevTasks.map(task => {
            const savedTask = progress.find(p => p.id === task.id)
            return savedTask ? { ...task, ...savedTask } : task
          })
        )
      } catch (err) {
        console.error('Error loading task progress:', err)
      }
    }
    
    // Also load real status from backend
    await loadTaskStatusesFromBackend(email)
  }

  const loadTaskStatusesFromBackend = async (email) => {
    if (!email) return
    
    setLoadingStatuses(true)
    try {
      console.log(`🚀 OPTIMIZATION: Loading statuses for ${tasks.length} tasks with only 2 API calls instead of ${tasks.length * 2}`)
      const startTime = performance.now()
      
      // Get all task statuses in a single optimized call
      const taskStatuses = await getUserTaskStatuses(email, tasks.map(task => task.id))
      
      const endTime = performance.now()
      console.log(`✅ Task statuses loaded in ${(endTime - startTime).toFixed(2)}ms`)
      console.log(`📊 API calls saved: ${(tasks.length * 2) - 2} calls (${(((tasks.length * 2) - 2) / (tasks.length * 2) * 100).toFixed(1)}% reduction)`)
      
      // Update tasks with backend status
      setTasks(prevTasks => 
        prevTasks.map(task => {
          const backendStatus = taskStatuses[task.id]
          if (backendStatus) {
            return {
              ...task,
              backendStatus: backendStatus.status,
              adminNotes: backendStatus.adminNotes,
              submissionId: backendStatus.id,
              completed: backendStatus.status === 'approved',
              needsResubmission: backendStatus.status === 'rejected',
              isPending: backendStatus.status === 'pending',
              submittedAt: backendStatus.submittedAt,
              githubUrl: backendStatus.githubUrl || task.githubUrl
            }
          }
          return task
        })
      )
    } catch (err) {
      console.error('Error loading task statuses from backend:', err)
    } finally {
      setLoadingStatuses(false)
    }
  }

  const saveTaskProgress = (updatedTasks) => {
    saveProgress(updatedTasks)
  }

  const handleLogout = () => {
    clearUserData()
    window.location.href = '/register'
  }

  const handleGithubUrlChange = (taskId, url, isResubmission = false) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              [isResubmission ? 'newGithubUrl' : 'githubUrl']: url 
            } 
          : task
      )
    )
  }

  const submitTask = async (taskId, isResubmission = false) => {
    const task = tasks.find(t => t.id === taskId)
    const githubUrl = isResubmission ? task.newGithubUrl : task.githubUrl
    
    if (!githubUrl?.trim()) {
      setError('Please enter a valid GitHub repository URL')
      return
    }

    // Basic GitHub URL validation
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w\-\.]+\/[\w\-\.]+/
    if (!githubUrlPattern.test(githubUrl)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)')
      return
    }

    setSubmittingTaskId(taskId)
    setLoading(true)
    setError('')
    
    try {
      // Submit task to WordPress backend using the dedicated function
      const taskSubmissionData = {
        taskId: taskId,
        taskTitle: task.title,
        githubUrl: githubUrl,
        studentEmail: user.email,
        studentName: user.actualName || user.name,
        status: 'pending', // Reset to pending for admin review
        isResubmission: isResubmission
      }

      console.log('Submitting task data:', taskSubmissionData)
      
      const response = await submitTaskCompletion(taskSubmissionData)
      
      if (response && response.id) {
        // Update task status
        const updatedTasks = tasks.map(t => 
          t.id === taskId 
            ? { 
                ...t, 
                isPending: true,
                needsResubmission: false,
                completed: false,
                submittedAt: new Date().toISOString(),
                submissionId: response.id,
                githubUrl: githubUrl,
                newGithubUrl: '', // Clear the resubmission URL
                backendStatus: 'pending'
              } 
            : t
        )
        
        setTasks(updatedTasks)
        saveTaskProgress(updatedTasks)
        
        if (isResubmission) {
          setSuccess(`Task "${task.title}" resubmitted successfully! It's now under review.`)
        } else {
          setSuccess(`Task "${task.title}" submitted successfully! It's now under review.`)
        }
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000)
      } else {
        throw new Error('Task submission failed - no response ID received')
      }
      
    } catch (err) {
      console.error('Task submission error:', err)
      setError(`Failed to submit task: ${err.message}. Please try again.`)
      setTimeout(() => setError(''), 5000)
    } finally {
      setLoading(false)
      setSubmittingTaskId(null)
    }
  }

  const completedTasks = tasks.filter(task => task.completed || task.backendStatus === 'approved').length
  const totalTasks = tasks.length
  const pendingTasks = tasks.filter(task => task.isPending || task.backendStatus === 'pending').length
  const rejectedTasks = tasks.filter(task => task.needsResubmission || task.backendStatus === 'rejected').length

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-purple-500" />
      </div>
    )
  }

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
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-white/20 to-purple-200/30"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
            {/* User Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {user.picture && (
                  <img 
                    src={user.picture} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full border-2 border-purple-300"
                  />
                )}
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-purple-600">
                    Welcome, {user.actualName || user.name}! 🎯
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => window.open('https://app.mulearn.org', '_blank')}
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-1"
                >
                  <FaUser />
                  <span>Register to MuLearn</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-purple-700 flex items-center space-x-2">
                  <FaTasks />
                  <span>Workshop Tasks Progress</span>
                </h2>
                <div className="flex items-center space-x-2 text-purple-600">
                  <FaTrophy />
                  <span className="font-bold">{completedTasks}/{totalTasks}</span>
                </div>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-purple-600 text-sm mt-2">
                {completedTasks === totalTasks 
                  ? "🎉 All tasks completed! You're a champion!" 
                  : `Keep going! ${totalTasks - completedTasks} task${totalTasks - completedTasks !== 1 ? 's' : ''} remaining.`
                }
                {pendingTasks > 0 && ` ${pendingTasks} under review.`}
                {rejectedTasks > 0 && ` ${rejectedTasks} need resubmission.`}
              </p>
            </div>
            
            {/* Refresh Button */}
            <div className="mt-3">
              <button
                onClick={() => {
                  clearApiCache()
                  loadTaskStatusesFromBackend(user.email)
                }}
                disabled={loadingStatuses}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 text-sm"
              >
                {loadingStatuses ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                <span>Refresh Status</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-4xl mx-auto"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 max-w-4xl mx-auto"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasks.map((task, index) => {
            const IconComponent = task.icon
            const isSubmitting = submittingTaskId === task.id

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden"
              >
                {/* Task Header */}
                <div className={`bg-gradient-to-r ${task.color} p-4 text-white relative`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="text-2xl" />
                      <div>
                        <h3 className="font-bold text-lg">{task.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            task.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                            task.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {task.difficulty}
                          </span>
                          {task.difficulty === 'INSANE HARD' && (
                            <FaBolt className="text-yellow-300 animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                    {task.completed && (
                      <FaCheckCircle className="text-2xl text-green-300" />
                    )}
                  </div>
                </div>

                {/* Task Content */}
                <div className="p-6 space-y-4">
                  <p className="text-gray-600 text-sm">{task.description}</p>
                  
                  {/* Task URL */}
                  <a
                    href={task.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-medium"
                  >
                    <FaExternalLinkAlt />
                    <span>Open Task</span>
                  </a>

                  {/* GitHub URL Input */}
                  {!task.completed && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        GitHub Repository URL *
                      </label>
                      <input
                        type="url"
                        value={task.githubUrl}
                        onChange={(e) => handleGithubUrlChange(task.id, e.target.value)}
                        placeholder="https://github.com/username/repository"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={isSubmitting}
                      />
                    </div>
                  )}

                  {/* Task Status */}
                  {task.completed ? (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 font-medium flex items-center space-x-2">
                          <FaCheckCircle />
                          <span>Approved ✅</span>
                        </span>
                        <span className="text-green-600 text-sm">
                          {new Date(task.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-green-600 text-sm mt-1">
                        Repository: <a href={task.githubUrl} target="_blank" rel="noopener noreferrer" className="underline">{task.githubUrl}</a>
                      </p>
                      {task.adminNotes && (
                        <div className="mt-2 p-2 bg-green-100 rounded border-l-4 border-green-400">
                          <p className="text-green-700 text-sm">
                            <strong>Admin feedback:</strong> {task.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : task.needsResubmission ? (
                    <div className="space-y-3">
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between">
                          <span className="text-red-700 font-medium flex items-center space-x-2">
                            <FaExclamationTriangle />
                            <span>Needs Resubmission ⚠️</span>
                          </span>
                        </div>
                        <p className="text-red-600 text-sm mt-1">
                          Previous submission: <a href={task.githubUrl} target="_blank" rel="noopener noreferrer" className="underline">{task.githubUrl}</a>
                        </p>
                        {task.adminNotes && (
                          <div className="mt-2 p-2 bg-red-100 rounded border-l-4 border-red-400">
                            <p className="text-red-700 text-sm">
                              <strong>Admin feedback:</strong> {task.adminNotes}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Resubmission form */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Updated GitHub Repository URL *
                        </label>
                        <input
                          type="url"
                          value={task.newGithubUrl || ''}
                          onChange={(e) => handleGithubUrlChange(task.id, e.target.value, true)}
                          placeholder="https://github.com/username/updated-repository"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          disabled={submittingTaskId === task.id}
                        />
                        <p className="text-sm text-red-600">
                          Please address the admin feedback and submit your updated repository.
                        </p>
                      </div>
                      
                      <button
                        onClick={() => submitTask(task.id, true)}
                        disabled={submittingTaskId === task.id || !(task.newGithubUrl?.trim())}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                          submittingTaskId === task.id || !(task.newGithubUrl?.trim())
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg transform hover:scale-105'
                        }`}
                      >
                        {submittingTaskId === task.id ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            <span>Resubmitting...</span>
                          </>
                        ) : (
                          <>
                            <FaUpload />
                            <span>Resubmit Task</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : task.isPending ? (
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-700 font-medium flex items-center space-x-2">
                          <FaClock />
                          <span>Under Review 🔍</span>
                        </span>
                        <span className="text-yellow-600 text-sm">
                          {new Date(task.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-yellow-600 text-sm mt-1">
                        Repository: <a href={task.githubUrl} target="_blank" rel="noopener noreferrer" className="underline">{task.githubUrl}</a>
                      </p>
                      <p className="text-yellow-700 text-sm mt-2">
                        Your submission is being reviewed by our team. Please wait for feedback.
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => submitTask(task.id)}
                      disabled={submittingTaskId === task.id || !task.githubUrl.trim()}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                        submittingTaskId === task.id || !task.githubUrl.trim()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {submittingTaskId === task.id ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <FaUpload />
                          <span>Submit Task</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Completion Message */}
        {completedTasks === totalTasks && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-2xl text-center shadow-xl"
          >
            <FaTrophy className="text-6xl mx-auto mb-4 text-yellow-300" />
            <h2 className="text-3xl font-bold mb-4">🎉 Congratulations! 🎉</h2>
            <p className="text-lg">
              You've completed all workshop tasks! You're now officially a Git champion! 🏆
            </p>
            <p className="text-sm mt-2 opacity-90">
              Keep up the amazing work and continue your learning journey!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TasksPage
