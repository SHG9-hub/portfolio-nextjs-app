import { addTodo } from "@/app/lib/firebase/firebaseservice";
import { Send } from "@mui/icons-material";
import { Button, Input } from "@mui/material";
import React, { useState } from "react";
import { User } from "firebase/auth";
import { mutate } from "swr";

type AddTodoFormProps = {
  user: User;
};

export const AddTodoForm = ({ user }: AddTodoFormProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTodo({ title: inputValue, completed: false, userId: user.uid });
    setInputValue("");
    mutate(user.uid);
  };

  return (
    <form className="flex flex-row gap-2" onSubmit={handleAddTodo}>
      <label htmlFor="new-todo" className="sr-only">
        新しいタスクの名前
      </label>
      <Input
        id="new-todo"
        type="text"
        placeholder="新しいタスクを入力してください"
        autoComplete="off"
        className="grow rounded-s bg-slate-200 p-2"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        autoFocus
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
