"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpUser } from "@/app/lib/firebase/firebaseauth";
import { Validator } from "@/app/lib/utility/validators";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!Validator.isValidEmail(email)) {
      setError("有効なメールアドレスを入力してください。");
      return;
    }

    if (!Validator.isValidPassword(password)) {
      setError("パスワードは8文字以上である必要があります。");
      return;
    }

    setIsLoading(true);
    const user = await signUpUser(email, password);
    setIsLoading(false);

    if (!user) {
      setError("サインアップに失敗しました。もう一度お試しください。");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} data-testid="signup-form">
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label htmlFor="signup-email">Email:</label>
        <input
          type="email"
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          aria-invalid={!!error}
        />
      </div>
      <div>
        <label htmlFor="signup-password">Password:</label>
        <input
          type="password"
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          aria-invalid={!!error}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "登録中..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUpForm;
