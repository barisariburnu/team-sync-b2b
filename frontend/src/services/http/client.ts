import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const http = axios.create({
  baseURL,
  withCredentials: true,
})

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)
