import axios from 'axios'

const API_URL = 'http://localhost:5000'

const api = axios.create({
   baseURL: API_URL,
   headers: {
      'Content-Type': 'application/json',
   },
})

const apiService = {
   getLogs: async () => {
      try {
         const response = await api.get('/logs')
         return response.data.logs
      } catch (error) {
         console.error('Error fetching logs:', error)
         throw new Error('Failed to fetch logs')
      }
   },

   filterLogs: async (startDate, endDate, keyword = '') => {
      try {
         let url = `/logs/filter?date__gte=${startDate}&date__lte=${endDate}`

         if (keyword) {
            url += `&keyword=${keyword}`
         }

         const response = await api.get(url)
         return response.data.logs
      } catch (error) {
         console.error('Error filtering logs:', error)
         throw new Error('Failed to filter logs')
      }
   }
}

export default apiService