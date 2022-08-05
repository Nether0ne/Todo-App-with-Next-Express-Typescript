import { AddCircleOutlineOutlined } from "@mui/icons-material";
import { FC, useState } from "react";
import { TodoWrapper } from "@components/cards/Todo/Wrapper";
import { Todo, TodoAdd } from "@customTypes/Todo";
import addTodo from "@queries/todo/add";
import { useSnackbar } from "notistack";
import { AddTodoForm } from "@/components/forms/todo/Add";

interface Props {
  onCreate: (todo: Todo) => void;
}

export const AddTodoCard: FC<Props> = ({ onCreate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const changeState = () => setIsEditing(!isEditing);

  return !isEditing ? (
    <TodoWrapper
      onClick={changeState}
      sx={{ cursor: "pointer", alignItems: "center" }}>
      <AddCircleOutlineOutlined sx={{ fontSize: "5rem" }} />
    </TodoWrapper>
  ) : (
    <TodoWrapper>
      <AddTodoForm
        onSend={async (todo: TodoAdd) => {
          try {
            const addedTodo = await addTodo(todo);
            changeState();
            onCreate(addedTodo);
          } catch (e: unknown) {
            if (e instanceof Error) {
              enqueueSnackbar(e.message, { variant: "error" });
            }
          }
        }}
        onCancel={changeState}
      />
    </TodoWrapper>
  );
};
