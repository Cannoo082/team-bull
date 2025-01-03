"use client";
import styles from "@/styles/pages/HomePage.module.css";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { sendRequestGetNotifications } from "@/helpers/functions/http";
import Calendar from "@/components/app-wide/Calendar";
import Notifications from "@/components/UI/Notifications";
import Menu from "@/components/app-wide/Menu";
export default function HomePage() {
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
  console.log(notifs);

  return (
    <div className={styles.container}>
      <h1>Homepage </h1>
      <div className={styles.group}>
        <div className={styles["notifs-container"]}>
          <Notifications notifs={notifs} />
        </div>
        <div className={styles["calendar-container"]}>
          <Calendar />
        </div>
      </div>
      <div className={styles.group}>
        <div className={styles["menu-container"]}>
          <Menu />
        </div>
        <div className={styles["notifs-container"]}></div>
      </div>
    </div>
  );
}
