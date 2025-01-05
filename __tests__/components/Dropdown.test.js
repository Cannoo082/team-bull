import { render, screen, fireEvent } from "@testing-library/react";
import Dropdown from "@/components/UI/Dropdown";

describe("Dropdown Component", () => {
  const mockOnChange = jest.fn();
  const options = [
    { id: "1", value: "Option 1", label: "Option 1" },
    { id: "2", value: "Option 2", label: "Option 2" },
  ];

  it("renders dropdown options", () => {
    render(
      <Dropdown
        label="Select an option"
        currentValue=""
        options={options}
        optionKey="id"
        optionValue="value"
        optionFormattedValue="label"
        onChange={mockOnChange}
      />
    );

    fireEvent.mouseDown(screen.getByLabelText("Select an option"));
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("calls onChange when an option is selected", () => {
    render(
      <Dropdown
        label="Select an option"
        currentValue=""
        options={options}
        optionKey="id"
        optionValue="value"
        optionFormattedValue="label"
        onChange={mockOnChange}
      />
    );
  
    fireEvent.mouseDown(screen.getByLabelText("Select an option"));
    fireEvent.click(screen.getByText("Option 1"));
  
    console.log("Mock Calls:", mockOnChange.mock.calls);
  
    const [firstCallArgs] = mockOnChange.mock.calls;
    const selectedValue = firstCallArgs[1]?.props?.value || firstCallArgs[1];
    expect(selectedValue).toBe("Option 1");
  });
  
});
