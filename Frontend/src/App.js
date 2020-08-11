import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import User from './Users/pages/User';
import NewPlace from './Places/pages/NewPlace';
import UserPlaces from './Places/pages/userPlaces';
import UpdatePlace from './Places/pages/updatePlace';
import Auth from './Users/pages/auth';
import MainNavigation from './Shared/Navigation/MainNavigation';
import { AuthContext } from './Shared/context/auth-context';
import {AuthHook} from './Shared/Hooks/auth-hook'



const App = () => {

const {login,logout,userId,token}=AuthHook()

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <User />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <User />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId: userId,
        token:token,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
