import { Send } from "@mui/icons-material";
import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";

type ModalProps = {
  isOpen: boolean;
  toggle: () => void;
};

export const EditModal = (props: ModalProps) => {
  return (
    <Modal
      open={props.isOpen}
      onClose={props.toggle}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96  bg-white shadow-xl p-5">
        <Typography className="text-4xl">タスクの更新</Typography>
        <form className="flex">
          <input
            type="text"
            placeholder="新しいタスクを入力してください"
            className="grow rounded-s bg-slate-200 p-5"
          />
          <Button variant="contained" endIcon={<Send />}>
            更新
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
