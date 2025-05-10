import { Delete, Edit } from "@mui/icons-material";
import { Button, Checkbox, IconButton, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { EditModal } from "./EditModal";
import {
  deleteTodo,
  Todo,
  updateTodo,
} from "@/app/lib/firebase/firebaseservice";
import { mutate } from "swr";
import { enqueueSnackbar } from "notistack";

type TaskProps = {
  todo: Todo;
};

export const Task = (props: TaskProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(props.todo.completed);

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleUpdataTodoState = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await updateTodo(props.todo.id, { completed: e.target.checked });
    setIsCompleted(!isCompleted);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("本当に削除しますか？");
    if (confirmed) {
      await deleteTodo(props.todo.id);
      enqueueSnackbar("タスクを削除しました！", { variant: "success" });
      mutate(props.todo.userId);
    }
  };

  return (
    <Paper
      key={props.todo.id}
      elevation={1}
      className="flex items-center gap-3 rounded bg-white p-3 mb-2 transition-all hover:shadow-md"
    >
      <label
        className="flex grow items-center gap-3 hover:cursor-pointer"
        htmlFor={`task-checkbox-${props.todo.id}`}
      >
        <div className="flex items-center">
          <Checkbox
            id={`task-checkbox-${props.todo.id}`}
            checked={isCompleted}
            onChange={handleUpdataTodoState}
            color="primary"
            aria-label={`${isCompleted ? "完了済み" : "未完了"}:${
              props.todo.title
            }`}
          />
        </div>
        <Typography
          className={`${
            isCompleted ? "line-through text-gray-500" : "text-gray-800"
          }`}
        >
          {props.todo.title}
        </Typography>
      </label>
      <div className="flex items-center gap-2">
        <Button
          onClick={toggle}
          variant="outlined"
          color="info"
          size="small"
          startIcon={<Edit />}
          aria-label={`${props.todo.title}を編集`}
        >
          編集
        </Button>
        <IconButton
          onClick={handleDelete}
          aria-label={`${props.todo.title}を削除`}
          size="medium"
          color="error"
        >
          <Delete />
        </IconButton>
      </div>
      <EditModal todo={props.todo} isOpen={isOpen} modalToggle={toggle} />
    </Paper>
  );
};
