import { render, screen } from "@testing-library/react";
import { Task } from "../components/Task";
import { mockTodoList } from "../data/mockdata";

describe("Taskコンポーネントのテスト", () => {
  const todo = mockTodoList[0];
  it("Taskコンポーネントのテスト", () => {
    render(<Task todo={todo} />);

    const todoElement = screen.getByText(todo.title);
    expect(todoElement).toBeInTheDocument();
  });
});
