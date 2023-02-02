import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { HomePage } from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { SearchBooksPage } from './layouts/SearchBookPage/SearchBooksPage';

export const App = () => {
  return (
    // adding bootstrap navigation bar via component
    <div className='d-flex flex-column min-vh-100'>
      <Navbar />

      <div className='flex-grow-1'>
        <Switch>

          <Route path='/' exact>
            <Redirect to='/home' />
          </Route>

          <Route path='/home'>
            <HomePage />
          </Route>

          <Route path="/search">
            <SearchBooksPage />
          </Route>

          <Route path="/checkout/:bookId">
            <BookCheckoutPage />
          </Route>

        </Switch>
      </div>
      <Footer />
    </div>
  );
}

