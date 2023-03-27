import React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { HomePage } from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { SearchBooksPage } from './layouts/SearchBookPage/SearchBooksPage';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import LoginWidget from './Auth/loginWidget';
import { OktaConfig } from './lib/OktaConfig';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';

const oktaAuth = new OktaAuth(OktaConfig);

export const App = () => {

  // customAuthHandler: a function that navigates the user to the /login page. 
  // This function is called when the user is not authenticated and is redirected to the LoginWidget component.
  const customAuthHandler = () => {
    history.push('/login')
  }

  // history: a variable that is created using the useHistory hook from the react-router-dom package. 
  // This hook provides access to the browser history and allows the App component to programmatically navigate the user to different pages.
  const history = useHistory();

  // restoreOriginaUri: a function that takes two parameters: _oktaAuth and originalUri. 
  // This function is used to redirect the user to the page they were trying to access before they were prompted to authenticate. 
  // If originalUri is defined, the user is redirected to that page. Otherwise, the user is redirected to the root page.
  const restoreOriginaUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin))
  };

  // The return statement of the App component returns a Security component from the @okta/okta-react package. 
  // The Security component is used to protect the application and requires authentication to access certain pages or functionality. 
  // The Security component has three required props: oktaAuth, restoreOriginalUri & onAuthRequired
  // oktaAuth: an instance of OktaAuth that is used to authenticate the user and manage sessions.
  // restoreOriginalUri: a function that is called when the user is authenticated and redirected to the page they were trying to access.
  // onAuthRequired: a function that is called when the user is not authenticated and is redirected to the LoginWidget component. 
  // The customAuthHandler function defined earlier is passed as the value of this prop.
  return (
    // adding bootstrap navigation bar via component
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginaUri} onAuthRequired={customAuthHandler}>

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

            <Route path="/reviewlist/:bookId">
              <ReviewListPage />
            </Route>

            <Route path="/checkout/:bookId">
              <BookCheckoutPage />
            </Route>

            <Route path='/login' render={() => <LoginWidget config={OktaConfig} />} />
            <Route path='/login/callback' component={LoginCallback} />

            <SecureRoute path="/shelf">
              <ShelfPage></ShelfPage>
            </SecureRoute>

          </Switch>
        </div>
        <Footer />
      </Security>
    </div>
  );
}

