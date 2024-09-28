import React from 'react';
import { useLocation } from 'react-router-dom';
import { MainNavbar } from './MainNavbar.jsx';
import { ReturnNavbar } from './ReturnNavbar.jsx';

export const Navbar = () => {
  const location = useLocation();
  
  // Check if the current path is the main page
  const isMainPage = location.pathname === "/";

  // Conditionally render the navbar based on the current route
  return isMainPage ? <MainNavbar /> : <ReturnNavbar />;
};