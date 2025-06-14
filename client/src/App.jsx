import { Route, Routes } from 'react-router';
import Dashboard from './Screens/Dashboard.jsx';
import Transactions from './Screens/Transactions.jsx';
import Wallet from './Screens/Wallet.jsx';
import Settings from './Screens/Settings.jsx';
import notFound from './assets/404.png';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
   const paths = [
      // { path: '/', element: <Credentials />, isProtected: false },
      // { path: '/signup', element: <Credentials />, isProtected: false },
      // { path: '/reset-password', element: <Credentials />, isProtected: false },
      { path: '/', element: <Dashboard />, isProtected: true },
      { path: '/transactions', element: <Transactions />, isProtected: true },
      { path: '/wallet', element: <Wallet />, isProtected: true },
      { path: '/settings', element: <Settings />, isProtected: true },
   ];

   return (
      <div className='m-4'>
         <Routes>
            {paths.map(({ path, element, isProtected }) => (
               <Route
                  key={path}
                  path={path}
                  element={
                     isProtected ? (
                        <ProtectedRoute>{element}</ProtectedRoute>
                     ) : (
                        element
                     )
                  }
               />
            ))}
            <Route path="*" element={<NotFound />} />
         </Routes>
      </div>
   );
};

export default App;

const NotFound = () => {
   return (
      <div className="flex justify-center items-center h-screen bg-[#f0f8ff]">
         <img src={notFound} alt="" srcset="" className="w-1/2" />
      </div>
   );
};
