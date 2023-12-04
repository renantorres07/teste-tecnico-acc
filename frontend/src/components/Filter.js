import React, { useState } from "react"
import apiService from "../service/api"
import './styles.css'

const Filter = () => {
   const [startDate, setStartDate] = useState('')
   const [endDate, setEndDate] = useState('')
   const [keyword, setKeyword] = useState('')
   const [filteredLogs, setFilteredLogs] = useState([])

   const applyFilter = () => {
      handleFilter(startDate, endDate, keyword)
   }

   const handleFilter = async () => {
      console.log('start_date:', startDate, ', end_date:', endDate, ', keyword:', keyword)

      try {
         // Verificar se startDate e endDate estão preenchidas
         if (!startDate || !endDate) {
            console.error('Por favor, preencha ambas as datas para filtrar.')
            return
         }

         // Verificar se as datas estão no formato YYYY-MM-DD
         const dateRegex = /^\d{4}-\d{2}-\d{2}$/
         if (!startDate.match(dateRegex) || !endDate.match(dateRegex)) {
            console.error('Datas inválidas - devem estar no formato YYYY-MM-DD')
            return
         }

         const logsData = await apiService.filterLogs(startDate, endDate, keyword)
         console.log('logsData:', logsData)
         setFilteredLogs(logsData)
         console.log('filteredLogs:', filteredLogs)
      } catch (error) {
         console.error("Error filtering logs", error)
      }
   }

   return (
      <div className="filters">
         <h2>Filters</h2>
         <input
            className="filter-input"
            type="text"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
         />
         <input
            className="filter-input"
            type="text"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
         />
         <input
            className="filter-input"
            type="text"
            placeholder="Search keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
         />
         <button className='apply-button'onClick={applyFilter}>Apply</button>
      </div>
   )
}

export default Filter