import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import CharactersList from './charactersList/charactersList.js';
import CharacterProfile from './characterProfile/characterProfile.js';
import LikedList from './likedList/likedList.js';
import LogIn from './logIn/logIn.js';
import './App.css';

function CustomRoute({ children, ...rest }) {
  const renderFunc = function ({ location }) {
    let isAuthenticated = null;
    window.FB.getLoginStatus(res => {
      if (res.status === "connected") {
        isAuthenticated = true;
      } else {
        isAuthenticated = false;
      }
    });

    const isLogin = rest.path === "/login";
    if (isAuthenticated) {
      return isLogin ?
        (<Redirect to={{ pathname: "/", state: { from: location } }} />) : children;
    } else {
      return isLogin ?
        children : (<Redirect to={{ pathname: "/login", state: { from: location } }} />);
    }
  }

  return <Route {...rest} render={renderFunc} />
}

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <CustomRoute path="/login">
            <LogIn />
          </CustomRoute>
          <CustomRoute exact path="/">
            <CharactersList />
          </CustomRoute>
          <CustomRoute path="/characterProfile">
            <CharacterProfile />
          </CustomRoute>
          <CustomRoute path="/likedList">
            <LikedList />
          </CustomRoute>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
