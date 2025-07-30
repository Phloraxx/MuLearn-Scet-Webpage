// Utility functions for user authentication and registration management

/**
 * Get current logged in user data
 * @returns {Object|null} User data or null if not logged in
 */
export const getCurrentUser = () => {
  try {
    const savedUser = localStorage.getItem('workshopUser')
    if (savedUser) {
      return JSON.parse(savedUser)
    }
    return null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isUserLoggedIn = () => {
  return getCurrentUser() !== null
}

/**
 * Get user's registration data
 * @returns {Object|null} Registration data or null if not found
 */
export const getRegistrationData = () => {
  try {
    const savedData = localStorage.getItem('workshopRegistrationData')
    if (savedData) {
      return JSON.parse(savedData)
    }
    return null
  } catch (error) {
    console.error('Error getting registration data:', error)
    return null
  }
}

/**
 * Check if user has completed registration
 * @returns {boolean} True if user has completed registration
 */
export const hasCompletedRegistration = () => {
  const registrationData = getRegistrationData()
  const orderId = localStorage.getItem('workshopOrderId')
  return registrationData !== null && orderId !== null
}

/**
 * Get task progress for current user
 * @returns {Array} Array of task progress data
 */
export const getTaskProgress = () => {
  const user = getCurrentUser()
  if (!user) return []
  
  try {
    const savedProgress = localStorage.getItem(`taskProgress_${user.email}`)
    if (savedProgress) {
      return JSON.parse(savedProgress)
    }
    return []
  } catch (error) {
    console.error('Error getting task progress:', error)
    return []
  }
}

/**
 * Save task progress for current user
 * @param {Array} taskData Array of task data to save
 */
export const saveTaskProgress = (taskData) => {
  const user = getCurrentUser()
  if (!user) return
  
  try {
    localStorage.setItem(`taskProgress_${user.email}`, JSON.stringify(taskData))
  } catch (error) {
    console.error('Error saving task progress:', error)
  }
}

/**
 * Get completed tasks count for current user
 * @returns {number} Number of completed tasks
 */
export const getCompletedTasksCount = () => {
  const taskProgress = getTaskProgress()
  return taskProgress.filter(task => task.completed).length
}

/**
 * Check if user has completed all tasks
 * @returns {boolean} True if all tasks are completed
 */
export const hasCompletedAllTasks = () => {
  const taskProgress = getTaskProgress()
  const totalTasks = 3 // We have 3 tasks
  return taskProgress.filter(task => task.completed).length === totalTasks
}

/**
 * Clear all user data (logout)
 */
export const clearUserData = () => {
  localStorage.removeItem('workshopUser')
  localStorage.removeItem('workshopOrderId')
  localStorage.removeItem('workshopRegistrationData')
  
  // Clear task progress for all users (optional - you might want to keep this)
  const user = getCurrentUser()
  if (user) {
    localStorage.removeItem(`taskProgress_${user.email}`)
  }
}

/**
 * Get user display name
 * @returns {string} User's display name
 */
export const getUserDisplayName = () => {
  const user = getCurrentUser()
  if (!user) return 'Guest'
  
  return user.actualName || user.name || 'User'
}

/**
 * Get user's first name
 * @returns {string} User's first name
 */
export const getUserFirstName = () => {
  const displayName = getUserDisplayName()
  return displayName.split(' ')[0]
}

/**
 * Get task submission status from backend
 * @param {string} email User email
 * @param {number} taskId Task ID
 * @returns {Promise<Object|null>} Task submission status or null
 */
export const getTaskSubmissionStatus = async (email, taskId) => {
  try {
    // This would typically call the backend to get submission status
    // For now, we'll return null and rely on local storage
    return null
  } catch (error) {
    console.error('Error getting task submission status:', error)
    return null
  }
}

/**
 * Check if user should be redirected to tasks
 * @returns {boolean} True if user should go to tasks page
 */
export const shouldRedirectToTasks = () => {
  return isUserLoggedIn() && hasCompletedRegistration()
}

/**
 * Redirect user to appropriate page based on their status
 */
export const redirectToAppropriatePage = () => {
  if (!isUserLoggedIn()) {
    window.location.href = '/register'
  } else if (hasCompletedRegistration()) {
    window.location.href = '/tasks'
  } else {
    window.location.href = '/register'
  }
}

export default {
  getCurrentUser,
  isUserLoggedIn,
  getRegistrationData,
  hasCompletedRegistration,
  getTaskProgress,
  saveTaskProgress,
  getCompletedTasksCount,
  hasCompletedAllTasks,
  clearUserData,
  getUserDisplayName,
  getUserFirstName,
  getTaskSubmissionStatus,
  shouldRedirectToTasks,
  redirectToAppropriatePage
}
