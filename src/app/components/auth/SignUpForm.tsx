"use client";

import { useAuth } from "@/app/Hooks/useAuth";

const SignUpForm = () => {
  const { authAction, authForm } = useAuth();
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
          disabled={authAction.isSubmittingLoading}
        />
      </div>
      <div>
        <label htmlFor="signup-password">Password:</label>
        <input
          type="password"
          id="signup-password"
          value={authForm.password}
          onChange={(e) => authForm.setEmail(e.target.value)}
          required
          disabled={authAction.isSubmittingLoading}
        />
      </div>
      <button type="submit" disabled={authAction.isSubmittingLoading}>
        {authAction.isSubmittingLoading ? "登録中..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUpForm;
