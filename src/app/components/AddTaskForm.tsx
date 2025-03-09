"use client";

import { Send } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useState } from "react";

export const AddTaskForm = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <form className="flex">
      <input
        type="text"
        placeholder="新しいタスクを入力してください"
        className="grow rounded-s bg-slate-200 p-2"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button variant="contained" endIcon={<Send />}>
        追加
      </Button>
    </form>
  );
};
