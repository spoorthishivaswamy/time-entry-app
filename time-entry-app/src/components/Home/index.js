import React from 'react';
// import Dropdown from 'react-dropdown'
// import 'react-dropdown/style.css';
import { withAuthentication } from '../Session';
import ReactDOM from 'react-dom'
import { AuthUserContext, withAuthorization } from '../Session';

class HomeComponent extends React.Component {
  constructor(props) {

    super(props);
    this.state = { authUser:null,
      value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log(this.state.authUser.uid)
    this.props.firebase.user(this.state.authUser.uid).set({
      projectName:this.state.value
    })
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      },
    );
    console.log(this.state.authUser)
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
      <label>
        Pick your favorite flavor:
        <select value={this.state.value} onChange={this.handleChange}>
          <option value="grapefruit">Grapefruit</option>
          <option value="lime">Lime</option>
          <option value="coconut">Coconut</option>
          <option value="mango">Mango</option>
        </select>
      </label>
      <input type="submit" value="Submit" />
    </form>
    );
  }
}


const Home = () => (
  <AuthUserContext.Consumer>
  {authUser => (
    // <div>
    //   <h1>Account: {authUser.email}</h1>
    // </div>
    authUser? <HomeComponent {...authUser}/>: null
  )}
  </AuthUserContext.Consumer>
)

const condition = authUser => !!authUser;

export default withAuthentication(Home);