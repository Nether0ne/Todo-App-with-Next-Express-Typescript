import { Todo, TodoEdit } from "@customTypes/Todo";
import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField } from "@mui/material";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  todo: Todo;
  onSend: (todo: TodoEdit) => Promise<void>;
  onCancel: () => void;
}

export const EditTodoForm: FC<Props> = ({ todo, onSend, onCancel }) => {
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<TodoEdit>({
    mode: "onChange",
    defaultValues: todo,
  });

  const onSubmit = (data: TodoEdit) => {
    return new Promise(async (resolve) => {
      resolve(onSend(data));
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
      }}
    >
      <Controller
        name="description"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            multiline
            maxRows={4}
            label="Task description"
            variant="outlined"
            color={!!value ? "success" : !error ? "primary" : "error"}
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error ? error.message : " "}
          />
        )}
        rules={{
          required: "Task description is required",
          maxLength: {
            value: 255,
            message: "Task description is too long",
          },
          validate: (value) =>
            value.trim().length > 0 || "Task description cannot be empty",
        }}
      />
      <Controller
        name="color"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            type="color"
            label="Color"
            variant="outlined"
            color={!!value ? "success" : !error ? "primary" : "error"}
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error ? error.message : " "}
          />
        )}
        rules={{
          required: "Color is required",
        }}
      />
      <Box display={"flex"} justifyContent={"space-between"}>
        <LoadingButton
          type="submit"
          loading={isSubmitting}
          disabled={!isValid}
          variant="contained"
        >
          Update
        </LoadingButton>
        <Button variant="contained" color="error" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};
