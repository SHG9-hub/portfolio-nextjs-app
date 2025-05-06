import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditModal } from "@/app/components/todos/EditModal";
import { mockTodoList } from "@/app/__test__/mocks/todo-mocks";
import { mutate } from "swr";

jest.mock("swr", () => ({
  mutate: jest.fn(),
}));

const mockUpdateTodo = jest.fn();

jest.mock("@/app/lib/firebase/firebaseservice", () => ({
  updateTodo: (...args: any[]) => mockUpdateTodo(...args),
}));

describe("EditModalコンポーネントのテスト", () => {
  const modalToggle = jest.fn();
  const mockTodo = mockTodoList[0];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateTodo.mockResolvedValue(true);
  });

  describe("モーダルが開いている時", () => {
    beforeEach(() => {
      render(
        <EditModal isOpen={true} modalToggle={modalToggle} todo={mockTodo} />
      );
    });

    it("モーダルの内容が表示され、編集前のタイトルが入力欄に設定されていること", () => {
      const editingForm = screen.getByRole("textbox");
      expect(editingForm).toBeInTheDocument();
      expect(editingForm).toHaveValue(mockTodo.title);
    });

    it("モーダルのonCloseが呼ばれたときにmodalToggle関数が呼ばれること", () => {
      const backdrop = screen
        .getByRole("presentation")
        .querySelector(".MuiBackdrop-root");
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(modalToggle).toHaveBeenCalledTimes(1);
      }
    });

    it("更新ボタンをクリックするとupdateTodo関数が呼ばれること", async () => {
      const editingForm = screen.getByRole("textbox");
      const updateButton = screen.getByLabelText("タスクを更新");

      fireEvent.change(editingForm, {
        target: { value: "更新されたタイトル" },
      });
      expect(editingForm).toHaveValue("更新されたタイトル");

      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(mockUpdateTodo).toHaveBeenCalledWith(mockTodo.id, {
          title: "更新されたタイトル",
        });
        expect(mutate).toHaveBeenCalledWith(mockTodo.userId);
        expect(modalToggle).toHaveBeenCalled();
      });
    });
  });

  describe("モーダルが閉じている時", () => {
    beforeEach(() => {
      render(
        <EditModal isOpen={false} modalToggle={modalToggle} todo={mockTodo} />
      );
    });

    it("モーダルの内容が表示されないこと", () => {
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });
  });
});
