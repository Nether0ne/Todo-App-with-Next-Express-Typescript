import * as React from "react";
import type { AppProps } from "next/app";
import { FC } from "react";
import { CssBaseline, useTheme } from "@mui/material";
import { AuthProvider } from "@providers/Auth.provider";
import { SnackbarProvider } from "notistack";
import ThemeProvider from "@providers/Theme.provider";
import SnackbarCloseButton from "@components/misc/snackbar/SnackbarCloseButton";
import createEmotionCache from "@/lib/helpers/emotion/createEmotionCache";
import { CacheProvider, EmotionCache } from "@emotion/react";

const clientSideEmotionCache = createEmotionCache();

interface Props extends AppProps {
  emotionCache: EmotionCache;
}

const App: FC<Props> = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) => {
  const theme = useTheme();

  return (
    <CacheProvider value={emotionCache}>
      <AuthProvider user={pageProps.user}>
        <ThemeProvider {...theme}>
          <CssBaseline />

          <SnackbarProvider
            maxSnack={3}
            action={(snackbarKey) => (
              <SnackbarCloseButton snackbarKey={snackbarKey} />
            )}
          >
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </AuthProvider>
    </CacheProvider>
  );
};

export default App;
