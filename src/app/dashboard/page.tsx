"use client";

import { AddTodoForm } from "@/app/components/todos/AddTodoForm";
import { TodoList } from "@/app/components/todos/TodoList";
import { useAuth } from "../Hooks/useAuth";
import { useTodo } from "../Hooks/useTodo";
import { CircularProgress } from "@mui/material";

export default function Dashboard() {
  const { authUserState, authAction } = useAuth();
  const { todos } = useTodo(authUserState.user?.uid);

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
