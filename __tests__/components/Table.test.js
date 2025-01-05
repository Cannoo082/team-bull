import { render, screen } from "@testing-library/react";
import CustomizedTables from "@/components/UI/Table";

describe("Table Component", () => {
  const columns = ["Name", "Age"];
  const rows = [{ Name: "Alice", Age: 25 }, { Name: "Bob", Age: null }];

  it("renders table rows and columns correctly", () => {
    render(<CustomizedTables columns={columns} rows={rows} rowKey="Name" />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("displays emptyValue for null cells", () => {
    render(
      <CustomizedTables columns={columns} rows={rows} rowKey="Name" emptyValue="-" />
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
