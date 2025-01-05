import { render, screen, fireEvent } from "@testing-library/react";
import AccountMenu from "@/components/UI/AccountMenu";

describe("AccountMenu Component", () => {
  const mockItems = [
    { id: 1, name: "Profile", onClick: jest.fn(), icon: <span>Icon</span> },
    { id: 2, name: "Logout", onClick: jest.fn(), icon: <span>Icon</span> },
  ];
  const mockClose = jest.fn();

  it("renders all menu items", () => {
    render(
      <AccountMenu
        menuAnchorElement={document.body}
        menuOpen={true}
        items={mockItems}
        divider={[0]}
        handleCloseMenu={mockClose}
      />
    );

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("calls onClick when a menu item is clicked", () => {
    render(
      <AccountMenu
        menuAnchorElement={document.body}
        menuOpen={true}
        items={mockItems}
        divider={[0]}
        handleCloseMenu={mockClose}
      />
    );

    fireEvent.click(screen.getByText("Profile"));
    expect(mockItems[0].onClick).toHaveBeenCalled();
  });
});
