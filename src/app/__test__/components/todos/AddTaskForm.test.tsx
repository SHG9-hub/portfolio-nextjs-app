import { render, screen } from "@testing-library/react";
import { AddTaskForm } from "@/app/components/todos/AddTaskForm";

describe("AddTaskFormコンポーネントのテスト", () => {
  it("フォームが正しくレンダリングされること", () => {
    render(<AddTaskForm />);

    const inputForm =
      screen.getByPlaceholderText("新しいタスクを入力してください");
    const addButton = screen.getByText("追加");

    expect(inputForm).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });
});
