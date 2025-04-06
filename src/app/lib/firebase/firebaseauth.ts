import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from "./firebase";

const signUpUser = async (email: string, password: string): Promise<User | undefined> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("ユーザー登録成功:", userCredential.user);
        return userCredential.user;
    } catch (error: any) {
        console.error("ユーザー登録エラー:", error);
        return undefined
    }
}

const signInUser = async (email: string, password: string): Promise<User | undefined> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("サインイン成功!:", userCredential.user);
        return userCredential.user;
    } catch (error: any) {
        console.error("サインインエラー:", error);
    }
}

const signOutUser = async (): Promise<void> => {
    try {
        await signOut(auth);
        console.log("サインアウト成功");
    } catch (error: any) {
        console.error("サインアウトエラー", error)
    }
}

export { signUpUser, signInUser, signOutUser }