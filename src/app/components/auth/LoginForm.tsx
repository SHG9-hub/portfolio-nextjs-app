"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInUser } from "@/app/lib/firebase/firebaseauth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const user = await signInUser(email, password);
    setIsLoading(false);

    if (!user) {
      console.error("Sign in error: user is null or undefined");
      setError(new Error("Sign in failed"));
      return;
    }

    console.log("User signed in successfully!");
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      <div>
        <label htmlFor="login-email">Email:</label>
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="login-password">Password:</label>
        <input
          type="password"
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "ログイン中..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
