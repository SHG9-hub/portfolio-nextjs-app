"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { AddTodoForm } from "@/app/components/todos/AddTodoForm";
import { TodoList } from "@/app/components/todos/TodoList";
import { signOutUser } from "../lib/firebase/firebaseauth";
import { auth } from "../lib/firebase/firebase";
import useSWR from "swr";
import { fetchUserTodo } from "../lib/firebase/firebaseservice";

export default function Dashboard() {
  const [user, authLoading, authError] = useAuthState(auth);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const router = useRouter();

  const userId = user?.uid;
  const {
    data: todos,
    error: todosError,
    isLoading,
    mutate,
  } = useSWR(userId, fetchUserTodo);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    const isSignOutSuccessful = await signOutUser();

    setIsSigningOut(false);

    if (!isSignOutSuccessful) {
      setSignOutError("サインアウト中にエラーが発生しました。");
      return;
    }
  };

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return <div className="text-center mt-10">ロード中...</div>;
  }

  if (authError) {
    return (
      <div className="text-center mt-10">
        エラーが発生しました。もう一度お試しください。
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <div className="text-center mt-10">データを読み込み中...</div>;
  }

  if (todosError) {
    return (
      <div className="text-center mt-10 text-red-500">{todosError.message}</div>
    );
  }

  if (todos)
    return (
      <main className="mx-auto mt-10 max-w-xl space-y-10">
        <h1 className="text-center text-4xl">Next.js Todoアプリ</h1>
        <div>
          <p>ようこそ, {user.email}!</p>
          {signOutError && <p className="text-red-500">{signOutError}</p>}
          <button onClick={handleSignOut} disabled={isSigningOut}>
            {isSigningOut ? "処理中..." : "サインアウト"}
          </button>
        </div>
        <div className="space-y-5">
          <AddTodoForm user={user} mutate={mutate} />
          <div className="rounded bg-slate-200 p-5">
            <TodoList todoList={todos} />
          </div>
        </div>
      </main>
    );
}
