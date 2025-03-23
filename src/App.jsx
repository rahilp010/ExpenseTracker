import { Route, Routes } from 'react-router';
import Dashboard from './Screens/Dashboard.jsx';
import Transactions from './Screens/Transactions.jsx';
import Wallet from './Screens/Wallet.jsx';
import Settings from './Screens/Settings.jsx';

const App = () => {
   return (
      <>
         <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/transactions" element={<Transactions/>} />
            <Route path="/wallet" element={<Wallet/>} />
            <Route path="/settings" element={<Settings/>} />
         </Routes>
      </>
   );
};

export default App;
