import './styles/actions';

import React, {Component} from 'react';

import Tags from './Tags'

const Actions = ({ actions }) => {
  const renderActionCards = () => {
    return actions.map((action, i) => {
      return (
        <div key={`actionCard_${i}`} className='action-card'>
          <i className='fa fa-bolt action-card--icon' /> {action.provider} - {action.hook.name} <br/>
          <i className='fa fa-tag action-card--icon' /> <Tags tags={action.tags} /> <br/>
          <i className='fa fa-coffee action-card--icon' /> {action.actionProvider} - {action.action} <br/>
        </div>
      );
    })
  }

  return (
    <div className='actions'>
    { renderActionCards() }
    </div>
  );
}

export default Actions
