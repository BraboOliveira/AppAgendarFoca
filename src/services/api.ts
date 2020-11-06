import axios from 'axios'

const api = axios.create({
  baseURL: 'http://179.188.38.158/FTService',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export default api
