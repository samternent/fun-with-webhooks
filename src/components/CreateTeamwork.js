import './styles/create';
import './styles/select-search';

import React, {Component} from 'react';

import Tags from './Tags';
import Loader from './Loader';
import LogoSVG from './LogoSVG';
import SelectSearch from 'react-select-search';

import {getStore} from 'tbg-flux-factory';
const demo = getStore('demo');

const CreateTeamwork = ({ hooks, loading, tags, action }) => {

  const onSelectChange = (hook) => {
    demo.Actions.setHook(hook)
  }

  const onCreateAction = () => {
    const { action } = demo.getState()

    console.log(action)
  }


  const renderTWhooksList = () => {
    if (hooks.length < 1) return null

    const options = [];

    hooks.forEach(({id, name}) => {
      if (name.indexOf('TASK.') < 0) return null

      options.push({ value: id, name })
    })

    return (
      <SelectSearch
        options={options}
        onChange={onSelectChange}
        placeholder="Select Action" />
    )
  }

  return (
    <div>
      {(loading) ? <Loader /> : (
        <div className='create-teamwork'>
          <div>{ renderTWhooksList() }</div>
          <div className='fancy'>
            <span><i className='fa fa-tag header__title--icon' /></span>
          </div>
          <Tags tags={tags} selectedTags={action.tags} />
          <div className='fancy'>
            <span><i className='fa fa-coffee header__title--icon' /></span>
          </div>
          <div className='select-app'>
            <button className='app-btn btn-svg'><LogoSVG /></button>
            <button className='app-btn btn-fa'><i className='fa fa-github' /></button>
          </div>
          <div className='btn' onClick={ onCreateAction }>Create</div>
        </div>
      )}
    </div>
  );
}

export default CreateTeamwork
