import React, { Component } from 'react';
const axios = require('axios');

const backendURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

const Welcome = ({ user, onSignOut }) => {
  return (
    <div>
      Welcome <strong>{user.username}</strong>!
      <button onClick={onSignOut}>Sign out</button>
    </div>
  );
};
class LoginForm extends Component {
  handleSignIn = (e) => {
    e.preventDefault();
    let username = this.refs.username.value;
    let password = this.refs.password.value;
    this.props.onSignIn(username, password);
  };

  render() {
    return (
      <form onSubmit={this.handleSignIn}>
        <h3>Sign in</h3>
        <input type='text' ref='username' placeholder='enter you username' />
        <input type='password' ref='password' placeholder='enter password' />
        <input type='submit' value='Login' />
      </form>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      session: null,
    };
  }

  fetchData = async () => {
    try {
      const response = await axios.get(`${backendURL}/dummy`);
      // console.log(response);
      this.setState({
        session: response.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  checkSession = async () => {
    try {
      const response = await axios.get(`${backendURL}/session`);
      if (response.data !== 'no active session') {
        this.setState({
          user: {
            username: response.data,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  signIn = async (username, password) => {
    try {
      const response = await axios.post(`${backendURL}/session`, {
        username,
        password,
      });
      // console.log(response);
      this.setState({
        user: {
          username,
        },
      });
      await this.fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  signOut = async () => {
    try {
      await axios.delete(`${backendURL}/session`);
      this.setState({
        user: null,
        session: null,
      });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount = () => {
    this.checkSession();
    this.fetchData();
  };

  render() {
    return (
      <div>
        <h1>App</h1>
        {this.state.user ? (
          <Welcome user={this.state.user} onSignOut={this.signOut} />
        ) : (
          <LoginForm onSignIn={this.signIn} />
        )}
        <h2>{this.state.session}</h2>
      </div>
    );
  }
}

export default App;
