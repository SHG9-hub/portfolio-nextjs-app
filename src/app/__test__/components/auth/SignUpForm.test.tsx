import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { act } from "react";
import SignUpForm from "@/app/components/auth/SignUpForm";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockAuthForm = {
  email: "",
  password: "",
};

const mockRouter = {
  push: jest.fn(),
};

const mockHandleSignUp = jest.fn((e) => {
  e.preventDefault();
  if (!mockAuthForm.email.includes("@")) {
    mockEnqueueSnackbar("有効なメールアドレスを入力してください。", {
      variant: "warning",
    });
    return;
  }
  if (mockAuthForm.password.length < 8) {
    mockEnqueueSnackbar("パスワードは8文字以上である必要があります。", {
      variant: "warning",
    });
    return;
  }
  if (mockAuthForm.email === "error@example.com") {
    mockEnqueueSnackbar(
      "サインアップに失敗しました。もう一度お試しください。",
      { variant: "error" }
    );
    return;
  }
  mockRouter.push("/dashboard");
});

jest.mock("@/app/Hooks/useTodo", () => ({
  useTodo: jest.fn(() => ({
    authForm: {
      email: mockAuthForm.email,
      setEmail: jest.fn((value) => {
        mockAuthForm.email = value;
      }),
      password: mockAuthForm.password,
      setPassword: jest.fn((value) => {
        mockAuthForm.password = value;
      }),
    },
    authAction: {
      handleSignUp: mockHandleSignUp,
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

describe("SignUpForm コンポーネントのテスト", () => {
  let emailInput: HTMLElement;
  let passwordInput: HTMLElement;
  let form: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockAuthForm.email = "";
    mockAuthForm.password = "";

    render(<SignUpForm />);
    emailInput = screen.getByLabelText(/Email/i);
    passwordInput = screen.getByLabelText(/Password/i);
    form = screen.getByTestId("signup-form");
  });

  describe("UIとフォーム動作のテスト", () => {
    it("無効なメールアドレスでエラーメッセージが表示されること", async () => {
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.submit(form);
      });

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        "有効なメールアドレスを入力してください。",
        { variant: "warning" }
      );
    });

    it("短すぎるパスワードでエラーメッセージが表示されること", async () => {
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "short" } });
        fireEvent.submit(form);
      });

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        "パスワードは8文字以上である必要があります。",
        { variant: "warning" }
      );
    });

    it("有効な入力で登録処理が実行されユーザーがリダイレクトされること", async () => {
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.submit(form);
      });

      expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
    });

    it("登録エラー時にエラーメッセージが表示されること", async () => {
      await act(async () => {
        fireEvent.change(emailInput, {
          target: { value: "error@example.com" },
        });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.submit(form);
      });

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        "サインアップに失敗しました。もう一度お試しください。",
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
        handleSignUp: mockHandleSignUp,
        isSubmittingLoading: true,
      },
      authUserState: {
        user: null,
        isAuthLoading: false,
        authError: null,
      },
    });

    const { container } = render(<SignUpForm />);
    expect(
      container.querySelector(".MuiCircularProgress-root")
    ).toBeInTheDocument();
  });
});
