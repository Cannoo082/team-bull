import { render, screen, fireEvent } from "@testing-library/react";
import Backdrop from "@/components/UI/Backdrop";

describe("Backdrop Component", () => {
  const mockOnClose = jest.fn();

  it("renders children content", () => {
    render(<Backdrop onClose={mockOnClose}>Content</Backdrop>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("calls onClose when the Escape key is pressed", () => {
    render(<Backdrop onClose={mockOnClose}>Content</Backdrop>);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when the close icon is clicked", () => {
    render(<Backdrop onClose={mockOnClose}>Content</Backdrop>);
    fireEvent.click(screen.getByTestId("CloseIcon"));
    expect(mockOnClose).toHaveBeenCalled();
  });  
});
