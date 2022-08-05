import { IconButton } from "@mui/material";
import { Close as IconClose } from "@mui/icons-material";
import { useSnackbar, SnackbarKey } from "notistack";
import * as React from "react";
import { FC } from "react";

interface Props {
  snackbarKey: SnackbarKey;
}

const SnackbarCloseButton: FC<Props> = ({ snackbarKey }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)}>
      <IconClose />
    </IconButton>
  );
};

export default SnackbarCloseButton;
