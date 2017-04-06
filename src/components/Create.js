import './styles/create';
import './styles/select-search';

import React, {Component} from 'react';

import LogoSVG from './LogoSVG';
import SelectSearch from 'react-select-search';

const Create = () => {

  return (
    <div className='create'>
      <div className='fancy'>
        <span><i className='fa fa-bolt header__title--icon bolt' /></span>
      </div>
      <div className='select-app'>
        <button className='app-btn btn-svg'>
          <LogoSVG />
        </button>
      </div>

    </div>
  );
}

export default Create
