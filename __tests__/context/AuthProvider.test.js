import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { AuthContext } from "@/context/AuthContext";
import AuthProvider from "@/context/AuthContext";

describe("AuthProvider", () => {
  it("initializes with the default state", () => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ userState }) => (
            <div>
              <p data-testid="isSignedIn">{userState.isSignedIn.toString()}</p>
              <p data-testid="userId">{userState.userId}</p>
              <p data-testid="email">{userState.email}</p>
              <p data-testid="role">{userState.role}</p>
            </div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    expect(screen.getByTestId("isSignedIn").textContent).toBe("false");
    expect(screen.getByTestId("userId").textContent).toBe("");
    expect(screen.getByTestId("email").textContent).toBe("");
    expect(screen.getByTestId("role").textContent).toBe("");
  });

  it("updates state when SIGN-IN is dispatched", () => {
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    act(() => {
      contextValue.handleUserSignIn("123", "test@test.com", "admin");
    });

    expect(contextValue.userState).toEqual({
      userId: "123",
      email: "test@test.com",
      role: "admin",
      isSignedIn: true,
    });
  });

  it("resets state when SIGN-OUT is dispatched", () => {
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    act(() => {
      contextValue.handleUserSignIn("123", "test@test.com", "admin");
      contextValue.handleUserSignOut();
    });

    expect(contextValue.userState).toEqual({
      userId: null,
      email: null,
      role: null,
      isSignedIn: false,
    });
  });

  it("merges state when UPDATE is dispatched", () => {
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    act(() => {
      contextValue.handleChangeObject({ email: "updated@test.com", role: "user" });
    });

    expect(contextValue.userState).toEqual({
      userId: null,
      email: "updated@test.com",
      role: "user",
      isSignedIn: false,
    });
  });
});
