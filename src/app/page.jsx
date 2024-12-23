"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
export default function Home() {
  const authCtx = useContext(AuthContext);
  console.log(authCtx); 
  return <h1>Homepage </h1>;
}
