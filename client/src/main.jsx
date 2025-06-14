import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DarkModeProvider } from './Components/DarkModeContext.jsx';
import App from './App.jsx';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import {store} from './app/store.js'

createRoot(document.getElementById('root')).render(
   <Provider store={store}>
      <BrowserRouter>
         <DarkModeProvider>
            <App />
         </DarkModeProvider>
      </BrowserRouter>
   </Provider>
);
