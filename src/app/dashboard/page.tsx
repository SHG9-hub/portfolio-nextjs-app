"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { AddTaskForm } from "@/app/components/todos/AddTaskForm";
import { TodoList } from "@/app/components/todos/TodoList";
import { signOutUser } from "../lib/firebase/firebaseauth";
import { auth } from "../lib/firebase/firebase";
import useSWR from "swr";
import { fetchUserTodo } from "../lib/firebase/firebaseservice";

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const userId = user?.uid;
  const {
    data: todos,
    error: todosError,
    isLoading,
  } = useSWR(userId, fetchUserTodo);

  // デバッグ用のログです。終わったら消します。。
  useEffect(() => {
    console.log("loafing", isLoading);
    console.log("fetch", todos);
    console.log("エラー", todosError);
  }, [todos, isLoading]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      alert("サインアウト中にエラーが発生しました。");
    }
  };

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
        エラーが発生しました。もう一度お試しください。
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto mt-10 max-w-xl space-y-10">
      <h1 className="text-center text-4xl">Next.js Todoアプリ</h1>
      <div>
        <p>ようこそ, {user.email}!</p>
        <button onClick={handleSignOut}>サインアウト</button>
      </div>
      <div className="space-y-5">
        <AddTaskForm />
        <div className="rounded bg-slate-200 p-5">
          {todos && <TodoList todoList={todos} />}
        </div>
      </div>
    </main>
  );
}
