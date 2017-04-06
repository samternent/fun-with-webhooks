import './styles/demo';

import React, {Component} from 'react';
import {Link} from 'react-router';

import Loader from '../components/Loader';
import Terminal from '../components/Terminal';
import Create from '../components/Create';
import Actions from '../components/Actions';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return (
      <div className='main-app'>
        {(this.props.loading) ? <Loader /> : (
          <div className='demo'>
            <div className='pure-g'>
              <div className='pure-u-1 pure-u-md-1-2'>
                <Create />
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

export default Home;
