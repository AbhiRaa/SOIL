import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import UserManagement from './components/Dashboard/UserManagement';
import ProductManagement from './components/Dashboard/ProductManagement';
import Home from './components/Home';  // A simple Home component if you have it

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />  {/* Home page */}
            <Route path="/users" element={<UserManagement />} />  {/* User Management route */}
            <Route path="/products" element={<ProductManagement />} />  {/* Product Management route */}
            {/* Additional routes can be added here */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
