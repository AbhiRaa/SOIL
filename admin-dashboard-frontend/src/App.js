import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import UserManagement from './components/Dashboard/UserManagement';
import ProductManagement from './components/Dashboard/ProductManagement';
import ReviewManagement from './components/Dashboard/ReviewManagement';
import MetricsDisplay from './components/Dashboard/MetricsDisplay';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />  {/* Home page */}
            <Route path="/users" element={<UserManagement />} />  {/* User Management route */}
            <Route path="/products" element={<ProductManagement />} />  {/* Product Management route */}
            <Route path="/reviews" element={<ReviewManagement />} />  {/* Review Management route */}
            <Route path="/metrics" element={<MetricsDisplay />} />  {/* Metrics Display route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
