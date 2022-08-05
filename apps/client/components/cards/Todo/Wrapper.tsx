import { Grid, Paper, SxProps } from "@mui/material";
import { FC } from "react";

interface Props {
  children: React.ReactNode[] | React.ReactNode;
  color?: string;
  onClick?: () => void;
  sx?: SxProps;
}

export const TodoWrapper: FC<Props> = ({ children, color, onClick, sx }) => {
  const singleChild = !Array.isArray(children);
  return (
    <Paper
      item
      component={Grid}
      onClick={onClick}
      sx={sx}
      xs={12}
      sm={6}
      md={5}
      lg={4}
      xl={3}
      minHeight={230}
      border={`2px solid ${color}`}
      borderRadius={2}
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"center"}>
      {children}
    </Paper>
  );
};
