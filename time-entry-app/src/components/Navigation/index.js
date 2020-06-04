import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <ul>
    <Link className="navbar" to={ROUTES.HOME}>Home</Link>
    <Link className="navbar" to={ROUTES.ACCOUNT}>Account</Link>
    <SignOutButton />
  </ul>
);

const NavigationNonAuth = () => (
  <ul>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </ul>
);

export default Navigation;