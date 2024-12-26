"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { sendRequestGetNotifications } from "@/helpers/functions/http";
export default function Home() {
  const authCtx = useContext(AuthContext);
  const [notifs, setNotifs] = useState(null);

  useEffect(() => {
    async function handleGetNotifications() {
      const data = await sendRequestGetNotifications(authCtx.userState.userId);
      if (data === undefined) {
        return alert(errMsg.default);
      }

      if (data.error) {
        return alert(data.message);
      }

      setNotifs(data);
    } 

    handleGetNotifications(); 
  }, []);
  console.log(authCtx); 
  console.log(notifs); 
  return <h1>Homepage </h1>;
}
