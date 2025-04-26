import { Todo, updataTodoTitle } from "@/app/lib/firebase/firebaseservice";
import { Send } from "@mui/icons-material";
import { Box, Button, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import { mutate } from "swr";

type ModalProps = {
  isOpen: boolean;
  toggle: () => void;
  todo: Todo;
};

export const EditModal = (props: ModalProps) => {
  const [updataTitle, setUpDataTitle] = useState(props.todo.title);

  const handleUpdataTodoTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    await updataTodoTitle(props.todo.id, updataTitle);
    mutate(props.todo.userId);
    props.toggle();
  };

  return (
    <Modal
      open={props.isOpen}
      onClose={props.toggle}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[600px] bg-white rounded-lg shadow-2xl p-6 md:p-8">
        <Typography className="text-3xl font-bold mb-4 text-gray-800">
          タスクの更新
        </Typography>
        <form
          className="flex flex-col sm:flex-row gap-3"
          onSubmit={handleUpdataTodoTitle}
        >
          <input
            type="text"
            className="grow rounded bg-slate-100 p-4 border border-slate-200 focus:border-blue-500 focus:outline-none"
            value={updataTitle}
            onChange={(e) => setUpDataTitle(e.target.value)}
            placeholder="タスク名を入力してください"
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<Send />}
            className="px-6 py-3 whitespace-nowrap"
          >
            更新
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
