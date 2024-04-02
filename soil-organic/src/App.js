import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import NavigationBar from './components/NavigationBar';
import HomePage from './pages/Home';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import ProfilePage from './pages/Profile';
import SpecialsPage from './pages/Specials';
import useAuth from './hooks/useAuth'; // Hook to check the login state

function App() {
  const isLoggedIn = useAuth();

  return (
    <Router>
      <Header />
      <NavigationBar />
      <main>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate replace to="/profile" /> : <SignUpPage />} />
          {/* Redirect from SignInPage to ProfilePage if already logged in */}
          <Route path="/signin" element={isLoggedIn ? <Navigate replace to="/profile" /> : <SignInPage />} />
          {/* Protect the ProfilePage route, redirecting to SignInPage if not logged in */}
          <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate replace to="/signin" />} />
          <Route path="/specials" element={<SpecialsPage />} />
          {/* Redirect to HomePage or another route if the route doesn't exist */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
