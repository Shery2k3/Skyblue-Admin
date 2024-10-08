import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Login from "./Pages/Login/Login";
import Dashboard from './Pages/Dashboard/Dashboard';
import Category from './Pages/Catalog/Category/Category';
import Product from './Pages/Catalog/Product/Product';
import EditProduct from './Pages/Catalog/Product/EditProduct';
import Inventory from './Pages/Catalog/Inventory/Inventory';
import Manufacturers from './Pages/Catalog/Manufacturers/Manufacturers';
import ManufacturerDetail from './Pages/Catalog/Manufacturers/ManufacturerDetail';
import Vendors from './Pages/Vendors/Vendors';
import Orders from './Pages/Sales/Orders/Orders';
import OrdersDetails from './Pages/Sales/Orders/OrderDetail';
import CurrentCarts from './Pages/Sales/CurrentCarts/CurrentCarts';
import BestSeller from './Pages/Sales/BestSeller/BestSeller';
import Customer from './Pages/Customers/Customer/Customer';
import CustomerApproval from './Pages/Customers/CustomerApproval/CustomerApproval';
import CustomerReport from './Pages/Customers/CustomerReport/CustomerReport';
import CustomerRoles from './Pages/Customers/CustomerRoles/CustomerRoles';
import Discounts from './Pages/Promotions/Discount/Discount';
import Email from './Pages/Promotions/Email/Email';
import Flyer from './Pages/Promotions/Flyer/Flyer';
import OrderSheet from './Pages/Promotions/OrderSheet/OrderSheet';
import Notification from './Pages/ContentManagement/Notification/NotificationForm';
import Banner from './Pages/ContentManagement/Banner/Banner';
import AddBanner from './Pages/ContentManagement/Banner/AddBanner';
import Error404 from './Pages/Error404/Error404';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute element={Dashboard} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />

        {/* Catalog */}
        <Route path="/categories" element={<ProtectedRoute element={Category} />} />
        <Route path="/products" element={<ProtectedRoute element={Product} />} />
        <Route path="/edit-product/:id?" element={<ProtectedRoute element={EditProduct} />} />
        <Route path="/inventory" element={<ProtectedRoute element={Inventory} />} />
        <Route path="/manufacturers" element={<ProtectedRoute element={Manufacturers} />} />
        <Route path="/manufacturer/products/:id?" element={<ProtectedRoute element={ManufacturerDetail} />} />

        {/* Vendors */}
        <Route path="/vendors" element={<ProtectedRoute element={Vendors} />} />

        {/* Sales */}
        <Route path="/orders" element={<ProtectedRoute element={Orders} />} />
        <Route path="/orders/:id" element={<ProtectedRoute element={OrdersDetails} />} />
        <Route path="/current-carts" element={<ProtectedRoute element={CurrentCarts} />} />
        <Route path="/best-seller" element={<ProtectedRoute element={BestSeller} />} />

        {/* Customers */}
        <Route path="/customer" element={<ProtectedRoute element={Customer} />} />
        <Route path="/customer-approval" element={<ProtectedRoute element={CustomerApproval} />} />
        <Route path="/customer-report" element={<ProtectedRoute element={CustomerReport} />} />
        <Route path="/customer-roles" element={<ProtectedRoute element={CustomerRoles} />} />

        {/* Promotions */}
        <Route path="/discounts" element={<ProtectedRoute element={Discounts} />} />
        <Route path="/email" element={<ProtectedRoute element={Email} />} />
        <Route path="/flyer" element={<ProtectedRoute element={Flyer} />} />
        <Route path="/order-sheet" element={<ProtectedRoute element={OrderSheet} />} />

        {/* Content Management */}
        <Route path="/notice" element={<ProtectedRoute element={Notification} />} />
        <Route path="/banners" element={<ProtectedRoute element={Banner} />} />
        <Route path="/banners/add-banner" element={<ProtectedRoute element={AddBanner} />} />
         
        {/* Catch-all for non-existent routes */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;
