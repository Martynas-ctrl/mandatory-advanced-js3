import React, { Component } from 'react'
import registerImg from '../RegisterImg.svg'
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

//In the constructor we have email and password which are going to hold data the user types in for email and password.
//We also have register set to false, it will be updated to true in onSubmit function and when it is set to true the user will be redirected/send to the Login page.
//We also have hasError set to false which is going to be updated to true in catch if something goes wrong and if it is updated to true then errorMsg in state with empty string will be updated with text Oh no! This account already exists! and then this error message will pop up.
export class RegisterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            register: false,
            hasError: false,
            errorMsg: '',
        }
    }

    //When the user submit Register button the email and password data will be posted to server , it will also prevent page from refreshing and register will be updated/set to true.
    onSubmit = e => {

        e.preventDefault();

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

        axios.post(url + 'register', 
        {
            email: this.state.email,
            password: this.state.password,
        })
        .then(response => {
            this.setState( {
                register: true
            } ) 
        })
        .catch(error => {
            this.setState({
                hasError: true,
            })
            if(this.state.hasError) {
                this.setState({
                    errorMsg: 'This account already exists!'
                })
            }else{
                this.setState({
                    errorMsg: ''
                })
             }
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

    //If register is set to true then the user will be redirected/send to the Login page. Render also contains all the button, label and input elements which are returned to be shown on the screen.
    render() {

        if(this.state.register === true) {
            return <Redirect to='/' />
        }

        return (
            <Router>
                <div className = 'base-container'>
                  <div className='container'>
                    <div className='header'>
                        <div className='image'>
                            <img src={registerImg} />
                        </div>
                    </div>
                    <form className='form'>
                        <div className='form-group'>
                            <label htmlFor='password'>Password</label><br />
                            <input type='password' name='password' className='FormField_Input' placeholder='Enter your password' value={this.state.password} onChange={this.onChangePassWord} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='email'>E-Mail Address</label> <br />
                            <input type='email' id='email' className='FormField_Input' nmae='email' placeholder='Enter your email' value={this.state.email} onChange={this.onChangeEmail} />
                        </div>
                    </form>
                        <div className='footer'>
                            <button onClick={this.onSubmit} type='button' className='btn'>Sign Up</button>
                            <p>{this.state.errorMsg}</p>
                        </div>
                  </div>
                </div>
            </Router>
        )
    }
}

export default RegisterPage