"use client";

import styles from "@/styles/pages/AttendanceStudent.module.css";
import { formatString } from "@/helpers/functions/util";
import Table from "@/components/UI/Table";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  sendRequestGetAttendance,
  sendRequestGetAllSemesters,
} from "@/helpers/functions/http";
import Dropdown from "@/components/UI/Dropdown";
const defaultVal = "";
let selectedSemesterIdDefault = "";
export default function AttendanceStudent() {
  const authCtx = useContext(AuthContext);
  const [selectedSemesterId, setSelectedSemesterId] = useState(
    selectedSemesterIdDefault
  ); 
  const [semesters, setSemesters] = useState(null); 
  const [attendance, setAttendance] = useState(null);
  const [selected, setSelected] = useState(defaultVal);
  useEffect(() => {
    async function handleAttendance() {
      const data = await sendRequestGetAttendance(authCtx.userState.userId);
      if (data === undefined) {
        return alert(errMsg.default);
      }

      if (data.error) {
        return alert(data.message);
      }

      setAttendance(data);
    }

    handleAttendance();
  }, []);
  function handleAttendanceChange(event) {
    setSelected(event.target.value);
  }

  if (!attendance) {
    return null;
  }

  if (!Object.keys(attendance).length) {
    return (
      <>
        <h1>Attendance</h1>
        <p>No records found</p>
      </>
    );
  }
  console.log(attendance);
  return (
    <div className={styles.container}>
      <h1>Attendance</h1>
      <Dropdown
        sx={{ maxWidth: 180, marginTop: "1rem", marginBottom: "2rem" }}
        options={Object.keys(attendance).map((each) => ({
          name: each,
        }))}
        label="Attendance"
        onChange={handleAttendanceChange}
        currentValue={selected}
        optionKey="name"
        optionValue="name"
        optionFormattedValue="name"
      />
      {selected && (
        <Table
          columns={["CourseCode", "Week", "Status"]}
          rows={attendance[selected]}
          rowKey="Week"
          emptyValue="-"
          handleColumnFormat={(word) => formatString(word, ["_"])}
          sx={{ width: "40%" }}
        />
      )}
    </div>
  );
}
