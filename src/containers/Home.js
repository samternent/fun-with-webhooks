import './styles/home';

import React, {Component} from 'react';
import {Link} from 'react-router';

import Loader from '../components/Loader';
import Slider, { Transitions } from 'tbg-react-slider'

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
            <Slider transition={Transitions.Slide} autoplay={false} >
              <div> <img src="http://placehold.it/700x490" /> </div>
              <div> <img src="http://placehold.it/700x490" /> </div>
              <div> <img src="http://placehold.it/700x490" /> </div>
              <div> <img src="http://placehold.it/700x490" /> </div>
            </Slider>
            <Link to='/demo'><div className='btn'>Demo</div></Link>
          </div>
        )}
      </div>
    );
  }
}

export default Home;
