"use client";

import { addTodo } from "@/app/lib/firebase/firebaseservice";
import { Send } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { User } from "firebase/auth";
import { mutate } from "swr";
import { useTodo } from "@/app/Hooks/useTodo";

type AddTodoFormProps = {
  user: User;
};

export const AddTodoForm = ({ user }: AddTodoFormProps) => {
  const { inputValue, setInputValue, handleAddTodo } = useTodo(user.uid);

  return (
    <form className="flex" onSubmit={handleAddTodo}>
      <input
        type="text"
        placeholder="新しいタスクを入力してください"
        className="grow rounded-s bg-slate-200 p-2"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button
        disabled={!inputValue.trim()}
        type="submit"
        variant="contained"
        endIcon={<Send />}
      >
        追加
      </Button>
    </form>
  );
};
