import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  return token ? <Navigate to="/short-url-generator" /> : children;
};

export default PublicRoute;
