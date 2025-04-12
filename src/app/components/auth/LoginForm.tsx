"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInUser } from "@/app/lib/firebase/firebaseauth";
import { Validator } from "@/app/lib/utility/validators";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Add validation checks
    if (!Validator.isValidEmail(email)) {
      setError("有効なメールアドレスを入力してください。");
      return;
    }
    if (!password) {
      // Check if password is empty
      setError("パスワードを入力してください。");
      return;
    }

    setIsLoading(true);
    const user = await signInUser(email, password);
    setIsLoading(false);

    if (!user) {
      setError("サインインに失敗しました。もう一度お試しください。");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label htmlFor="login-email">Email:</label>
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          aria-invalid={!!error}
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
          aria-invalid={!!error}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "ログイン中..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
