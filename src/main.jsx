import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DarkModeProvider } from './Components/DarkModeContext.jsx';
import App from './App.jsx';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
      <DarkModeProvider>
         <App />
      </DarkModeProvider>
   </BrowserRouter>
);
