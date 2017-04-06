import './styles/login';

import React, {Component} from 'react';
import {browserHistory} from 'react-router';

import Loader from '../components/Loader'
import Header from '../components/Header'

import {getStore} from 'tbg-flux-factory';
const auth = getStore('auth');

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      // default state
      loading: false,
    }, auth.getState());

    this.handleLogin = this.handleLogin.bind(this);
    this.handleStoreUpdate = this.handleStoreUpdate.bind(this);
  }
  componentWillMount() {
    auth.addChangeListener(this.handleStoreUpdate);
  }

  componentWillUnmount() {
    auth.removeChangeListener(this.handleStoreUpdate);
  }

  componentDidMount() {
    auth.Actions.getSession()
  }

  handleStoreUpdate() {
    this.setState(auth.getState(), () => {
      if (!this.state.loggedIn) return false
      const { location } = this.props;

      if (location.state && location.state.nextPathname) {
        browserHistory.push(location.state.nextPathname)
      } else {
        browserHistory.push('/');

      }
    })
  }

  handleLogin(e) {
    e.preventDefault()

    const teamname = this.refs.teamname.value;
    const APIKey = this.refs.key.value;

    auth.Actions.login({teamname, APIKey})
  }

  render() {
    return (
      <div>
        <Header title='Fun with Webhooks' account={null} />
          <div className='main-app'>
            {(this.state.loading) ? <Loader /> : (
              <form className="login-form">
                <input ref="teamname" className="login__input" placeholder="Installation Name" type='text'/>
                <input ref="key" className="login__input" placeholder="API Key" type='password'/>
                <button className="btn" onClick={this.handleLogin}>Login</button>
              </form>
            )}
          </div>
      </div>
    );
  }
}

export default Login;
