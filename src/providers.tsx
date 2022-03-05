import React from 'react';

import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import history from 'utils/history';
import configureStore from './configureStore';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Create redux store with history
const initialState = {};
export const store = configureStore(initialState, history);
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

const Providers: React.FunctionComponent = ({ children }) => {
  return (
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <React.StrictMode>
          <HelmetProvider>{children} </HelmetProvider>
        </React.StrictMode>
      </Elements>
    </Provider>
  );
};

export default Providers;
