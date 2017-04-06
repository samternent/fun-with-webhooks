import './styles/demo';

import React, {Component} from 'react';
import {Link} from 'react-router';

import Loader from '../components/Loader';
import Terminal from '../components/Terminal';
import Create from '../components/Create';
import Actions from '../components/Actions';

import flux from 'tbg-flux-factory';
const demo = flux.getStore('demo');

class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, demo.getState(), {
      selectedApp: null,
      showTask: false
    })
    this.handleStoreUpdate = this.handleStoreUpdate.bind(this);
  }

  componentWillMount() {
    demo.addChangeListener(this.handleStoreUpdate);
  }

  componentWillUnmount() {
    demo.removeChangeListener(this.handleStoreUpdate);
  }

  handleStoreUpdate() {
    this.setState(demo.getState(), (state) => {
    })
  }

  getProvider() {
    return this.state.providers[ this.state.action.provider ] || {}
  }

  render() {
    return (
      <div className='main-app'>
        {(this.props.loading) ? <Loader /> : (
          <div className='demo'>
            <div className='pure-g'>
              <div className='pure-u-1 pure-u-md-1-2'>
                <Create loading={this.state.loading} provider={this.getProvider()} action={this.state.action} />
              </div>
              <div className='pure-u-1 pure-u-md-1-2'>
                <Terminal />
                <Actions />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Demo;
