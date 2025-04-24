import { render, screen } from "@testing-library/react";
import { AddTodoForm } from "@/app/components/todos/AddTodoForm";
import { mockUser } from "@/app/__test__/mocks/firebase-mocks";

// firebaseserviceをモック化
jest.mock("@/app/lib/firebase/firebaseservice", () => ({
  addTodo: jest.fn().mockResolvedValue(true),
}));

describe("AddTodoFormコンポーネントのテスト", () => {
  it("フォームが正しくレンダリングされること", () => {
    const mockMutate = jest.fn();
    render(<AddTodoForm user={mockUser} mutate={mockMutate} />);

    const inputForm =
      screen.getByPlaceholderText("新しいタスクを入力してください");
    const addButton = screen.getByText("追加");

    expect(inputForm).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });
});
