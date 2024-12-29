import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
const ProtectedRoute: React.FC = () => {
  const token: string | undefined = Cookies.get('token'); // Type safety for token
  console.log("All Cookies: ", Cookies.get()); // Debugging all cookies
  console.log("Token: ", token); // Debugging specific token

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
