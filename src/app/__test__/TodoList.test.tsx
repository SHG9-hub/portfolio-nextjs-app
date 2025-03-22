import { render, screen } from "@testing-library/react";
import { TodoList } from "../components/TodoList";
import { mockTodoList } from "../data/mockdata";

describe("TodoListコンポーネントのテスト", () => {
  it("TodoListコンポーネントのレンダリングテスト", () => {
    render(<TodoList todoList={mockTodoList} />);

    mockTodoList.forEach((todo) => {
      const todoElement = screen.getByText(todo.title);
      expect(todoElement).toBeInTheDocument();
    });
  });
});
