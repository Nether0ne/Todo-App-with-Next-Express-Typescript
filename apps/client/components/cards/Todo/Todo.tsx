import { Todo, TodoEdit } from "@customTypes/Todo";
import {
  CircularProgress,
  darken,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { TodoWrapper } from "@components/cards/Todo/Wrapper";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
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
  const [isRemoving, setIsRemoving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

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
            pr={1}
          >
            <Grid
              item
              display={"flex"}
              flexWrap="nowrap"
              justifyContent={"space-around"}
              pt={0.5}
            >
              <Grid container spacing={0.5}>
                <Grid item>
                  <Tooltip
                    title={
                      isCompleting
                        ? "Marking todo as completed..."
                        : completed
                        ? "Todo is completed"
                        : "Mark todo as completed"
                    }
                  >
                    <div>
                      <IconButton
                        disabled={completed || isCompleting}
                        onClick={async () => {
                          setIsCompleting(true);
                          await updateTodo({ ...todo, completed: true });
                          setIsCompleting(false);
                        }}
                      >
                        {isCompleting ? (
                          <CircularProgress size={"1.5rem"} color={"success"} />
                        ) : (
                          <CheckIcon
                            color={completed ? "success" : "inherit"}
                          />
                        )}
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
                <Tooltip
                  title={!isRemoving ? "Remove todo" : "Removing todo..."}
                >
                  <div>
                    <IconButton
                      disabled={isRemoving}
                      onClick={async () => {
                        setIsRemoving(true);
                        await removeTodo(todo);
                        setTimeout(() => setIsRemoving(false), 5000);
                      }}
                    >
                      {isRemoving ? (
                        <CircularProgress size={"1.5rem"} color={"error"} />
                      ) : (
                        <CloseIcon />
                      )}
                    </IconButton>
                  </div>
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

                  scrollbarColor: `${color} background`,
                  "::-webkit-scrollbar-thumb": {
                    background: color,
                    borderRadius: 5,
                  },
                  "::-webkit-scrollbar-thumb:hover": {
                    background: darken(color, 0.25),
                  },
                }}
              >
                {description}
              </Typography>
            </Grid>
            <Grid item textAlign={"right"}>
              <Typography component="span" variant="body2">
                {new Date(createdAt).toLocaleTimeString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
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
