"use client";

import { CircularProgress } from "@mui/material";
import SignInForm from "./components/auth/SignInForm";
import SignUpForm from "./components/auth/SignUpForm";
import { useAuth } from "./Hooks/useTodo";

export default function Home() {
  return (
    <main className="mx-auto mt-10 max-w-xl space-y-10">
      <h1 className="text-center text-4xl">Next.js Todoアプリ</h1>
      <SignUpForm />
      <SignInForm />
    </main>
  );
}
