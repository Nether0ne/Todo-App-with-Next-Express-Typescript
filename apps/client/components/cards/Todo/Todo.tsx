import { Todo, TodoEdit } from "@customTypes/Todo";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { FC, useState } from "react";
import { TodoWrapper } from "@components/cards/Todo/Wrapper";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { AddTodoForm } from "@/components/forms/todo/Add";
import editTodo from "@queries/todo/edit";
import { useSnackbar } from "notistack";
import deleteTodo from "@queries/todo/delete";
import { EditTodoForm } from "@/components/forms/todo/Edit";

interface Props {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onRemove: (todo: Todo) => void;
}

export const TodoCard: FC<Props> = ({ todo, onUpdate, onRemove }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing(!isEditing);
  const { description, color, completed, createdAt } = todo;

  const updateTodo = async (todo: TodoEdit) => {
    try {
      const editedTodo = await editTodo(todo);
      if (isEditing) toggleEdit();
      onUpdate(editedTodo);
    } catch (e: unknown) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const removeTodo = async (todo: Todo) => {
    try {
      await deleteTodo(todo);
      onRemove(todo);
    } catch (e: unknown) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  return (
    <TodoWrapper color={color}>
      {!isEditing ? (
        <Grid container flexDirection="row" flexWrap={"nowrap"} gap={1}>
          <Grid item p={2} bgcolor={color} />
          <Grid
            container
            flexDirection="column"
            flexWrap={"nowrap"}
            flexShrink={1}
            justifyContent={"space-between"}
            pr={1}>
            <Grid
              item
              display={"flex"}
              flexWrap="nowrap"
              justifyContent={"space-around"}
              pt={0.5}>
              <Grid container spacing={0.5}>
                <Grid item>
                  <Tooltip
                    title={
                      completed ? "Todo is completed" : "Mark todo as completed"
                    }>
                    <div>
                      <IconButton
                        disabled={completed}
                        onClick={() =>
                          updateTodo({ ...todo, completed: true })
                        }>
                        <CheckIcon color={completed ? "success" : "inherit"} />
                      </IconButton>
                    </div>
                  </Tooltip>
                </Grid>
                {!completed && (
                  <Grid item>
                    <Tooltip title="Edit todo">
                      <IconButton onClick={toggleEdit}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
              </Grid>
              <Grid item>
                <Tooltip title={"Remove todo"}>
                  <IconButton onClick={async () => await removeTodo(todo)}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid item>
              <Typography
                variant="body1"
                sx={{
                  maxWidth: "100%",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  maxHeight: 150,
                  overflowY: "auto",
                  overflowWrap: "anywhere",
                }}>
                {description}
              </Typography>
            </Grid>
            <Grid item textAlign={"right"}>
              <Typography variant="body2">
                {new Date(createdAt).toLocaleTimeString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <EditTodoForm todo={todo} onSend={updateTodo} onCancel={toggleEdit} />
      )}
    </TodoWrapper>
  );
};
