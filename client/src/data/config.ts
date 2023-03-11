import axios from 'axios'

export const setBearerToken = (token: string) => {
  axios.defaults.headers.common = { Authorization: `Bearer ${token}` }
}

export const clearBearerToken = () => {
  axios.defaults.headers.common = {}
}

export const isAuthenticated = (): boolean => {
  return !!axios.defaults.headers.common['Authorization']
}

export const apiUrl = import.meta.env.VITE_API_URL

export const configureDefaults = () => {
  axios.defaults.baseURL = apiUrl
}
