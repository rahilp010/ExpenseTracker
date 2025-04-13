import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Data } from './Test';

export const ToDo = () => {
   const [list, setList] = useState([]);
   const [search, setSearch] = useState([]);
   const [input, setInput] = useState('');
   const [copied, setCopied] = useState(false);

   // ✅ Access name and age properly from Context
   const { name, age } = useContext(Data);

   useEffect(() => {
      console.log('Fetching Data...');

      const fetchData = async () => {
         try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            const data = await response.json();

            if (data && data.length) setSearch(data);
         } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
         }
      };

      fetchData();
   }, []);

   const handleChange = (e) => {
      setInput(e.target.value);
   };

   const handleSaveChanges = () => {
      if (input.trim() !== '') {
         setList([...list, input]);
         setInput('');
      } else {
         toast.error('Input cannot be empty');
      }
   };

   const handleCopyData = () => {
      if (input.trim() === '') {
         toast.error('Nothing to copy');
         return;
      }

      navigator.clipboard.writeText(input).then(() => {
         setCopied(true);
         toast.success('Data copied successfully');
         setTimeout(() => setCopied(false), 2000);
      });
   };

   return (
      <div>
         <ToastContainer position="bottom-right" />
         <h1>{name} (Age: {age})</h1>

         <input
            type="text"
            className="border-[#ccc] border p-2 px-5 rounded-l-2xl font-bold"
            value={input}
            onChange={handleChange}
         />
         <button
            type="button"
            onClick={handleCopyData}
            className="bg-yellow-500 border border-[#ccc] text-white p-2 px-5 rounded-r-2xl font-bold hover:cursor-pointer"
         >
            Copy
         </button>
         <button
            type="button"
            onClick={handleSaveChanges}
            className="bg-green-500 border border-[#ccc] text-white p-2 px-5 rounded-r-2xl font-bold hover:cursor-pointer"
         >
            Save
         </button>

         {/* User Input List */}
         <div className="border w-full rounded-2xl my-10 border-[#ccc] h-40 p-4 overflow-y-auto">
            {list.length > 0 ? (
               <ul>
                  {list.map((item, index) => (
                     <li key={index}>{item}</li>
                  ))}
               </ul>
            ) : (
               <p className="text-gray-400 text-center my-12">No Data Found</p>
            )}
         </div>

         {/* Fetched API Data List */}
         <div className="border w-full rounded-2xl my-10 border-[#ccc] h-40 p-4 overflow-y-auto">
            {search.length > 0 ? (
               <ul>
                  {search.map((item) => (
                     <li key={item.id}>{item.title}</li>
                  ))}
               </ul>
            ) : (
               <p className="text-gray-400 text-center my-12">No Data Found</p>
            )}
         </div>
      </div>
   );
};
