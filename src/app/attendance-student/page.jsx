"use client";

import styles from "@/styles/pages/AttendanceStudent.module.css";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { sendRequestGetAttendance } from "@/helpers/functions/http";

export default function AttendanceStudent() {
  const authCtx = useContext(AuthContext);
  const [attendance, setAttendace] = useState(null);
  useEffect(() => {
    async function handleAttendance() {
      const data = await sendRequestGetAttendance(authCtx.userState.userId);
      if (data === undefined) {
        return alert(errMsg.default);
      }

      if (data.error) {
        return alert(data.message);
      }

      console.log(data);
    }

    handleAttendance();
  }, []);
  return <h1>Attendance </h1>;
}
