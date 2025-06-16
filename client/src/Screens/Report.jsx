import React from 'react'
import SidePanel from '../Components/SidePanel'

const Report = () => {
  return (
    <div className="flex transition-all duration-300 border-2 border-gray-300 rounded-2xl h-[calc(100vh-2rem)] overflow-y-hidden bg-[#f5f7fb]">
    <SidePanel />
    <div className="flex-1 p-6 overflow-y-auto min-h-screen customScrollbar">Report</div>
 </div>
  )
}

export default Report