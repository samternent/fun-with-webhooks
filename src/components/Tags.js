import './styles/tags';

import React, {Component} from 'react';

import {getStore} from 'tbg-flux-factory';
const tw = getStore('tw');

const Tags = ({ twhooks }) => {

  return (
    <div className='tags'>
      these are tags
    </div>
  );
}

export default Tags
