"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpUser } from "@/app/lib/firebase/firebaseauth";

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
      const user = await signUpUser(email, password);

      if (user) {
        console.log("User signed up successfully!");
        Promise.resolve().then(() => {
          router.push("/dashboard");
        });
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="signup-form">
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
