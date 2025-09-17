import axios from "axios"
import { getSession } from "next-auth/react"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://envoyx-backend.vercel.app", // your API base URL
})

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    const session = await getSession()

console.log("session", session);    
    const token = session?.accessToken

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
      config.headers['X-User-Type'] = 'HEALTHCARE_PROVIDER' // Specify this is for healthcare providers
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
