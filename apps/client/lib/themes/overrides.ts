import { ThemeOptions } from "@mui/material";

const overrides = {
  MuiCssBaseline: {
    styleOverrides: {
      scrollbarWidth: "thin",
      scrollbarColor: "#3f51b5 palette.background",

      "&::-webkit-scrollbar": {
        borderRadius: 5,
        width: 3,
      },

      "&::-webkit-scrollbar-thumb": {
        background: "#3f51b5",
        borderRadius: 5,
      },

      "&::-webkit-scrollbar-thumb:hover": {
        background: "#344397",
        borderRadius: 10,
      },
    },
  },
} as ThemeOptions["components"];

export default overrides;
