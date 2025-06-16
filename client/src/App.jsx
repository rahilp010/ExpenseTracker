import { Route, Routes } from 'react-router';
import Dashboard from './Screens/Dashboard.jsx';
import Settings from './Screens/Settings.jsx';
import notFound from './assets/404.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Report from './Screens/Report.jsx';
import History from './Screens/History.jsx';

const App = () => {
   const paths = [
      { path: '/', element: <Dashboard /> },
      { path: '/history', element: <History /> },
      { path: '/settings', element: <Settings /> },
      { path: '/report', element: <Report /> },
   ];

   return (
      <div className="m-4">
         <ToastContainer />
         <Routes>
            {paths.map(({ path, element }) => (
               <Route key={path} path={path} element={element} />
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
