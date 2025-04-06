import { render, screen, fireEvent } from "@testing-library/react";
import { EditModal } from "@/app/components/todos/EditModal";

describe("EditModalコンポーネントのテスト", () => {
  const toggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("モーダルが開いている時に内容が表示されること", () => {
    render(<EditModal isOpen={true} toggle={toggle} />);

    const editingForm = screen.getByRole("textbox");
    expect(editingForm).toBeInTheDocument();
  });

  it("モーダルが閉じているときはコンテンツが表示されないこと", () => {
    render(<EditModal isOpen={false} toggle={toggle} />);

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("閉じるボタンクリック時にtoggle関数が呼ばれること", () => {
    render(<EditModal isOpen={true} toggle={toggle} />);
  });
});
