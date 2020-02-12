import React, { Component } from 'react'
import FlipMove from 'react-flip-move';

//In todoItems I collect/save data/todos from the server and later use it to render that data on the screen in Todo page.
export class TodoItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todoItems: props.todos
        }
    }

    //In render I map every todo/data in the server and return every todo in a p tag. I also do animation for every todo I create.
    render() {
        
        let addTodo = this.state.todoItems.map(todo => {
            return (
                <p key={todo.id}>{todo.content}</p>
            )
        })

        return (
            <div>
                <ul className='todoListMain'>
                    <FlipMove duration={300} easing='linear'>
                        {addTodo}
                    </FlipMove>
                </ul>
            </div>
        );
    }
}

export default TodoItems