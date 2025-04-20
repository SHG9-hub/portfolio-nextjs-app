"use client";

import { Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import React, { useState } from "react";
import { EditModal } from "./EditModal";
import { Todo } from "@/app/lib/firebase/firebaseservice";

type TaskProps = {
  todo: Todo;
};

export const Task = (props: TaskProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      key={props.todo.title}
      className="flex items-center gap-3 rounded bg-white p-2"
    >
      <label className="flex grow items-center gap-3 hover:cursor-pointer">
        <div className="flex items-center">
          <input
            readOnly
            type="checkbox"
            className="size-5"
            checked={props.todo.completed}
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
      <EditModal isOpen={isOpen} toggle={toggle} />
    </div>
  );
};
