"use client";

import { useAuth } from "@/app/Hooks/useAuth";
import { CircularProgress } from "@mui/material";

const SignUpForm = () => {
  const { authAction, authForm } = useAuth();

  if (authAction.isSubmittingLoading) {
    return <CircularProgress />;
  }

  return (
    <form onSubmit={authAction.handleSignUp} data-testid="signup-form">
      <h2>Sign Up</h2>
      <div>
        <label htmlFor="signup-email">Email:</label>
        <input
          type="email"
          id="signup-email"
          value={authForm.email}
          onChange={(e) => authForm.setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="signup-password">Password:</label>
        <input
          type="password"
          id="signup-password"
          value={authForm.password}
          onChange={(e) => authForm.setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">サインアップ</button>
    </form>
  );
};

export default SignUpForm;
