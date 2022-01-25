import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import Navbar from './components/common/Navbar';
import Home from './components/webpages/General/Home';
import Register from './components/webpages/General/Register';
import Login from './components/webpages/General/Login';
import BuyerDashboard from "./components/webpages/Buyer/BuyerDashboard";
import VendorDashboard from "./components/webpages/Vendor/VendorDashboard";
import BuyerProfile from "./components/webpages/Buyer/BuyerProfile";
import VendorProfile from "./components/webpages/Vendor/VendorProfile";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<VendorProfile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
