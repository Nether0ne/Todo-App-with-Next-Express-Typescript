import { createTheme } from "@mui/material/styles";
import overrides from "@themes/overrides";

const light = createTheme({
  palette: {
    mode: "light",
  },
  components: overrides,
});

export default light;
