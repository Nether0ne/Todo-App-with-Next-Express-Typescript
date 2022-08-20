import { FC } from "react";
import { Navigation } from "@components/layout/Navigation";
import { Footer } from "@components/layout/Footer";
import { Grid } from "@mui/material";

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const MainLayout: FC<Props> = ({ children }) => {
  return (
    <Grid
      container
      display={"flex"}
      flexDirection={"column"}
      minHeight={"100vh"}
    >
      <Grid container flex={"0 0 auto"}>
        <Navigation />
      </Grid>
      <Grid
        component="main"
        item
        alignSelf={"center"}
        minWidth={{
          xs: "100%",
          lg: "80%",
        }}
        xs={12}
        md={10}
        lg={9}
        xl={6}
        sx={(theme) => ({
          [theme.breakpoints.up(0)]: {
            display: "flex",
            flexGrow: 1,
            flexBasis: 0,
          },
        })}
      >
        {children}
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", flex: "0 0 auto", py: 2, m: "0 auto" }}
      >
        <Footer />
      </Grid>
    </Grid>
  );
};
