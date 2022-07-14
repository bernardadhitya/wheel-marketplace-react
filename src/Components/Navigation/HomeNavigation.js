import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Login from '../../Containers/Login/Login';
import SearchPage from '../../Containers/SearchPage/SearchPage';
import PublicRoute from './PublicRoute';
import Register from '../../Containers/Register/Register';
import HomePage from '../../Containers/HomePage/HomePage';
import ProductManagerPage from '../../Containers/ProductManagerPage/ProductManagerPage';
import ChatPage from '../../Containers/ChatPage/ChatPage';

const HomeNavigation = () => {
  return (
    <Switch>
      <Route exact path='/'><Redirect to='/home'/></Route>
      <PublicRoute path='/home' component={HomePage}/>
      <PublicRoute path='/product' component={SearchPage}/>
      <PublicRoute path='/login' component={Login}/>
      <PublicRoute path='/register' component={Register}/>
      <PublicRoute path='/dashboard' component={ProductManagerPage}/>
      <PublicRoute path='/chat' component={ChatPage}/>
    </Switch>
  );
};

export default HomeNavigation;