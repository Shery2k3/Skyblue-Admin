import './App.css';
import { useState, useEffect } from 'react';
import Login from "./Pages/Login/Login";
import Dashboard from './Pages/Dashboard/Dashboard';
import Customer from './Pages/Customer/Customer';
import Vendors from './Pages/Vendors/Vendors';
import Orders from './Pages/Orders/Orders';
import OrdersDetails from './Pages/Orders/OrderDetail';
import BestSeller from './Pages/BestSeller/BestSeller';
import Email from './Pages/Email/Email';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerApproval from './Pages/CustomerApproval/CustomerApproval';
import Discounts from './Pages/Discount/Discount';
import Banner from './Pages/Banner/Banner';
import AddBanner from './Pages/Banner/AddBanner';
import Category from './Pages/Category/Category';
import Notification from './Pages/Notification/NotificationForm';
import Product from './Pages/Product/Product';
import EditProduct from './Pages/Product/EditProduct';
import Error404 from './Pages/Error404/Error404';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import SmallDeviceWarning from './Components/SmallDeviceWarning/SmallDeviceWarning';

function App() {
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isSmallDevice) {
    return <SmallDeviceWarning />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute element={Dashboard} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
        <Route path="/categories" element={<ProtectedRoute element={Category} />} />
        <Route path="/products" element={<ProtectedRoute element={Product} />} />
        <Route path="/vendors" element={<ProtectedRoute element={Vendors} />} />
        <Route path="/orders" element={<ProtectedRoute element={Orders} />} />
        <Route path="/orders/:id" element={<ProtectedRoute element={OrdersDetails} />} />
        <Route path="/best-seller" element={<ProtectedRoute element={BestSeller} />} />
        <Route path="/customer" element={<ProtectedRoute element={Customer} />} />
        <Route path="/customer-approval" element={<ProtectedRoute element={CustomerApproval} />} />
        <Route path="/customer-roles" element={<ProtectedRoute element={Dashboard} />} />
        <Route path="/discounts" element={<ProtectedRoute element={Discounts} />} />
        <Route path="/email" element={<ProtectedRoute element={Email} />} />
        <Route path="/notice" element={<ProtectedRoute element={Notification} />} />
        <Route path="/banners" element={<ProtectedRoute element={Banner} />} />
        <Route path="/banners/add-banner" element={<ProtectedRoute element={AddBanner} />} />
        <Route path="/edit-product/:id?" element={<EditProduct />} />
                
        {/* Catch-all for non-existent routes */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;
