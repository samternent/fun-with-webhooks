import './styles/header';

import React, {Component} from 'react';
import {Link} from 'react-router';

import LogoSVG from './LogoSVG'

import {getStore} from 'tbg-flux-factory';
const authStore = getStore('auth')

const Header = ({ account, title }) => {
  const handleLogout = () => {
    authStore.Actions.logout()
  }

  return (
    <header className='header'>
      <div className='header__content'>
        {
          (!!account) ? (
            <div className='header__user'>
              <div
                className='header__user__avatar'
                style={
                  {
                    backgroundImage: `url(${account ? account['avatar-url'] : null})`
                  }
                }
              />
              <div
                onClick={handleLogout}
                className='header__logout'
              >
                  <i className="fa fa-power-off header__logout__icon" />
              </div>
            </div>
          ) : null
        }
        <Link to='/'>
          <LogoSVG />
        </Link>
        <h1 className="header__title">{title}</h1>
      </div>
    </header>
  );
}

export default Header
