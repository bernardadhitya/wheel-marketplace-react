import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const renderComponent = (Component, props) => {
  return (
    <div className='component-wrapper'>
      <Navbar/>
      <div style={{marginTop: 100}}></div>
      <div style={{minHeight: '100vh'}}>
        <Component {...props}/>
      </div>
    </div>
  );
};

const PublicRoute = ({component: Component, ...parentProps}) => {
  return (
    <Route
      {...parentProps}
      render={(props) => (
        <>
          {renderComponent(Component, props)}
        </>
      )}
    />
  );
};

PublicRoute.propTypes = {
  component: PropTypes.any
};

export default PublicRoute;