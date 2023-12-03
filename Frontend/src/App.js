import React from "react"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LogList from './components/LogList'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LogList />} />
      </Routes>
    </Router>
  )
}

export default App
