import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AddTodoForm } from "@/app/components/todos/AddTodoForm";
import { mockUser } from "@/app/__test__/mocks/firebase-mocks";
import { mutate } from "swr";
import { enqueueSnackbar } from "notistack";

jest.mock("swr", () => ({
  mutate: jest.fn(),
}));

jest.mock("notistack", () => ({
  enqueueSnackbar: jest.fn(),
}));

const mockAddTodo = jest.fn();

jest.mock("@/app/lib/firebase/firebaseservice", () => ({
  addTodo: (...args: any[]) => mockAddTodo(...args),
}));

describe("AddTodoFormコンポーネントのテスト", () => {
  let inputForm: HTMLElement;
  let addButton: HTMLElement;

  beforeEach(() => {
    mockAddTodo.mockReset();
    mockAddTodo.mockResolvedValue(true);
    (mutate as jest.Mock).mockClear();

    render(<AddTodoForm user={mockUser} />);
    inputForm = screen.getByPlaceholderText("新しいタスクを入力してください");
    addButton = screen.getByText("追加");
  });

  it("フォームが正しくレンダリングされ、inputが空欄の時はボタンが無効になっていること", () => {
    expect(inputForm).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });

  it("タスクが入力されたらボタンが有効になり、addTodo関数の処理が成功し、成功後にmutateにてタスクを再フェッチしてくること。", async () => {
    fireEvent.change(inputForm, { target: { value: "新しいタスク" } });

    expect(addButton).not.toBeDisabled();

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddTodo).toHaveBeenCalledWith({
        title: "新しいタスク",
        completed: false,
        userId: mockUser.uid,
      });
    });

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(mockUser.uid);
    });
  });

  it("addTodo関数の処理失敗した時にエラーが通知されること", async () => {
    mockAddTodo.mockResolvedValue(false);

    fireEvent.change(inputForm, { target: { value: "新しいタスク" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddTodo).toHaveBeenCalledWith({
        title: "新しいタスク",
        completed: false,
        userId: mockUser.uid,
      });
    });
  });
});
