import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import NavigationBar from './components/NavigationBar';
import HomePage from './pages/Home';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import ProfilePage from './pages/Profile';
import SpecialsPage from './pages/Specials';

function App() {
  return (
    <Router>
      <Header />
      <NavigationBar />
      <main>
        <Routes> {/* Use Routes instead of Switch */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/specials" element={<SpecialsPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
