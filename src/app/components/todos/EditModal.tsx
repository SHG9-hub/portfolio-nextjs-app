import { Todo, updateTodo } from "@/app/lib/firebase/firebaseservice";
import { Send, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { mutate } from "swr";

type ModalProps = {
  isOpen: boolean;
  modalToggle: () => void;
  todo: Todo;
};

export const EditModal = (props: ModalProps) => {
  const [updataTitle, setUpDataTitle] = useState(props.todo.title);

  const handleUpdataTodoTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTodo(props.todo.id, { title: updataTitle });
    enqueueSnackbar("タスクを更新しました！", { variant: "success" });
    props.modalToggle();
    mutate(props.todo.userId);
  };

  return (
    <Modal
      open={props.isOpen}
      onClose={props.modalToggle}
      aria-labelledby="edit-task-modal-title"
      aria-describedby="edit-task-modal-description"
    >
      <Box
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[600px] bg-white rounded-lg shadow-2xl p-6 md:p-8"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-4">
          <Typography
            id="edit-task-modal-title"
            className="text-2xl font-bold text-gray-800"
          >
            タスクの更新
          </Typography>
          <IconButton
            onClick={props.modalToggle}
            aria-label="モーダルを閉じる"
            size="large"
            edge="end"
          >
            <Close />
          </IconButton>
        </div>

        <form
          className="flex flex-row gap-3"
          onSubmit={handleUpdataTodoTitle}
          id="edit-task-form"
        >
          <TextField
            type="text"
            className="grow rounded bg-slate-100 p-4 border border-slate-200 focus:border-blue-500 focus:outline-none"
            value={updataTitle}
            onChange={(e) => setUpDataTitle(e.target.value)}
            placeholder="タスク名を入力してください"
            aria-label="タスク名"
            id="edit-task-modal-description"
          />
          <Button
            type="submit"
            disabled={!updataTitle.trim()}
            variant="contained"
            endIcon={<Send />}
            color="primary"
            aria-label="タスクを更新"
          >
            更新
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
