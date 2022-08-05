import { setAuthCookies } from "@helpers/cookies/setAuthCookies";
import { UserLogin } from "@customTypes/User";
import { Box, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import login from "@queries/user/login";

export const LoginForm: FC = () => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<UserLogin>({
    mode: "onChange",
  });
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = (data: UserLogin) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { token } = await login(data);
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
            onChange={onChange}
            error={!!error}
            helperText={error ? error.message : " "}
          />
        )}
        rules={{
          required: "Password required",
        }}
      />
      <LoadingButton
        type="submit"
        loading={isSubmitting}
        disabled={!isValid}
        variant="contained">
        Login
      </LoadingButton>
    </Box>
  );
};
