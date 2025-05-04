"use client";

import { AddTodoForm } from "@/app/components/todos/AddTodoForm";
import { TodoList } from "@/app/components/todos/TodoList";
import { CircularProgress } from "@mui/material";
import { useTodo } from "../Hooks/useTodo";
import useSWR from "swr";
import { fetchUserTodo } from "../lib/firebase/firebaseservice";

export default function Dashboard() {
  const { authUserState, authAction } = useTodo();
  const { data: todos } = useSWR(authUserState.user?.uid, fetchUserTodo);

  if (!todos) {
    return <CircularProgress />;
  }

  if (todos)
    return (
      <main className="mx-auto mt-10 max-w-xl space-y-10">
        <h1 className="text-center text-4xl">Next.js Todoアプリ</h1>
        <div>
          <p>ようこそ, {authUserState.user.email}!</p>
          <button
            onClick={authAction.handleSignOut}
            disabled={authAction.isSubmittingLoading}
          >
            {authAction.isSubmittingLoading ? "処理中..." : "サインアウト"}
          </button>
        </div>
        <div className="space-y-5">
          <AddTodoForm user={authUserState.user} />
          <div className="rounded bg-slate-200 p-5">
            <TodoList todoList={todos} />
          </div>
        </div>
      </main>
    );
}
