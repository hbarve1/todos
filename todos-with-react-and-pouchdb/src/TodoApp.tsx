import React, { useState, useEffect } from 'react';
import PouchDB from 'pouchdb';

interface Todo {
  _id: string;
  _rev?: string;
  text: string;
  completed: boolean;
}

const TodoApp: React.FC = () => {
  const [db, setDb] = useState<PouchDB.Database<Todo> | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    // Open the database connection and save a reference to the database instance
    const newDb = new PouchDB<Todo>('mydb');
    setDb(newDb);

    // Fetch all todos from the database and update the state variable
    newDb.allDocs({ include_docs: true }).then(result => {
      setTodos(result.rows.map(row => row.doc));
    });

    // Close the database connection when the component unmounts
    return () => {
      newDb.close();
    };
  }, []);

  const addTodo = () => {
    // Add a new todo to the database
    db?.put({
      _id: new Date().toISOString(),
      text: inputValue,
      completed: false
    }).then(() => {
      // Fetch all todos from the database and update the state variable
      db?.allDocs({ include_docs: true }).then(result => {
        setTodos(result.rows.map(row => row.doc));
        setInputValue('');
      });
    }).catch((err) => {
      console.error(err);
    });
  };

  const updateTodo = (todo: Todo) => {
    // Update the completed status of a todo document
    db?.put({
      _id: todo._id,
      _rev: todo._rev,
      text: todo.text,
      completed: !todo.completed
    }).then(() => {
      // Fetch all todos from the database and update the state variable
      db?.allDocs({ include_docs: true }).then(result => {
        setTodos(result.rows.map(row => row.doc));
      });
    }).catch((err) => {
      console.error(err);
    });
  };

  return (
    <div>
      <h1>Todo App</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <input type="checkbox" checked={todo.completed} onChange={() => updateTodo(todo)} />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
          </li>
        ))}
      </ul>
      <div>
        <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} />
        <button onClick={addTodo}>Add Todo</button>
      </div>
    </div>
  );
};

export default TodoApp;
