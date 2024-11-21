import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import "./i18n";
import * as serviceWorker from './serviceWorker';
import { GoogleOAuthProvider } from "@react-oauth/google"



ReactDOM.render( 
  <BrowserRouter basename="/marketingsys">
    <App />
  </BrowserRouter>

, document.getElementById('root'));

serviceWorker.unregister();