import './styles/create';
import './styles/select-search';

import React, {Component} from 'react';

import Tags from './Tags';
import Loader from './Loader';
import SelectSearch from 'react-select-search';

import {getStore} from 'tbg-flux-factory';
const demo = getStore('demo');

const CreateTeamwork = ({ hooks, loading, tags }) => {

  const onSelectChange = (hook) => {
    demo.setState({ hook })
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
          <Tags tags={tags} />
          <div className='btn' onClick={ onCreateAction }>Create</div>
        </div>
      )}
    </div>
  );
}

export default CreateTeamwork
