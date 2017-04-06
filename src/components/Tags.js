import './styles/tags';

import React, {Component} from 'react';

import {getStore} from 'tbg-flux-factory';
const demo = getStore('demo');

const Tags = ({ tags }) => {

  const onSelectTags = (id) => {
    demo.Actions.addTag(id)
  }

  const renderTags = () => {
    return tags.map(({name, id, color}) => {
      return (
        <div
          style={{borderColor: color, color: color}}
          key={`tag_${id}`}
          onClick={onSelectTags.bind(null, id)}
          className='tag'>{name}</div>
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
