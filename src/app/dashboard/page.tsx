"use client";

import { AddTodoForm } from "@/app/components/todos/AddTodoForm";
import { TodoList } from "@/app/components/todos/TodoList";
import useSWR from "swr";
import { fetchUserTodo } from "../lib/firebase/firebaseservice";
import { useAuth } from "../Hooks/useAuth";

export default function Dashboard() {
  const { authUserState, authAction } = useAuth();

  const userId = authUserState.user?.uid;
  const {
    data: todos,
    error: todosError,
    isLoading,
  } = useSWR(userId, fetchUserTodo);

  if (authUserState.isAuthLoading) {
    return <div className="text-center mt-10">ロード中...</div>;
  }

  if (isLoading) {
    return <div className="text-center mt-10">データを読み込み中...</div>;
  }

  if (todosError) {
    return (
      <div className="text-center mt-10 text-red-500">{todosError.message}</div>
    );
  }

  if (todos && authUserState.user)
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
