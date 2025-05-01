"use client";

import { useAuth } from "@/app/Hooks/useAuth";

const SignInForm = () => {
  const { authAction, authForm } = useAuth();

  return (
    <form onSubmit={authAction.handleSignIn} data-testid="login-form">
      <h2>Login</h2>
      <div>
        <label htmlFor="login-email">Email:</label>
        <input
          type="email"
          id="login-email"
          value={authForm.email}
          onChange={(e) => authForm.setEmail(e.target.value)}
          required
          disabled={authAction.isSubmittingLoading}
        />
      </div>
      <div>
        <label htmlFor="login-password">Password:</label>
        <input
          type="password"
          id="login-password"
          value={authForm.password}
          onChange={(e) => authForm.setPassword(e.target.value)}
          required
          disabled={authAction.isSubmittingLoading}
          autoComplete="current-password"
        />
      </div>
      <button type="submit" disabled={authAction.isSubmittingLoading}>
        {authAction.isSubmittingLoading ? "ログイン中..." : "Login"}
      </button>
    </form>
  );
};

export default SignInForm;
