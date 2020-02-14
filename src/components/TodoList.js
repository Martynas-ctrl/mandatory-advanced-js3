import React, { Component } from 'react';
import TodoImg from '../TodoList.svg'
import axios from 'axios';
import { token$ } from './Store';
import FlipMove from 'react-flip-move';


//In the constructor we have empty array todos that will hold data from the server. The text with empty string will hold the text user types in. 
//Also errorMsg and errorMsg1 will hold error message text when error occurs.
export class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            text: '',
            token: token$.value,
            hasError: false,
            hasError1: false,
            hasError2: false,
            errorMsg: '',
            errorMsg1: '',
        }
    }

    //Here I post the text I type in to the server, save it in the token and then I update todos array in state with object and its data(content/text and id). 
    //I also prevent page from refreshing and always clear text in input after the submit.
    addTodo = (e) => {
        e.preventDefault();
        
        this.subscription = token$.subscribe(token => {
            this.setState({ token });

            let url ='http://3.120.96.16:3002/';
        
            let todo = {
                content: this.state.text
            }
            
            axios.post( url + 'todos', todo, {
                headers: {
                   Authorization: `Bearer ${token}`
                }
           })
            .then(res => {
                let todo = res.data.todo;
                this.setState(prevState => ({
                    todos: [...prevState.todos, todo]
                }))
           })
           .catch(error =>{
                this.setState({
                    hasError: true
                })
           })
           this.state.text = '';
        })   
    }
    
    
    //Here I have delete function to delete todos from the server with help of axios.delete. I use filter to create a new array with all ids from the server except for the one I removed.
    deleteTodo = (id) => {
       
        let url ='http://3.120.96.16:3002/';

        axios.delete(url + 'todos/' + id, {
            headers: {
                Authorization: `Bearer ${this.state.token}`
             }
        })
        .then((response) => {
            this.setState({
                todos: this.state.todos.filter(todo => todo.id !== id)
            })
        })
        .catch((error) => {
            this.setState({
                hasError1: true,
            })
            if(this.state.hasError1) {
                this.setState({
                    errorMsg: 'Oh no! Something went wrong, try to refresh the page'
                })
            }else{
                this.setState({
                    errorMsg: ''
                })
            }
        })
    }
    
    //Here I use componentDidMount to get data from the token in the server with help of axios.get.
    //Then I update that data and send that updated data to empty todos array in state which I later use to map it so that every todo in the server are visible on the screen.
    componentDidMount() {

        this.subscription = token$.subscribe(token => {

        let url ='http://3.120.96.16:3002/';

        axios.get( url + 'todos',  {
            headers: {
                Authorization:  `Bearer ${token}`
            },
        })
        .then(res => {
            this.setState({
                todos: res.data.todos
            }) 
        })
        .catch((error) => {
            this.setState({
                hasError2: true,
            })
            if(this.state.hasError2) {
                this.setState({
                    errorMsg1: 'Oh no! Something went wrong, try to refresh the page'
                })
            }else{
                this.setState({
                    errorMsg1: ''
                })
            }
         })
      })
    }

    //The value of Todo input will change to what I type in.
    onChange = (e) => {
        this.setState({
            text: e.target.value
        })
    }

    //In render I map every todo/data in the server and return every todo in a p tag. I also do animation for every todo I create. Render also contains all the button and input elements which are returned to be shown on the screen.
    render() {

        if(this.state.hasError) {
            return <p>You cannot leave input empty!</p>
        }

        let addTodo = this.state.todos.map(todo => {
            return (
                <p className='todosStyle' key={todo.id} onClick= {() => this.deleteTodo(todo.id)}>{todo.content}</p>
            )
        })

        return (
                <div className = 'base-container'>
                    <div className='container'>
                        <div className='content'>
                            <div className='image'>
                                <img src={TodoImg} />
                            </div>
                            <div className='todoListMain'>
                                <div className='header'>
                                    <form className='todoForm' onSubmit={this.addTodo}>
                                        <input value={this.state.text} onChange={this.onChange} className='FormField_Input' ref = { (a) => this._inputElement = a }
                                            placeholder='Enter todo...'>
                                        </input>
                                        <button onSubmit={this.onSubmit} className='btnTodo' type='submit'>Add</button> 
                                    </form>
                                </div>
                                 <FlipMove duration={300} easing='linear'>
                                    {addTodo}
                                 </FlipMove>
                                 <h1 className='errorMsgTodo'>{this.state.errorMsg}</h1>
                                 <h1 className='errorMsgTodo'>{this.state.errorMsg1}</h1>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

export default TodoList 