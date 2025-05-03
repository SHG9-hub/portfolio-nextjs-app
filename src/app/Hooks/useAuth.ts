import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase/firebase";
import { signInUser, signOutUser, signUpUser } from "../lib/firebase/firebaseauth";
import { useSnackbar } from "notistack"
import { useRouter } from "next/navigation";
import { Validator } from "../lib/utility/validators";
import { useState } from "react";

type AuthFormState = {
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
}

type AuthAction = {
    handleSignIn: (e: React.FormEvent) => Promise<void>;
    handleSignUp: (e: React.FormEvent) => Promise<void>;
    handleSignOut: () => Promise<void>;
    isSubmittingLoading: boolean;
}

type AuthUserState = {
    user: NonNullable<ReturnType<typeof useAuthState>[0]>;
}

export const useAuth = (): {
    authForm: AuthFormState;
    authAction: AuthAction;
    authUserState: AuthUserState;
} => {
    const [user] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmittingLoading, setIsSubmittingLoading] = useState(false);
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
        setIsSubmittingLoading(true);
        const user = await signInUser(email, password);
        setIsSubmittingLoading(false);
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

        setIsSubmittingLoading(true);
        const user = await signUpUser(email, password);
        setIsSubmittingLoading(false);

        if (!user) {
            enqueueSnackbar('サインアップに失敗しました。もう一度お試しください。', { variant: 'error' });
            return;
        }

        router.push("/dashboard");
    };

    const handleSignOut = async () => {
        setIsSubmittingLoading(true);
        const isSignOutSuccessful = await signOutUser();
        setIsSubmittingLoading(false);
        if (!isSignOutSuccessful) {
            enqueueSnackbar('サインアウト中にエラーが発生しました。', { variant: 'error' });
            return;
        }
        router.push("/")
    };

    return {
        authForm: {
            email,
            setEmail,
            password,
            setPassword,
        },
        authAction: {
            handleSignUp,
            handleSignIn,
            handleSignOut,
            isSubmittingLoading,
        },
        authUserState: {
            user: user!,
        }
    };
}