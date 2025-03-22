import { render, screen } from "@testing-library/react";
import { EditModal } from "../components/EditModal";

describe("モーダルのテスト", () => {
  const toggle = jest.fn();

  it("モダールのレンダリングテスト", () => {
    render(<EditModal isOpen={true} toggle={toggle} />);

    const editingForm = screen.getByRole("textbox");
    expect(editingForm).toBeInTheDocument();
  });
});
