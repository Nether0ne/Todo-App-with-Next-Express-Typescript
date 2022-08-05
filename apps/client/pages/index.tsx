import initAxios from "@queries/client";
import getCurrentUser from "@queries/user/getCurrentUser";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "@components/layout/Main";
import todoList from "@queries/todo/list";
import { Grid } from "@mui/material";
import { TodoCard } from "@components/cards/Todo/Todo";
import { Todo } from "@customTypes/Todo";
import { AddTodoCard } from "@components/cards/Todo/AddTodo";
import { useEffect, useState } from "react";

interface Props {
  todos: Todo[];
}

const sortTodos = (todos: Todo[]): Todo[] =>
  todos.sort((a: Todo, b: Todo) => {
    if (a.completed === b.completed) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (a.completed) {
      return 1;
    } else {
      return -1;
    }
  });

const Home: NextPage<Props> = ({ todos }) => {
  const [todoList, setTodoList] = useState<Todo[]>(todos);

  useEffect(() => {
    setTodoList(sortTodos(todoList));
  }, [todoList]);

  const handleCreate = (addedTodo: Todo) => {
    setTodoList(sortTodos([addedTodo, ...todoList]));
  };

  const handleRemove = (todo: Todo) => {
    setTodoList(sortTodos(todoList.filter((t: Todo) => t.id !== todo.id)));
  };

  const handleUpdate = (todo: Todo) => {
    setTodoList(
      todoList.map((t: Todo) => {
        if (t.id === todo.id) {
          t.description = todo.description;
          t.color = todo.color;
          t.completed = todo.completed;
        }
        return t;
      }),
    );
  };

  return (
    <>
      <Head>
        <title>Todos page</title>
        <meta name="todos page" content="Todos page of the application" />
      </Head>
      <MainLayout>
        <Grid
          container
          flexWrap={"wrap"}
          alignItems={"flex-start"}
          alignSelf={"center"}
          gap={2}
          px={2}
          pt={4}>
          {todoList.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
          <AddTodoCard onCreate={handleCreate} />
        </Grid>
      </MainLayout>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const client = initAxios(req);
  const user = await getCurrentUser(client);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth",
      },
    };
  }

  const todos = await todoList(client);

  return { props: { user, todos: sortTodos(todos) || [] } };
};
