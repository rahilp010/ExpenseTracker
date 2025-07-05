import { Route, Routes } from 'react-router';
import Dashboard from './Screens/Dashboard.jsx';
import Settings from './Screens/Settings.jsx';
import notFound from './assets/404.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDarkMode } from './Components/DarkModeContext';

const App = () => {
   const { isDarkMode } = useDarkMode();
   const paths = [
      { path: '/', element: <Dashboard /> },
      { path: '/settings', element: <Settings /> },
   ];

   return (
      <div className={`p-4 ${isDarkMode ? 'bg-black/90 shadow-2xl' : 'bg-[#f5f7fb]'}`}>
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
