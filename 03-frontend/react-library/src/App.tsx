import React from 'react';
import './App.css';
import { HomePage } from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';

export const  App = () => {
  return (
    // adding bootstrap navigation bar via component
    <div>
      <Navbar/>
      <HomePage/>
      <Footer/>
    </div>
  );
}
 
