import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/app/components/auth/LoginForm";
import { useRouter } from "next/navigation";
import { act } from "react";
import { signInUser } from "@/app/lib/firebase/firebaseauth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/lib/firebase/firebaseauth", () => ({
  signInUser: jest.fn().mockImplementation((email) => {
    if (email === "error@example.com") {
      return Promise.resolve(null);
    }
    return Promise.resolve({ email });
  }),
}));

describe("LoginForm コンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  describe("UIとフォーム動作のテスト", () => {
    it("無効なメールアドレスでエラーメッセージが表示されること", async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/Email:/i);
      const passwordInput = screen.getByLabelText(/Password:/i);
      const form = screen.getByTestId("login-form");

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.submit(form);
      });

      const errorElement = await screen.findByText(
        "有効なメールアドレスを入力してください。"
      );
      expect(errorElement).toBeInTheDocument();
    });

    it("パスワードが空の場合にエラーメッセージが表示されること", async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/Email:/i);
      const passwordInput = screen.getByLabelText(/Password:/i);
      const form = screen.getByTestId("login-form");

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "" } });
        fireEvent.submit(form);
      });

      const errorElement = await screen.findByText(
        "パスワードを入力してください。"
      );
      expect(errorElement).toBeInTheDocument();
    });

    it("有効な入力でログイン処理が実行されユーザーがリダイレクトされること", async () => {
      const pushMock = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({
        push: pushMock,
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/Email:/i);
      const passwordInput = screen.getByLabelText(/Password:/i);
      const form = screen.getByTestId("login-form");

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(signInUser).toHaveBeenCalledWith(
          "test@example.com",
          "password123"
        );
        expect(pushMock).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("ログインエラー時にエラーメッセージが表示されること", async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/Email:/i);
      const passwordInput = screen.getByLabelText(/Password:/i);
      const form = screen.getByTestId("login-form");

      await act(async () => {
        fireEvent.change(emailInput, {
          target: { value: "error@example.com" },
        });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.submit(form);
      });

      const errorElement = await screen.findByText(
        "サインインに失敗しました。もう一度お試しください。"
      );
      expect(errorElement).toBeInTheDocument();
    });

    it("送信中は入力とボタンが無効化されること", async () => {
      (signInUser as jest.Mock).mockImplementationOnce(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ email: "test@example.com" }), 100);
        });
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/Email:/i);
      const passwordInput = screen.getByLabelText(/Password:/i);
      const form = screen.getByTestId("login-form");

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.submit(form);
      });

      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(screen.getByRole("button")).toBeDisabled();
      expect(screen.getByRole("button")).toHaveTextContent("ログイン中...");
    });
  });
});
