import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { act } from "react";
import SignInForm from "@/app/components/auth/SignInForm";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/Hooks/useTodo", () => ({
  useTodo: jest.fn(() => ({
    authForm: {
      email: "",
      setEmail: jest.fn((value) => {
        mockAuthForm.email = value;
      }),
      password: "",
      setPassword: jest.fn((value) => {
        mockAuthForm.password = value;
      }),
    },
    authAction: {
      handleSignIn: jest.fn((e) => {
        e.preventDefault();
        if (mockAuthForm.email === "invalid-email") {
          mockEnqueueSnackbar("有効なメールアドレスを入力してください。", {
            variant: "warning",
          });
          return;
        }
        if (!mockAuthForm.password) {
          mockEnqueueSnackbar("パスワードを入力してください。", {
            variant: "warning",
          });
          return;
        }
        if (mockAuthForm.email === "error@example.com") {
          mockEnqueueSnackbar(
            "サインインに失敗しました。もう一度お試しください。",
            { variant: "error" }
          );
          return;
        }
        mockRouter.push("/dashboard");
      }),
      isSubmittingLoading: false,
    },
    authUserState: {
      user: null,
      isAuthLoading: false,
      authError: null,
    },
  })),
}));

const mockEnqueueSnackbar = jest.fn();
jest.mock("notistack", () => ({
  useSnackbar: jest.fn(() => ({
    enqueueSnackbar: mockEnqueueSnackbar,
  })),
}));

const mockAuthForm = {
  email: "",
  password: "",
};

const mockRouter = {
  push: jest.fn(),
};

describe("SignInForm コンポーネントのテスト", () => {
  let emailInput: HTMLElement;
  let passwordInput: HTMLElement;
  let form: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockAuthForm.email = "";
    mockAuthForm.password = "";

    render(<SignInForm />);
    emailInput = screen.getByLabelText(/Email/i);
    passwordInput = screen.getByLabelText(/Password/i);
    form = screen.getByTestId("signin-form");
  });

  describe("UIとフォーム動作のテスト", () => {
    it("無効なメールアドレスでエラーメッセージが表示されること", async () => {
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        mockAuthForm.email = "invalid-email";
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        mockAuthForm.password = "password123";
        fireEvent.submit(form);
      });

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        "有効なメールアドレスを入力してください。",
        { variant: "warning" }
      );
    });

    it("パスワードが空の場合にエラーメッセージが表示されること", async () => {
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        mockAuthForm.email = "test@example.com";
        fireEvent.change(passwordInput, { target: { value: "" } });
        mockAuthForm.password = "";
        fireEvent.submit(form);
      });

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        "パスワードを入力してください。",
        { variant: "warning" }
      );
    });

    it("有効な入力でログイン処理が実行されユーザーがリダイレクトされること", async () => {
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        mockAuthForm.email = "test@example.com";
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        mockAuthForm.password = "password123";
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("ログインエラー時にエラーメッセージが表示されること", async () => {
      await act(async () => {
        fireEvent.change(emailInput, {
          target: { value: "error@example.com" },
        });
        mockAuthForm.email = "error@example.com";
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        mockAuthForm.password = "password123";
        fireEvent.submit(form);
      });

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        "サインインに失敗しました。もう一度お試しください。",
        { variant: "error" }
      );
    });
  });

  it("送信中はローディングインジケーターが表示されること", async () => {
    const useTodoMock = require("@/app/Hooks/useTodo").useTodo;
    useTodoMock.mockReturnValue({
      authForm: {
        email: "test@example.com",
        setEmail: jest.fn(),
        password: "password123",
        setPassword: jest.fn(),
      },
      authAction: {
        handleSignIn: jest.fn(),
        isSubmittingLoading: true,
      },
      authUserState: {
        user: null,
        isAuthLoading: false,
        authError: null,
      },
    });

    const { container } = render(<SignInForm />);
    expect(
      container.querySelector(".MuiCircularProgress-root")
    ).toBeInTheDocument();
  });
});
