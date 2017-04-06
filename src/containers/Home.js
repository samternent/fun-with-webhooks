import './styles/home';

import React, {Component} from 'react';
import {Link} from 'react-router';

import Loader from '../components/Loader';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return (
      <div className='main-app'>
        {(this.props.loading) ? <Loader /> : (
          <div className='home'>
            <Link to='/demo'><div className='btn'>Demo</div></Link>
          </div>
        )}
      </div>
    );
  }
}

export default Home;
