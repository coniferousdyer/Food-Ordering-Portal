import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import Navbar from './components/common/Navbar';
import Home from './components/webpages/General/Home';
import Register from './components/webpages/General/Register';
import Login from './components/webpages/General/Login';
import BuyerDashboard from "./components/webpages/Buyer/BuyerDashboard";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<BuyerDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
