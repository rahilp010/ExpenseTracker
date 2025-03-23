import React from 'react'
const Model = ({ onClose }) => {
    return (
       <div className="fixed inset-0 flex items-center justify-center bg-black opacity-90 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg">
             <h2 className="text-xl font-bold">Add Expense</h2>
             <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
             >
                Close
             </button>
          </div>
       </div>
    );
 };
 
 export default Model;
 