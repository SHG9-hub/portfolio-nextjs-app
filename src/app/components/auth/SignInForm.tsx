"use client";

import { useAuth } from "@/app/Hooks/useAuth";
import { CircularProgress } from "@mui/material";

const SignInForm = () => {
  const { authAction, authForm } = useAuth();

  if (authAction.isSubmittingLoading) {
    return <CircularProgress />;
  }

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
          autoComplete="current-password"
        />
      </div>
      <button type="submit">サインイン</button>
    </form>
  );
};

export default SignInForm;
