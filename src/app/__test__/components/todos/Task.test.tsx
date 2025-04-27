import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Task } from "@/app/components/todos/Task";
import { mockTodoList } from "@/app/__test__/mocks/todo-mocks";
import { mutate } from "swr";

jest.mock("swr", () => ({
  mutate: jest.fn(),
}));

const mockUpdateTodo = jest.fn();

jest.mock("@/app/lib/firebase/firebaseservice", () => ({
  updateTodo: (...args: any[]) => mockUpdateTodo(...args),
}));

describe("Taskコンポーネントのテスト", () => {
  const todo = mockTodoList[0];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateTodo.mockResolvedValue(true);
    render(<Task todo={todo} />);
  });

  it("Todoの内容が正しく表示されること", () => {
    const todoTitle = screen.getByText(todo.title);
    expect(todoTitle).toBeInTheDocument();
  });

  it("編集ボタンが表示されること", () => {
    const editButton = screen.getByText("編集");
    expect(editButton).toBeInTheDocument();
  });

  it("削除ボタンが表示されること", () => {
    const deleteButton = screen.getByLabelText("delete");
    expect(deleteButton).toBeInTheDocument();
  });

  it("チェックボックスをクリックして完了状態を切り替えられること", async () => {
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockUpdateTodo).toHaveBeenCalledWith(todo.id, { completed: true });
    });
  });
});
