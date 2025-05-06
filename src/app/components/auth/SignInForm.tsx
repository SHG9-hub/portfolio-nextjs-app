"use client";

import { useTodo } from "@/app/Hooks/useTodo";
import { CircularProgress } from "@mui/material";

const SignInForm = () => {
  const { authAction, authForm } = useTodo();

  if (authAction.isSubmittingLoading) {
    return <CircularProgress />;
  }

  return (
    <form onSubmit={authAction.handleSignIn} data-testid="signin-form">
      <h2>Login</h2>
      <div>
        <label htmlFor="signin-email">Email:</label>
        <input
          type="email"
          id="signin-email"
          value={authForm.email}
          onChange={(e) => authForm.setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="signin-password">Password:</label>
        <input
          type="password"
          id="signin-password"
          value={authForm.password}
          onChange={(e) => authForm.setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      <button type="submit">サインイン</button>
    </form>
  );
};

export default SignInForm;
