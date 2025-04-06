"use client";

import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/lib/firebase/firebase"; // Firebase設定と認証関数をインポート
import { signOutUser } from "@/app/lib/firebase/firebaseauth";

const AuthStatus = () => {
  // useAuthStateフックを使用して認証状態を取得
  const [user, loading, error] = useAuthState(auth);

  const handleSignOut = async () => {
    try {
      await signOutUser(); // signOutUser関数を呼び出し
      console.log("User signed out successfully!");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    // useAuthStateが返すerrorオブジェクトにはmessageプロパティがある
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      {user ? (
        <div>
          {/* userオブジェクトにはemailプロパティがある */}
          <p>Welcome, {user.email || "User"}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <p>You are not logged in.</p>
        // Optionally show Login/Sign Up links here
      )}
    </div>
  );
};

export default AuthStatus;
