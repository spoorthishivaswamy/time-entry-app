import React, { Component } from 'react';
import { compose } from 'recompose';
import ReactDOM from 'react-dom'
import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Timer from '../Timer';
import ms from 'pretty-ms'


const HomePage = () => (
  <div>
    <h1 style={{ color: "red" }}>Time Entry App</h1>

    <Messages />
  </div>
);

class MessagesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      taskName: '',
      loading: false,
      messages: [],
      time: null
    };
  }
  timerCallback = (data) => {
    console.log(data)
    this.setState({ time: data })
  }
  onChangeText = event => {
    this.setState({ text: event.target.value });
  };
  onChangeTaskName = event => {
    this.setState({ taskName: event.target.value });
  }
  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };
  onCreateMessage = (event, authUser) => {
    console.log("uid--", authUser.uid)
    this.props.firebase.messages().push({
      text: this.state.text,
      taskName: this.state.taskName,
      time: this.state.time,
      userId: authUser.email,
    });

    this.setState({ text: '' });
    this.setState({ taskName: '' })
    event.preventDefault();
  };

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.messages().on('value', snapshot => {
      const messageObject = snapshot.val();

      if (messageObject) {
        console.log(messageObject)
        const messageList = Object.keys(messageObject).map(key => ({
          ...messageObject[key],
          uid: key,
        }));

        this.setState({ messages: messageList, loading: false });
      } else {
        this.setState({ messages: null, loading: false });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  bool = (messages, authUser) => {
    var flag = false;
    messages.map(message => {
      // console.log("message.userId ", message.userId )
      // console.log("authUser.email", authUser.email)
      if (message.userId === authUser.email){
        console.log("authUser.email", authUser.email)
        flag=true;
      }
    })
    return flag
  };

  render() {
    const { text, taskName, messages, loading } = this.state;


    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div >
            <form onSubmit={event => this.onCreateMessage(event, authUser)}>
              <input
                type="text"
                value={taskName}
                onChange={this.onChangeTaskName}
              />
              <label>
                Pick your project:
              <select value={text} onChange={this.onChangeText}>
                  <option value="P1">Project 1</option>
                  <option value="P2">Project 2</option>
                  <option value="P3">Project 3</option>
                  <option value="P4">Project 4</option>
                </select>
              </label>
              <Timer callbackFromParent={this.timerCallback} />
              <button className="submit-btn" type="submit" value="Submit"> Submit</button>
            </form>
            <hr />
            {loading && <div>Loading ...</div>}

            {messages && this.bool(messages, authUser) ? (
              <MessageList authUser={authUser.uid} messages={messages} onRemoveMessage={this.onRemoveMessage} />
            ) : (
                <div><h2>The list is Empty ...</h2></div>
              )}
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const MessageList = ({ messages, onRemoveMessage }) => (

  <ul>
    {messages.map(message => (
      <MessageItem
        key={message.uid}
        message={message}
        onRemoveMessage={onRemoveMessage}
      />
    ))}
  </ul>
);

const MessageItem = ({ message, onRemoveMessage }) => (
  <ul>
    <li>
      <strong>{message.userId}</strong>
      <strong> {message.text}</strong>
      <strong>{message.taskName}</strong>
      <strong>{(message.time)}</strong>
      <button
        type="button"
        onClick={() => onRemoveMessage(message.uid)}>
        Delete
    </button>
    </li>
  </ul>
);

const Messages = withFirebase(MessagesBase);
const condition = authUser => !!authUser;
export default compose(
  withAuthorization(condition),
)(HomePage);