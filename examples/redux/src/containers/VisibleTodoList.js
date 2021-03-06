import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'
import { match } from 'match-toy';

/*
// Original code
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}
*/

// Refactored using Match-toy
const getVisibleTodos = match
  .case('todos, "SHOW_ALL"', ({ todos }) => todos)
  .case('[...todos({ completed@: true, id, text })], "SHOW_COMPLETED"', ({ todos }) => todos)
  .case('[...todos({ completed@: false, id, text })], "SHOW_ACTIVE"', ({ todos }) => todos)
  .case('_, filter', ({ filter }) => {
    throw new Error('Unknown filter: ' + filter);
  })
  .catch((e) => {
    // Log the error
    console.error('Error caught: ', e);
    // NOTE: Recovery strategy
    // Return an empty array in order to keep
    // the UI working
    return [];
  })
  .end()


const mapStateToProps = (state) => ({
  todos: getVisibleTodos(state.todos, state.visibilityFilter)
})

const mapDispatchToProps = {
  onTodoClick: toggleTodo
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
