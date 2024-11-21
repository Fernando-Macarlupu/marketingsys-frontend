import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import "./i18n";
import * as serviceWorker from './serviceWorker';
import { GoogleOAuthProvider } from "@react-oauth/google"



ReactDOM.render( 
  <GoogleOAuthProvider clientId='605148618909-grgm6jjkut4sqspncj8b6q1r1l07fin8.apps.googleusercontent.com'> 
  <BrowserRouter basename="/marketingsys">
    <App />
  </BrowserRouter>
  </GoogleOAuthProvider>
, document.getElementById('root'));

serviceWorker.unregister();