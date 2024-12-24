import { useContext, useEffect } from "react";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next";
import * as cookies from "@/helpers/constants/cookie_keys.js";
import { AuthContext } from "@/context/AuthContext";
import TopMenu from "@/components/app-wide/TopMenu";
export default function App({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const authCtx = useContext(AuthContext);

  async function handleRouting() {
    let cookieUser = getCookie(cookies.user);
    if (cookieUser === undefined) {
      return router.replace("/login");
    }

    cookieUser = JSON.parse(cookieUser);
    if (!cookieUser["is_signed_in"]) {
      deleteCookie(cookies.user);
      return router.replace("/login");
    }

    authCtx.handleUserSignIn(
      cookieUser["user_id"],
      cookieUser["email"],
      cookieUser["role"]
    );
  }

  useEffect(() => {
    if (authCtx.userState.isSignedIn && pathname === "/login") {
      router.replace("/");
    }
    if (!authCtx.userState.isSignedIn) {
      handleRouting();
    }
  }, [authCtx.userState.isSignedIn]);

  if (!authCtx.userState.isSignedIn && pathname !== "/login") {
    return <></>;
  }

  return (
    <>
      {authCtx.userState.isSignedIn && pathname !== "/login" && <TopMenu />}
      <div style={{ margin: "0 1rem 0 1rem" }}>{children}</div>
    </>
  );
}
