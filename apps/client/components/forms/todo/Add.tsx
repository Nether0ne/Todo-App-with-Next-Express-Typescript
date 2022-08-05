import { Todo, TodoAdd } from "@customTypes/Todo";
import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField } from "@mui/material";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
  onSend: (todo: TodoAdd) => Promise<void>;
  onCancel: () => void;
}

const defaultValues = {
  description: "",
  color: "#abcdef",
};

export const AddTodoForm: FC<Props> = ({ onSend, onCancel }) => {
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<TodoAdd>({
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const onSubmit = (data: TodoAdd) => {
    return new Promise(async (resolve) => {
      resolve(onSend(data));
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
      }}>
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
          variant="contained">
          Create
        </LoadingButton>
        <Button variant="contained" color="error" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};
