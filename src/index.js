import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

(function initFacebookSdk() {
  window.fbAsyncInit = function () {
    this.FB.init({
      appId: '122011283127645',
      cookie: true,
      xfbml: true,
      version: 'v9.0'
    });

    this.FB.getLoginStatus(() => initializeApp());
  };

  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
})()

function initializeApp() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
}
