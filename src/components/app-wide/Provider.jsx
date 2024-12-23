"use client";

import App from "./App";
import AuthProvider from "@/context/AuthContext";

export default function Provider({ children }) {
  return (
    <AuthProvider>
      <App>{children}</App>
    </AuthProvider>
  );
}
