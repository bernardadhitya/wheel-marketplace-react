import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { fetchCurrentUser } from '../../service';
import Navbar from '../Navbar/Navbar';

const isLoggedIn = async () => {
  const user = await fetchCurrentUser();
  return !!user;
}

const renderAuthorizedComponent = (AuthorizedComponent, props) => {
  return (
    <div className='component-wrapper'>
      <Navbar/>
      <div style={{marginTop: 100}}></div>
      <div style={{minHeight: '100vh'}}>
        <AuthorizedComponent {...props}/>
      </div>
    </div>
  );
};

const PrivateRoute = ({component: AuthorizedComponent, ...parentProps}) => {
  return (
    <Route
      {...parentProps}
      render={(props) => (
        isLoggedIn()
          ? (
            <>
              {renderAuthorizedComponent(AuthorizedComponent, props)}
            </>
          )
          : <Redirect to='/login'/>
      )}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.any
};

export default PrivateRoute;