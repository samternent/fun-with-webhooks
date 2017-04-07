import './styles/terminal';

import React, {Component} from 'react';
import ReactDOM from 'react-dom'

import io from 'socket.io-client'

const socket = io('http://localhost:4200')

class Terminal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    }
  }

  componentWillMount() {
    const that = this;

    socket.on('action', (data) => {

      const messages = that.state.messages;
      messages.push(data)
      that.setState({messages})
    });
  }

  scrollToBottom() {
    const node = ReactDOM.findDOMNode(this.refs.bottom);
    node.scrollTop = node.scrollHeight;
  }

  componentDidMount() {
      this.scrollToBottom();
  }

  componentDidUpdate() {
      this.scrollToBottom();
  }

  renderMessages() {
    return this.state.messages.map((message, i) => {
      return (
        <div className='terminal-block' key={`message_${i}`}>
          <i className={`fa fa-${message.icon} action-card--icon`} />{message.type} <span className='on-app-name'>{message.message}</span>
        </div>
      )
    })
  }

  render() {
    console.log(this.state.messages)
    return (
      <div className='terminal' ref='bottom'>
        <div className='terminal-block' >
          <i className={`fa fa-exclamation action-card--icon`} />Let's have fun with <span className='on-app-name'>WEBHOOKS</span>
        </div>
        {this.renderMessages()}
      </div>
    );
  }
}

export default Terminal;
