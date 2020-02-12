import jwt from "jsonwebtoken";
import './App.css';
import TodoList from './components/TodoList';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { BrowserRouter as Router, Route  } from 'react-router-dom';
import { Link } from 'react-router-dom'
import {token$, updateToken} from './components/Store';
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';

//Here in constructor we have navigate set to false, it will be updated to true in signOut function and when it is set to true the user will be redirected/send to the Login page. 
//tokenDeath is set to false in state, when it is updated to true in componentDidUpdate and when the user have been logged in 1 hour, the user will automatically be logged out and send to Login page.
export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        token: token$.value,
        tokenDeath: false,
        tokenTimer: null,
    }
}

componentDidMount() {
  this.subscription = token$.subscribe((token) => {
    this.setState({ token })
    this.date = new Date().getTime() / 1000;

    if(!token) {
      return;
    }

    const decoded = jwt.decode(token)
    this.setState({
      tokenTimer: decoded.exp
    })
  });
}

componentWillUnmount() {
  this.subscription.unsubscribe();
}

//A function to sign out.
signOut = () => {
  updateToken(null);
}

componentDidUpdate() {
    if(this.date > this.state.tokenTimer && this.state.tokenDeath) {
      this.setState({
        tokenDeath: true
      })
    }
}

//Here I use Links to the Login page , Register page and the Todo page for a shared navigation and Router to navigate between Login , Register and Todo pages.
render() {

    let user = null;

    if (this.state.token) {
      const decoded = jwt.decode(this.state.token);
      user = decoded.email;
      console.log(decoded);
    }
    
    return (
      <Router>
          {this.state.tokenDeath ? <Redirect to='/' /> : null}
          {!this.state.token ? <Redirect to='/'  /> : null}
          <div className="App">
            <header className="App-header">
            <Link to='/'  className='FormTitle__Link'>Sign In</Link> or <Link to='/RegisterPage' className='FormTitle__Link'>Sign Up</Link> <button className='signOut' onClick={this.signOut}>Sign Out</button> 
            <h1 className='gmail'>{user}</h1>
            </header>
            <main>
            <Route path='/' exact render={ () =>  <LoginPage  /> } />
            <Route path='/RegisterPage' render= { () => <RegisterPage /> } />
            <Route path='/TodoList' render= { () => <TodoList /> } />
            </main>
          </div>
     </Router>
    )
  }
}

export default App