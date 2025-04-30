"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AddTodoForm } from "@/app/components/todos/AddTodoForm";
import { TodoList } from "@/app/components/todos/TodoList";
import { signOutUser } from "../lib/firebase/firebaseauth";
import { auth } from "../lib/firebase/firebase";
import useSWR from "swr";
import { fetchUserTodo } from "../lib/firebase/firebaseservice";
import { useAuth } from "../Hooks/useAuth";

export default function Dashboard() {
  const { user, authLoading, isAuthLoading, handleSignOut } = useAuth();

  const userId = user?.uid;
  const {
    data: todos,
    error: todosError,
    isLoading,
  } = useSWR(userId, fetchUserTodo);

  if (authLoading) {
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

  if (todos && user)
    return (
      <main className="mx-auto mt-10 max-w-xl space-y-10">
        <h1 className="text-center text-4xl">Next.js Todoアプリ</h1>
        <div>
          <p>ようこそ, {user.email}!</p>
          <button onClick={handleSignOut} disabled={isAuthLoading}>
            {isAuthLoading ? "処理中..." : "サインアウト"}
          </button>
        </div>
        <div className="space-y-5">
          <AddTodoForm user={user} />
          <div className="rounded bg-slate-200 p-5">
            <TodoList todoList={todos} />
          </div>
        </div>
      </main>
    );
}
