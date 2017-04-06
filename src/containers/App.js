import './styles/app'

import React, {Component, cloneElement} from 'react';
import {browserHistory} from 'react-router';

import Header from '../components/Header'

import {getStore, addChangeListener} from 'tbg-flux-factory';
const authStore = getStore('auth');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      // default state

    }, authStore.getState());

    this.handleStoreUpdate = this.handleStoreUpdate.bind(this);
  }
  componentWillMount() {
    authStore.addChangeListener(this.handleStoreUpdate);
  }

  componentWillUnmount() {
    authStore.removeChangeListener(this.handleStoreUpdate);
  }

  handleStoreUpdate() {
    this.setState(Object.assign({}, authStore.getState()), () => {
      // local status updates on change
      if (!this.state.loggedIn) {
        browserHistory.push('/login')
      }
    });
  }

  render() {
    return (
      <div>
        <Header title='Teamwork App Starter' account={this.state.account} />
        {cloneElement(this.props.children, this.state)}
        <footer className='footer'></footer>
      </div>
    );
  }
}

export default App;

App.contextTypes = {
  router: React.PropTypes.object
};
