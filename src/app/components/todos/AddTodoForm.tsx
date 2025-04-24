"use client";

import { addTodo } from "@/app/lib/firebase/firebaseservice";
import { Send } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { User } from "firebase/auth";

type AddTodoFormProps = {
  user: User;
  mutate: () => void;
};

export const AddTodoForm = ({ user, mutate }: AddTodoFormProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTodo({ title: inputValue, completed: false, userId: user.uid });
    setInputValue("");
    mutate();
  };

  return (
    <form className="flex" onSubmit={handleAddTodo}>
      <input
        type="text"
        placeholder="新しいタスクを入力してください"
        className="grow rounded-s bg-slate-200 p-2"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button type="submit" variant="contained" endIcon={<Send />}>
        追加
      </Button>
    </form>
  );
};
