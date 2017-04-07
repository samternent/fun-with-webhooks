import './styles/tags';

import React, {Component} from 'react';

import {getStore} from 'tbg-flux-factory';
const demo = getStore('demo');

const Tags = ({ tags, selectedTags }) => {

  const onSelectTags = (id) => {
    demo.Actions.addTag(id)
  }

  const isSelectedTag = (tag) => {
    if (!selectedTags) return false;

    var isSelected = false
    selectedTags.forEach((sel) => {
      if (sel.id === tag.id) isSelected = true
    })

    return isSelected;
  }

  const renderTags = () => {
    return tags.map((tag, i) => {
      return (
        <div
          style={{backgroundColor: isSelectedTag(tag) ? tag.color : 'white', borderColor: tag.color, color: isSelectedTag(tag) ? 'white': tag.color}}
          key={`tag_${tag.id}_${new Date().getUTCMilliseconds()}`}
          onClick={onSelectTags.bind(null, tag)}
          className='tag'>{tag.name}</div>
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
