import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom'; // Change Redirect to Navigate
import UserContext from '../contexts/UserContext';

const Home = () => {
  const { user } = useContext(UserContext);

  return user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

export default Home;
