import React, { Component } from 'react'
import loginImg from '../undraw_Login.svg'
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import {token$, updateToken} from './Store';
import { Redirect } from 'react-router-dom';

//In the constructor we have email and password which are going to hold data the user types in for email and password.
//We also have login set to false, it will be updated to true in onSubmit function and when it is set to true the user will be redirected/send to the Todo page.
//We also have hasError set to false which is going to be updated to true in catch if something goes wrong and if it is updated to true then error message will pop up.
export class LoginPage extends Component {
     constructor(props) {
         super(props);
         this.state = {
             email: '',
             password: '',
             login: false,
             token: token$.value,
             hasError: false,
         }
    }

    //When the user submit Login button the email and password data will be posted to server and updated in the token, it will also prevent page from refreshing and login will be set/updated to true.
    onSubmit = (e) => {
        
        e.preventDefault();

        let adata = {
            email: this.state.email,
            password: this.state.password,
        };
        
        let url =' http://3.120.96.16:3002/';

        let emailValidation = /^([A-Z\d\.-]+)@([A-Z\d-]+)\.([A-Z]{2,8})(\.[A-Z]{5,8})?/i.test(this.state.email);
        let passwordValidation = /^[A-Za-z]?\w{3,14}?$/i.test(this.state.password);

        if( !emailValidation ) {
            return null
        }
        else if ( !passwordValidation ) {
            return null
        }
        else {

        axios.post( url + 'auth', adata) 
            .then(response => {
                this.setState({ login: true});
                updateToken(response.data.token);
            })
            .catch(error => {
                updateToken(null)
                this.setState({
                    hasError: true
                })
            })
        }
    }

    //The value of email will change to what I type in.
    onChangeEmail = e => {
        this.setState({
            email: e.target.value,
        })
    }
      
    //The value of password will change to what I type in.
    onChangePassWord = e => {
        this.setState({
            password: e.target.value,
        })
    }

    //If login is set to true then the user will be redirected/send to the Todo page. Render also contains all the button, label and input elements which are returned to be shown on the screen.
    //if hasError is set to true then error message will pop up.
    render() {

        if(this.state.login === true) {
            return <Redirect to='/TodoList' />
        }

        if(this.state.hasError === true) {
            return <p>This account does not exist!</p>
        }

        return (
            <Router>
                <div className = 'base-container'>
                  <div className='container'>
                        <div className='image'>
                            <img src={loginImg} />
                        </div>
                    <form className='form'>
                        <div className='form-group'>
                            <label htmlFor='email'>E-Mail Address</label> <br />
                            <input type='email' id='email' className='FormField_Input' nmae='email' placeholder='Enter your email' value={this.state.email} onChange={this.onChangeEmail} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='email'>Password</label><br />
                            <input type='password' name='password' className='FormField_Input' placeholder='password'  value={this.state.password} onChange={this.onChangePassWord}/>
                        </div>
                    </form>
                        <div className='footer'>
                            <button onClick={this.onSubmit} type='button' className='btn'>Login</button>
                        </div>
                  </div>
                </div>
            </Router>
        )
    }
}

export default LoginPage