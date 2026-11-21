import { Route, Routes, Link } from 'react-router-dom';
import Dashboard from './Screens/Dashboard.jsx';
import Settings from './Screens/Settings.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDarkMode } from './Components/DarkModeContext';
import { ArrowLeft, Home } from 'lucide-react';

const App = () => {
   const { isDarkMode } = useDarkMode();

   return (
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-800'}`}>
         <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme={isDarkMode ? 'dark' : 'light'}
         />
         <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
         </Routes>
      </div>
   );
};

export default App;

const NotFound = () => {
   return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
         <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 flex items-center justify-center mb-4 text-2xl font-bold font-mono">
            404
         </div>
         <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
            Page Not Found
         </h2>
         <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
            The screen you are attempting to access does not exist or has moved.
         </p>
         <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
         >
            <Home size={14} />
            <span>Return to Dashboard</span>
         </Link>
      </div>
   );
};
