"use client";

import { useAuth } from "@/app/Hooks/useAuth";

const SignInForm = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isAuthLoading,
    handleSignIn,
  } = useAuth();

  return (
    <form onSubmit={handleSignIn} data-testid="login-form">
      <h2>Login</h2>
      <div>
        <label htmlFor="login-email">Email:</label>
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isAuthLoading}
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
          disabled={isAuthLoading}
          autoComplete="current-password"
        />
      </div>
      <button type="submit" disabled={isAuthLoading}>
        {isAuthLoading ? "ログイン中..." : "Login"}
      </button>
    </form>
  );
};

export default SignInForm;
