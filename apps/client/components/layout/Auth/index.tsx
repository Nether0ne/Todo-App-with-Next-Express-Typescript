import { Grid, Paper } from "@mui/material";
import { FC } from "react";

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const AuthLayout: FC<Props> = ({ children }) => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh" }}>
      <Grid item xs={12} sm={8} md={6} lg={4} xl={3} p={2}>
        <Paper elevation={6}>{children}</Paper>
      </Grid>
    </Grid>
  );
};
