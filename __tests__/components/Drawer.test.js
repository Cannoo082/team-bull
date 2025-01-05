import { render, screen, fireEvent } from "@testing-library/react";
import Drawer from "@/components/UI/Drawer";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Drawer Component", () => {
  const mockRouterPush = jest.fn();
  const mockToggleDrawer = jest.fn();
  const options = {
    home: { name: "Home", path: "/home", icon: <span>Icon</span> },
    settings: { name: "Settings", path: "/settings", icon: <span>Icon</span> },
  };

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockRouterPush });
  });

  it("renders drawer options", () => {
    render(<Drawer open={true} handleToggleDrawer={mockToggleDrawer} options={options} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("navigates to the correct path when an option is clicked", () => {
    render(<Drawer open={true} handleToggleDrawer={mockToggleDrawer} options={options} />);
    fireEvent.click(screen.getByText("Home"));
    expect(mockRouterPush).toHaveBeenCalledWith("/home");
  });
});
