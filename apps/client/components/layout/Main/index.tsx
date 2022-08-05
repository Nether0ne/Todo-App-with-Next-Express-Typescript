import { FC } from "react";
import { Navigation } from "@components/layout/Navigation";
import { Footer } from "@components/layout/Footer";
import { Grid } from "@mui/material";

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const MainLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <Navigation />
      <Grid container justifyContent="center" alignItems="center">
        <Grid component="main" item xs={12} md={10} lg={9}>
          {children}
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            position: "fixed",
            zIndex: 2,
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 0,
            right: 0,
          }}>
          <Footer />
        </Grid>
      </Grid>
    </>
  );
};
