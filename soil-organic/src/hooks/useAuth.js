import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(status === 'true');
  }, []);

  return isLoggedIn;
};

export default useAuth;