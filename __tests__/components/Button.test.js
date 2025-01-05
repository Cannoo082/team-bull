import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/UI/Button";

describe("Button Component", () => {
  const mockOnClick = jest.fn();

  it("renders button with the correct title", () => {
    render(<Button title="Submit" />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("displays loading spinner when loading is true", () => {
    render(<Button title="Submit" loading />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("calls onClick when button is clicked", () => {
    render(<Button title="Submit" onClick={mockOnClick} />);
    fireEvent.click(screen.getByText("Submit"));
    expect(mockOnClick).toHaveBeenCalled();
  });
});
