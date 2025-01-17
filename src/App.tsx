import { useEffect, useState } from "react";
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

export const App = () => {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>();
  const { signOut } = useAuthenticator();

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
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);


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
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}