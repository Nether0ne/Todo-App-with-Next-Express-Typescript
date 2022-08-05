import { setAuthCookies } from "@/lib/helpers/cookies/setAuthCookies";
import register from "@queries/user/register";
import { UserRegister } from "@customTypes/User";
import { LoadingButton } from "@mui/lab";
import { Box, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { FC } from "react";
import { useForm, Controller } from "react-hook-form";

interface FormInput {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: FC = () => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    getValues,
    formState: { isValid, isSubmitting },
    trigger,
  } = useForm<FormInput>({
    mode: "onChange",
  });
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = (input: FormInput) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, username, password } = input;
        const data: UserRegister = { email, username, password };
        const { token } = await register(data);
        setAuthCookies(token);

        resolve(await router.push("/"));
      } catch (e: unknown) {
        let errorMessage = "Something went wrong";
        if (e instanceof Error) {
          const { message } = e;

          if (message) {
            errorMessage = message;
          }
        }

        enqueueSnackbar(errorMessage, { variant: "error" });
        reject();
      }
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
      }}>
      <Controller
        name="email"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            label="* Email address"
            variant="outlined"
            color={!!value ? "success" : !error ? "primary" : "error"}
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error ? error.message : " "}
          />
        )}
        rules={{
          required: "Email required",
          pattern: {
            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            message: "Invalid email address",
          },
        }}
      />
      <Controller
        name="username"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            label="* Username"
            variant="outlined"
            color={!!value ? "success" : !error ? "primary" : "error"}
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error ? error.message : " "}
          />
        )}
        rules={{
          required: "Username required",
          minLength: {
            value: 3,
            message: "Username must be at least 3 characters",
          },
          maxLength: {
            value: 20,
            message: "Username must be at most 20 characters",
          },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message:
              "Username can only contain letters, numbers and underscores",
          },
        }}
      />
      <Controller
        name="password"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            type="password"
            label="* Password"
            variant="outlined"
            color={!!value ? "success" : !error ? "primary" : "error"}
            value={value}
            onChange={(e) => {
              onChange(e);
              return trigger("confirmPassword");
            }}
            error={!!error}
            helperText={error ? error.message : " "}
          />
        )}
        rules={{
          required: "Password required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
          maxLength: {
            value: 20,
            message: "Password must be at most 20 characters",
          },
          pattern: {
            value: /^[a-zA-Z0-9]+$/,
            message: "Password must contain only letters and numbers",
          },
        }}
      />
      <Controller
        name="confirmPassword"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            type="password"
            label="* Password Confirmation"
            variant="outlined"
            color={!!value ? "success" : !error ? "primary" : "error"}
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error ? error.message : " "}
          />
        )}
        rules={{
          required: "Password confirmation required",
          validate: {
            passwordConfirmationMatches: (value: string) =>
              value === getValues("password") || "Passwords do not match",
          },
        }}
      />
      <LoadingButton
        type="submit"
        loading={isSubmitting}
        disabled={!isValid}
        variant="contained">
        Register
      </LoadingButton>
    </Box>
  );
};
