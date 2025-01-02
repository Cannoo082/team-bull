import { createContext, useReducer } from "react";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const initialUserState = {
    userId: null, // "64bbd73ea640646fce97ec5b",
    email: null, // "admin@test.com",
    role: null, // null,
    isSignedIn: false, // false,
  };

  function reducer(userState, action) {
    switch (action.type) {
      case "SIGN-IN":
        return {
          ...userState,
          userId: action.userId,
          email: action.email,
          role: action.role,
          isSignedIn: true,
        };
      case "SIGN-OUT":
        return initialUserState;
      case "UPDATE":
        return {
          ...userState,
          ...action.object,
        };
      default:
        return userState;
    }
  }

  const [userState, dispatch] = useReducer(reducer, initialUserState);

  function handleUserSignIn(userId, email, role) {
    dispatch({ type: "SIGN-IN", userId: userId, email: email, role: role });
  }

  function handleUserSignOut() {
    dispatch({ type: "SIGN-OUT" });
  }

  function handleChangeObject(object) {
    dispatch({ type: "UPDATE", object });
  }
  return (
    <AuthContext.Provider
      value={{
        userState,
        handleUserSignIn,
        handleUserSignOut,
        handleChangeObject,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
