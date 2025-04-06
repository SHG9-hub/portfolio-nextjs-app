"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpUser } from "@/app/lib/firebase/firebaseauth"; // Import signUpUser

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const user = await signUpUser(email, password); // Call signUpUser
      if (user) {
        console.log("User signed up successfully!");
        router.push("/dashboard"); // リダイレクト先を指定
      }
    } catch (err: any) {
      // エラーをany型としてキャッチ（より具体的な型も可能）
      console.error("Sign up error:", err);
      setError(err); // エラーオブジェクトをstateにセット
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      <div>
        <label htmlFor="signup-email">Email:</label>
        <input
          type="email"
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
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
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "登録中..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUpForm;
