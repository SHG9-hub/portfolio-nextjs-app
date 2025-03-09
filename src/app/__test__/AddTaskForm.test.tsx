import { render, screen } from "@testing-library/react";
import { AddTaskForm } from "../components/AddTaskForm";

describe("AddTaskForm", () => {
  it("追加フォームのテスト", () => {
    render(<AddTaskForm />);

    const inputFrom = screen.getByRole("textbox");
    expect(inputFrom).toBeInTheDocument();
  });
});
