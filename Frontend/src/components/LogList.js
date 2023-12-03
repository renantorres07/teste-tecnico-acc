import React, { useState, useEffect } from "react"
import './styles.css'
import apiService from "../service/api"
import Filter from "./Filter"

const LogList = () => {
   const [logs, setLogs] = useState([])

   useEffect(() => {
      fetchLogs()
   }, [])

   const fetchLogs = async () => {
      try{
         const logsData = await apiService.getLogs()
         setLogs(logsData)
         console.log('logsData:', logsData)
      } catch (error) {
         console.error('Error fetching logs:', error)
      }
   }

      
   const isValidTime = (time) => {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
      return timeRegex.test(time)
   }
   
   const formatTime = (time) => {
      const [hours, minutes, seconds] = time.split(':')
      return `${hours}:${minutes}:${seconds}`
   }

   return (
      <div className="log-list">
         <h1>Log List</h1>
         <Filter />
         <div className="log-cards">
            {((<Filter filteredLogs/>).length > 0 ? (<Filter filteredLogs/>) : logs).map((log) => (
               <div key={log._id} className="log-card">
               <p><b>ID:</b> {log._id}</p>
               <p><b>IP:</b> {log.ip_address}</p>
               <p><b>Date:</b> {log.date}</p>
               <p><b>Time:</b> {isValidTime(log.time) ? formatTime(log.time) : 'Invalid Time'}</p>
               <p><b>Username:</b> {log.username}</p>
               <p><b>Version:</b> {log.version}</p>
               <p><b>Document:</b> {log.document}</p>
               <p><b>Description:</b> {log.description}</p>
               </div>
            ))}
         </div>
      </div>
   )
}

export default LogList