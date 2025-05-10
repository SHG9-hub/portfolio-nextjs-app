"use client";

import { AddTodoForm } from "@/app/components/todos/AddTodoForm";
import { TodoList } from "@/app/components/todos/TodoList";
import { CircularProgress } from "@mui/material";
import { useTodo } from "../Hooks/useTodo";
import useSWR from "swr";
import { fetchUserTodo } from "../lib/firebase/firebaseservice";
import { enqueueSnackbar } from "notistack";

export default function Dashboard() {
  const { authUserState, authAction } = useTodo();
  const { data: todos } = useSWR(authUserState.user?.uid, fetchUserTodo);

  if (!todos) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <main className="mx-auto mt-10 max-w-xl space-y-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-center text-4xl font-bold text-gray-800">
        Next.js Todoアプリ
      </h1>
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <p className="font-medium">{authUserState.user.email}でログイン中。</p>
      </div>
      <div className="space-y-6">
        <AddTodoForm user={authUserState.user} />
        <div className="rounded-lg bg-slate-100 p-5 shadow-sm">
          <TodoList todoList={todos} />
        </div>
      </div>
      <button
        onClick={authAction.handleSignOut}
        disabled={authAction.isSubmittingLoading}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        {authAction.isSubmittingLoading ? "処理中..." : "サインアウト"}
      </button>
    </main>
  );
}
