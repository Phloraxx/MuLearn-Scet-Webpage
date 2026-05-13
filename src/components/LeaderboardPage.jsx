import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  FaTrophy, 
  FaMedal, 
  FaCrown, 
  FaSpinner, 
  FaUser, 
  FaGithub,
  FaTerminal,
  FaFire,
  FaChartBar,
  FaStar,
  FaAward,
  FaRocket,
  FaHome
} from 'react-icons/fa'
import { getLeaderboardData, clearAdminCache } from '../utils/cloudflareApi'

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [taskStats, setTaskStats] = useState({
    task1: { completed: 0, total: 0 },
    task2: { completed: 0, total: 0 },
    task3: { completed: 0, total: 0 }
  })

  // Task definitions with scoring
  const taskDefinitions = {
    1: { 
      title: "Intro to Command Line", 
      difficulty: "Easy", 
      color: "green",
      icon: FaTerminal,
      points: 1
    },
    2: { 
      title: "Intro to GitHub", 
      difficulty: "Medium", 
      color: "blue",
      icon: FaGithub,
      points: 2
    },
    3: { 
      title: "GitHub Enablement Task", 
      difficulty: "INSANE HARD", 
      color: "red",
      icon: FaFire,
      points: 5
    }
  }

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    setLoading(true)
    setError('')
    
    try {
      console.log('🏆 LEADERBOARD OPTIMIZATION: Using optimized leaderboard data function')
      const startTime = performance.now()
      
      // Use the optimized leaderboard function
      const data = await getLeaderboardData()
      
      const endTime = performance.now()
      console.log(`✅ Leaderboard loaded in ${(endTime - startTime).toFixed(2)}ms`)
      console.log(`📊 Performance boost: Used smart caching instead of processing ${data.totalApproved} submissions`)
      
      setLeaderboard(data.leaderboard)
      setTaskStats(data.taskStats)
      
    } catch (err) {
      console.error('Error loading leaderboard:', err)
      setError('Failed to load leaderboard data')
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <FaCrown className="text-yellow-500" />
      case 2: return <FaMedal className="text-gray-400" />
      case 3: return <FaMedal className="text-amber-600" />
      default: return <FaTrophy className="text-gray-300" />
    }
  }

  const getRankColors = (rank) => {
    switch (rank) {
      case 1: return "from-yellow-400 to-yellow-600 text-white"
      case 2: return "from-gray-300 to-gray-500 text-white"
      case 3: return "from-amber-500 to-amber-700 text-white"
      default: return "from-gray-100 to-gray-200 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner className="text-6xl text-purple-500" />
        </motion.div>
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
            <div className="flex items-center justify-between mb-6">
              <Link 
                to="/"
                className="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-2 transition-colors"
              >
                <FaHome />
                <span>Home</span>
              </Link>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    clearAdminCache()
                    loadLeaderboard()
                  }}
                  disabled={loading}
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-1 transition-colors"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaChartBar />}
                  <span>Refresh</span>
                </button>
                <Link 
                  to="/tasks"
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1 transition-colors"
                >
                  <FaRocket />
                  <span>Tasks</span>
                </Link>
                <button 
                  onClick={() => window.open('https://app.mulearn.org', '_blank')}
                  className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1 transition-colors"
                >
                  <FaUser />
                  <span>Register to MuLearn</span>
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                🏆 MuLearn Leaderboard
              </h1>
              <p className="text-gray-600">
                Public leaderboard showing points earned by completing MuLearn tasks and challenges
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Task 1: 1 point • Task 2: 2 points • Task 3: 5 points
              </p>
            </div>
          </div>
        </motion.div>

        {/* Task Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {Object.entries(taskDefinitions).map(([taskId, task]) => {
            const stats = taskStats[`task${taskId}`]
            const completion = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
            
            return (
              <div key={taskId} className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <task.icon className={`text-2xl text-${task.color}-500`} />
                  <div>
                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.difficulty}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed:</span>
                    <span className="font-medium">{stats.completed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`bg-${task.color}-500 h-2 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${completion}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Points: {task.points}
                  </p>
                </div>
              </div>
            )
          })}
        </motion.div>

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

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <FaChartBar />
              <span>Top Performers</span>
            </h2>
            <p className="text-purple-100 mt-1">
              {leaderboard.length} participants competing
            </p>
          </div>
          
          <div className="p-6">
            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FaTrophy className="text-6xl mx-auto mb-4 opacity-30" />
                <p className="text-xl mb-2">No submissions yet</p>
                <p>Be the first to complete a task and claim the top spot!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((player, index) => {
                  const rank = index + 1
                  
                  return (
                    <motion.div
                      key={player.email}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${getRankColors(rank)} shadow-lg border border-white/20`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">#{rank}</span>
                          {getRankIcon(rank)}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg">{player.name}</h3>
                          <p className="text-sm opacity-75">{player.email}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <FaStar className="text-yellow-300" />
                          <span className="text-2xl font-bold">{player.totalPoints}</span>
                          <span className="text-sm opacity-75">pts</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3].map(taskId => (
                            <div
                              key={taskId}
                              className={`w-3 h-3 rounded-full ${
                                player.tasks[taskId] 
                                  ? `bg-${taskDefinitions[taskId].color}-400` 
                                  : 'bg-gray-300'
                              }`}
                              title={`Task ${taskId}: ${player.tasks[taskId] ? 'Completed' : 'Not completed'}`}
                            />
                          ))}
                          <span className="text-xs opacity-75 ml-2">
                            {player.completedTasks}/3 tasks
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-gray-600"
        >
          <p className="text-sm">
            🌟 This is a public leaderboard showing all participant progress. 
            <button 
              onClick={() => window.open('https://app.mulearn.org', '_blank')}
              className="text-purple-600 hover:text-purple-800 ml-1 font-medium underline"
            >
              Register to MuLearn
            </button>
            {" "}to see your name here!
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default LeaderboardPage
