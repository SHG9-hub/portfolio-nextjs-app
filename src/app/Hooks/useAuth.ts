import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase/firebase";
import { useEffect, useState } from "react";
import { signInUser, signOutUser, signUpUser } from "../lib/firebase/firebaseauth";
import { useSnackbar } from "notistack"
import { useRouter } from "next/navigation";
import { Validator } from "../lib/utility/validators";

export const useAuth = () => {
    const [user, authLoading, authError] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();


    const validateSignInData = (): boolean => {
        if (!Validator.isValidEmail(email)) {
            enqueueSnackbar('有効なメールアドレスを入力してください。', { variant: 'warning' });
            return false;
        }
        if (!password) {
            enqueueSnackbar('パスワードを入力してください。', { variant: 'warning' });
            return false;
        }
        return true;
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateSignInData()) {
            return;
        }

        setIsAuthLoading(true);
        const user = await signInUser(email, password);
        setIsAuthLoading(false);

        if (!user) {
            enqueueSnackbar('サインインに失敗しました。もう一度お試しください。', { variant: 'error' });
            return;
        }
        router.push("/dashboard");
    };



    const validateSignUpFormData = (): boolean => {
        if (!Validator.isValidEmail(email)) {
            enqueueSnackbar('有効なメールアドレスを入力してください。', { variant: 'warning' });
            return false;
        }

        if (!Validator.isValidPassword(password)) {
            enqueueSnackbar('パスワードは8文字以上である必要があります。', { variant: 'warning' });
            return false;
        }
        return true;
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateSignUpFormData()) {
            return;
        }

        setIsAuthLoading(true);
        const user = await signUpUser(email, password);
        setIsAuthLoading(false);

        if (!user) {
            enqueueSnackbar('サインアップに失敗しました。もう一度お試しください。', { variant: 'error' });
            return;
        }

        router.push("/dashboard");
    };

    const handleSignOut = async () => {
        setIsAuthLoading(true);
        const isSignOutSuccessful = await signOutUser();
        setIsAuthLoading(false);
        if (!isSignOutSuccessful) {
            enqueueSnackbar('サインアウト中にエラーが発生しました。', { variant: 'error' });
            return;
        }
        router.push("/")
    };

    return {
        user,
        authLoading,
        handleSignOut,
        isAuthLoading,

        email,
        setEmail,
        password,
        setPassword,
        handleSignIn,

        handleSignUp,
    };
}