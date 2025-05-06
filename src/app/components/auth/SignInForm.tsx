"use client";

import { useTodo } from "@/app/Hooks/useTodo";
import {
  CircularProgress,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const SignInForm = () => {
  const { authAction, authForm } = useTodo();

  if (authAction.isSubmittingLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] w-full">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={authAction.handleSignIn}
      data-testid="signin-form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" component="h2">
        Sign in
      </Typography>
      <TextField
        label="Email"
        type="email"
        id="signin-email"
        value={authForm.email}
        onChange={(e) => authForm.setEmail(e.target.value)}
        autoComplete="current-password"
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        id="signin-password"
        value={authForm.password}
        onChange={(e) => authForm.setPassword(e.target.value)}
        autoComplete="current-password"
        fullWidth
      />
      <Button type="submit" variant="contained">
        サインイン
      </Button>
    </Box>
  );
};

export default SignInForm;
