import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUpForm from "@/app/components/auth/SignUpForm";
import { useRouter } from "next/navigation";
import { act } from "react";
import { signUpUser } from "@/app/lib/firebase/firebaseauth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/lib/firebase/firebaseauth", () => ({
  signUpUser: jest.fn().mockImplementation((email) => {
    if (email === "error@example.com") {
      return Promise.resolve(null);
    }
    return Promise.resolve({ email });
  }),
}));

describe("SignUpForm コンポーネントのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  describe("UIとフォーム動作のテスト", () => {
    it("無効なメールアドレスでエラーメッセージが表示されること", async () => {
      render(<SignUpForm />);

      const emailInput = screen.getByLabelText(/Email:/i);
      const passwordInput = screen.getByLabelText(/Password:/i);
      const form = screen.getByTestId("signup-form");

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.submit(form);
      });

      expect(
        screen.getByText("有効なメールアドレスを入力してください。")
      ).toBeInTheDocument();
    });

    it("短すぎるパスワードでエラーメッセージが表示されること", async () => {
      render(<SignUpForm />);

      const emailInput = screen.getByLabelText(/Email:/i);
      const passwordInput = screen.getByLabelText(/Password:/i);
      const submitButton = screen.getByRole("button");

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "short" } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText("パスワードは8文字以上である必要があります。")
        ).toBeInTheDocument();
      });
    });

    it("有効な入力で登録処理が実行されユーザーがリダイレクトされること", async () => {
      const pushMock = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({
        push: pushMock,
      });

      render(<SignUpForm />);

      const emailInput = screen.getByLabelText(/Email:/i);
      const passwordInput = screen.getByLabelText(/Password:/i);
      const submitButton = screen.getByRole("button");

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(signUpUser).toHaveBeenCalledWith(
          "test@example.com",
          "password123"
        );
        expect(pushMock).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("登録エラー時にエラーメッセージが表示されること", async () => {
      render(<SignUpForm />);

      const emailInput = screen.getByLabelText(/Email:/i);
      const passwordInput = screen.getByLabelText(/Password:/i);
      const submitButton = screen.getByRole("button");

      await act(async () => {
        fireEvent.change(emailInput, {
          target: { value: "error@example.com" },
        });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            "サインアップに失敗しました。もう一度お試しください。"
          )
        ).toBeInTheDocument();
      });
    });

    it("送信中は入力とボタンが無効化されること", async () => {
      (signUpUser as jest.Mock).mockImplementationOnce(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ email: "test@example.com" }), 100);
        });
      });

      render(<SignUpForm />);

      const emailInput = screen.getByLabelText(/Email:/i);
      const passwordInput = screen.getByLabelText(/Password:/i);
      const submitButton = screen.getByRole("button");

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(submitButton);
      });

      expect(submitButton).toHaveTextContent("登録中...");
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });
});
