"use client";

import { useTodo } from "@/app/Hooks/useTodo";
import {
  CircularProgress,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const SignUpForm = () => {
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
      onSubmit={authAction.handleSignUp}
      data-testid="signup-form"
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
        Sign Up
      </Typography>
      <TextField
        label="Email"
        type="email"
        id="signup-email"
        value={authForm.email}
        onChange={(e) => authForm.setEmail(e.target.value)}
        autoComplete="current-password"
        required
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        id="signup-password"
        value={authForm.password}
        onChange={(e) => authForm.setPassword(e.target.value)}
        autoComplete="current-password"
        required
        fullWidth
      />
      <Button type="submit" variant="contained">
        サインアップ
      </Button>
    </Box>
  );
};

export default SignUpForm;
