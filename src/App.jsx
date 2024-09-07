import './App.css';
import Dashboard from './Pages/Dashboard/Dashboard';
import Customer from './Pages/Customer/Customer';
import Vendors from './Pages/Vendors/Vendors';
import Orders from './Pages/Orders/Orders';
import OrdersDetails from './Pages/Orders/OrderDetail';
import BestSeller from './Pages/BestSeller/BestSeller';
import Email from './Pages/Email/Email';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerApproval from './Pages/CustomerApproval/CustomerApproval';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Dashboard />} />
        <Route path="/products" element={<Dashboard />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrdersDetails />} />
        <Route path="/best-seller" element={<BestSeller />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/customer-approval" element={<CustomerApproval />} />
        <Route path="/customer-roles" element={<Dashboard />} />
        <Route path="/discount" element={<Dashboard />} />
        <Route path="/email" element={<Email />} />
        <Route path="/notice" element={<Dashboard />} />
        <Route path="/banners" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
