import React from 'react'
import SidePanel from '../Components/Dashboard/SidePanel'

const History = () => {
  return (
    <div className="flex transition-all duration-300 border-2 border-gray-300 rounded-2xl h-[calc(100vh-2rem)] overflow-y-hidden bg-[#f5f7fb]">
    <SidePanel />
    <div className="flex-1 p-6 overflow-y-auto min-h-screen customScrollbar">History</div>
 </div>
  )
}

export default History