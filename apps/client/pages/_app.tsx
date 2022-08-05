import * as React from "react";
import type { AppProps } from "next/app";
import { FC } from "react";
import { CssBaseline, useTheme } from "@mui/material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { SSRProvider } from "react-aria";
import { AuthProvider } from "@providers/Auth.provider";
import { SnackbarProvider } from "notistack";
import ThemeProvider from "@providers/Theme.provider";
import SnackbarCloseButton from "@components/misc/snackbar/SnackbarCloseButton";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const theme = useTheme();

  return (
    <SSRProvider>
      <AuthProvider user={pageProps.user}>
        <ThemeProvider {...theme}>
          <CssBaseline />
          <SnackbarProvider
            maxSnack={3}
            action={(snackbarKey) => (
              <SnackbarCloseButton snackbarKey={snackbarKey} />
            )}>
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </AuthProvider>
    </SSRProvider>
  );
};

export default App;
