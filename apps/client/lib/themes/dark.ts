import { createTheme } from "@mui/material/styles";
import overrides from "@themes/overrides";

const dark = createTheme({
  palette: {
    mode: "dark",
  },
  components: overrides,
});

export default dark;
