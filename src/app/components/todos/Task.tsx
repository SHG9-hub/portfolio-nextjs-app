"use client";

import { Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import React, { useState } from "react";
import { EditModal } from "./EditModal";
import { Todo, updataTodoState } from "@/app/lib/firebase/firebaseservice";
import { mutate } from "swr";

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
    await updataTodoState(props.todo.id, e.target.checked);
    setIsCompleted(!isCompleted);
  };

  return (
    <div
      key={props.todo.id}
      className="flex items-center gap-3 rounded bg-white p-2"
    >
      <label className="flex grow items-center gap-3 hover:cursor-pointer">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="size-5"
            checked={isCompleted}
            onChange={handleUpdataTodoState}
          />
        </div>
        <span>{props.todo.title}</span>
      </label>
      <Button onClick={toggle} variant="outlined" color="info" size="medium">
        編集
      </Button>
      <IconButton aria-label="delete" size="large" color="error">
        <Delete />
      </IconButton>
      <EditModal todo={props.todo} isOpen={isOpen} toggle={toggle} />
    </div>
  );
};
