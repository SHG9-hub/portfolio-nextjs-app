"use client";

import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/lib/firebase/firebase";
import { signOutUser } from "@/app/lib/firebase/firebaseauth";

const AuthStatus = () => {
  const [user, loading, error] = useAuthState(auth);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      console.log("User signed out successfully!");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email || "User"}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default AuthStatus;
