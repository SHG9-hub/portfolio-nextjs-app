import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditModal } from "@/app/components/todos/EditModal";
import { mockTodoList } from "@/app/__test__/mocks/todo-mocks";
import { mutate } from "swr";

jest.mock("swr", () => ({
  mutate: jest.fn(),
}));

const mockUpdataTodoTitle = jest.fn();

jest.mock("@/app/lib/firebase/firebaseservice", () => ({
  updataTodoTitle: (...args: any[]) => mockUpdataTodoTitle(...args),
}));

describe("EditModalコンポーネントのテスト", () => {
  const toggle = jest.fn();
  const mockTodo = mockTodoList[0];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdataTodoTitle.mockResolvedValue(true);
  });

  it("モーダルが開いている時に内容が表示されること", () => {
    render(<EditModal isOpen={true} toggle={toggle} todo={mockTodo} />);

    const editingForm = screen.getByRole("textbox");
    expect(editingForm).toBeInTheDocument();
  });

  it("モーダルが閉じているときはコンテンツが表示されないこと", () => {
    render(<EditModal isOpen={false} toggle={toggle} todo={mockTodo} />);

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("モーダルのonCloseが呼ばれたときにtoggle関数が呼ばれること", () => {
    render(<EditModal isOpen={true} toggle={toggle} todo={mockTodo} />);

    // モーダルのbackdropをクリックしてonCloseをトリガー
    const backdrop = screen
      .getByRole("presentation")
      .querySelector(".MuiBackdrop-root");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(toggle).toHaveBeenCalledTimes(1);
    }
  });

  it("更新ボタンをクリックするとupdataTodoTitle関数が呼ばれること", async () => {
    mockUpdataTodoTitle.mockResolvedValue(true);

    render(<EditModal isOpen={true} toggle={toggle} todo={mockTodo} />);

    const editingForm = screen.getByRole("textbox");
    const updateButton = screen.getByRole("button", { name: "更新" });

    fireEvent.change(editingForm, { target: { value: "更新されたタイトル" } });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockUpdataTodoTitle).toHaveBeenCalledWith(
        mockTodo.id,
        "更新されたタイトル"
      );
      expect(mutate).toHaveBeenCalledWith(mockTodo.userId);
      expect(toggle).toHaveBeenCalled();
    });
  });
});
