import React, { useEffect, useState } from "react";
import { withAuthenticator } from '@aws-amplify/ui-react';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>();

type Todo = {
  title: string;
  isDone: boolean;
};


function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<any>(null);


  async function checkUser() {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error getting user:', error);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await client.models.Todo.list();
      console.log(response.data);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Your todo creation function
  async function addTodo({ title }: { title: string | null }) {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      if (title !== null) {
        await client.models.Todo.create({
          title,
          isDone: false,
        });
        await fetchTodos();
      }
      // Your todo creation logic here
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  }
  
  function createTodo () {
    addTodo({ title: window.prompt("Todo content!") });
  }

    // Update todo function
    const updateTodo = async (id: string, isDone: boolean) => {
      try {
        await client.models.Todo.update({
          id,
          isDone
        });
        await fetchTodos();
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    };

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              onChange={(e) => updateTodo(todo.id, e.target.checked)}
            />
            {todo.title}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default withAuthenticator(App);