import './styles/tags';

import React, {Component} from 'react';

import {getStore} from 'tbg-flux-factory';
const demo = getStore('demo');

const Tags = ({ tags }) => {

  const renderTags = () => {
    return tags.map((tag, i) => {
      return (
        <div key={`tag_${i}`} className='tag'>{tag.name}</div>
      );
    })
  }

  return (
    <div className='tags'>
      { renderTags() }
    </div>
  );
}

export default Tags
