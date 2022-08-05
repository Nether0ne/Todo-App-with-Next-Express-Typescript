import { Box, Link, Typography } from "@mui/material";
import { FC } from "react";

const githubLink = "https://github.com/Nether0ne";

export const Footer: FC = () => {
  return (
    <Box component="footer">
      <Typography variant="body2" textAlign={"center"}>
        © {new Date().getFullYear()}, made by{" "}
        <Link href={githubLink}>nether</Link>
      </Typography>
    </Box>
  );
};
