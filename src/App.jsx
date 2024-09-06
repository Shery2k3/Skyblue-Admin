import './App.css';
import Dashboard from './Pages/Dashboard/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Dashboard />} />
        <Route path="/product" element={<Dashboard />} />
        <Route path="/vendors" element={<Dashboard />} />
        <Route path="/orders" element={<Dashboard />} />
        <Route path="/best-seller" element={<Dashboard />} />
        <Route path="/customer" element={<Dashboard />} />
        <Route path="/customer-roles" element={<Dashboard />} />
        <Route path="/discount" element={<Dashboard />} />
        <Route path="/email" element={<Dashboard />} />
        <Route path="/notice" element={<Dashboard />} />
        <Route path="/banners" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
