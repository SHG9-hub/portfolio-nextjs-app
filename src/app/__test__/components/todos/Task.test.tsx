import { render, screen } from "@testing-library/react";
import { Task } from "@/app/components/todos/Task";
import { mockTodoList } from "@/app/__test__/mocks/todo-mocks";
import { mutate } from "swr";

jest.mock("swr", () => ({
  mutate: jest.fn(),
}));

jest.mock("@/app/lib/firebase/firebaseservice", () => ({
  updateTodo: jest.fn(),
}));

describe("Taskコンポーネントのテスト", () => {
  const todo = mockTodoList[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Todoの内容が正しく表示されること", () => {
    render(<Task todo={todo} />);

    const todoTitle = screen.getByText(todo.title);
    expect(todoTitle).toBeInTheDocument();
  });

  it("編集ボタンが表示されること", () => {
    render(<Task todo={todo} />);

    const editButton = screen.getByText("編集");
    expect(editButton).toBeInTheDocument();
  });

  it("削除ボタンが表示されること", () => {
    render(<Task todo={todo} />);

    const deleteButton = screen.getByLabelText("delete");
    expect(deleteButton).toBeInTheDocument();
  });
});
