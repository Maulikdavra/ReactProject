import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import {BrowserRouter} from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51MwXFcJdHxtiiPouXM9XyZCZBrmqlZTEWOrh4K4CzgZzYLgaEc45z5uCp7Q9FIdoPkXxDUduNXEHjL3Hx4H50PgE00skeKKMY8');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </BrowserRouter>

);

