import authApi from "../api/authApi"

const authUtils = {
  isAuthenticated: async () => {
    const token = localStorage.getItem('token')
    if (!token) return false
    try {
      //TODO: verify token and return user data
    } catch {
      return false
    }
    return true;
  }
}

export default authUtils