import './styles/create';
import './styles/select-search';

import React, {Component} from 'react';

import LogoSVG from './LogoSVG';
import Loader from './Loader';
import CreateTeamwork from './CreateTeamwork';

import {getStore} from 'tbg-flux-factory';
const demo = getStore('demo');

const Create = ({ loading, action, provider, actions }) => {

  const setProvider = (provider) => {
    demo.setState({action: Object.assign({}, action, {
      provider
      })
    })

    demo.Actions.getHooks(provider);
    demo.Actions.getTags(provider);
  }

  const renderCreateOptions = () => {
    if (provider.name === 'teamwork') {
      return (
        <CreateTeamwork
          hooks={provider.hooks}
          tags={provider.tags}
          loading={loading}
          action={action}
          actions={actions}
        />
      );
    }
    if (provider.name === 'github') {
      return <div>Empty</div>
    }
  }

  return (
    <div className='create'>
      <div className='fancy'>
        <span><i className='fa fa-bolt header__title--icon bolt' /></span>
      </div>
      <div className='select-app'>
        <button className='app-btn btn-svg' onClick={setProvider.bind(this, 'teamwork')}><LogoSVG /></button>
        <button className='app-btn btn-fa' onClick={setProvider.bind(this, 'github')}><i className='fa fa-github' /></button>
      </div>
      { renderCreateOptions() }
    </div>
  );
}

export default Create
