import React from 'react';
import { useLocation } from 'react-router-dom';
import { MainNavBar } from './MainNavBar.jsx';
import { ReturnNavBar } from './ReturnNavBar.jsx';

export const NavBar = () => {
  const location = useLocation();
  
  // Check if the current path is the main page
  const isMainPage = location.pathname === "/";

  // Conditionally render the navbar based on the current route
  return (isMainPage ? <MainNavBar /> : <ReturnNavBar />);
};