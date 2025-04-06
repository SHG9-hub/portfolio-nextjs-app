"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/lib/firebase/firebase";
import { AddTaskForm } from "@/app/components/todos/AddTaskForm";
import { TodoList } from "@/app/components/todos/TodoList";
import { mockTodoList } from "@/app/data/mockdata";
import AuthStatus from "@/app/components/auth/AuthStatus";

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  // ログインしていないユーザーをホームページにリダイレクト
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-center mt-10">ロード中...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        エラーが発生しました: {error.message}
      </div>
    );
  }

  if (!user) {
    return null; // useEffectでリダイレクトされるので、一時的に何も表示しない
  }

  return (
    <main className="mx-auto mt-10 max-w-xl space-y-10">
      <h1 className="text-center text-4xl">マイTodo</h1>
      <AuthStatus />
      <div className="space-y-5">
        <AddTaskForm />
        <div className="rounded bg-slate-200 p-5">
          <TodoList todoList={mockTodoList} />
        </div>
      </div>
    </main>
  );
}
