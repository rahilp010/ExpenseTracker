import SidePanel from '../Components/SidePanel';

const Transactions = () => {
   return (
      <>
         <div className="flex min-h-screen">
            <SidePanel />
            <div className="flex-1 p-6">
               <div className="p-2 h-full">
                  <div className="flex items-center justify-center">
                     <div className='text-4xl font-bold mt-52 text-blue-500 transform transition-all duration-100 animate-bounce'>Stay Tuned 😅😅</div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Transactions;
