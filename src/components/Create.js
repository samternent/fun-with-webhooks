import './styles/create';
import './styles/select-search';

import React, {Component} from 'react';

import LogoSVG from './LogoSVG';
import Tags from './Tags';
import SelectSearch from 'react-select-search';

import {getStore} from 'tbg-flux-factory';
const demo = getStore('demo');

const Create = ({ twhooks }) => {


  const onSelectChange = (hook) => {
    if (hook.name.indexOf('TASK') < 0) return null
    demo.setState({
      hook
    })
  }


  const renderTWhooksList = () => {
    if (twhooks.length < 1) return null

    const options = twhooks.map(({id, name}) => {
      return { value: id, name }
    })

    return (
      <SelectSearch
        options={options}
        onChange={onSelectChange}
        placeholder="Select Action" />
    )
  }


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
      <div>{ renderTWhooksList() }</div>
      <div className='fancy'>
        <span><i className='fa fa-tag header__title--icon tag' /></span>
      </div>
      <Tags />
      <div className='btn'>Create</div>
    </div>
  );
}

export default Create
