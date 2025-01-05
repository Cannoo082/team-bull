"use client";

import styles from "@/styles/pages/AttendanceStudent.module.css";
import { formatString } from "@/helpers/functions/util";
import Table from "@/components/UI/Table";
import { useEffect, useState, useContext } from "react";
import { error as errMsg } from "@/helpers/constants/messages";
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
    selectedSemesterIdDefault = "";
  }, []);
  useEffect(() => {
    async function handleGetSemesters() {
      const data = await sendRequestGetAllSemesters();
      if (data === undefined) {
        return alert(errMsg.default);
      }

      if (data.error) {
        return alert(data.message);
      }
      const semesters = data.map((semester) => ({
        id: semester.SemesterID,
        name: semester.Term + " - " + semester.Year,
      }));
      setSemesters(semesters);
    }

    handleGetSemesters();
  }, []);

  useEffect(() => {
    async function handleAttendance() {
      const data = await sendRequestGetAttendance(
        authCtx.userState.userId,
        selectedSemesterId
      );
      if (data === undefined) {
        return alert(errMsg.default);
      }

      if (data.error) {
        return alert(data.message);
      }

      setAttendance(data);
    }
    if (selectedSemesterId !== selectedSemesterIdDefault) {
      handleAttendance();
    }
  }, [selectedSemesterId]);
  function handleAttendanceChange(event) {
    setSelected(event.target.value);
  }

  function handleSemesterChange(event) {
    setSelectedSemesterId(event.target.value);
    setSelected("");
  }

  return (
    <div className={styles.container}>
      <h1>Attendance</h1>
      {semesters ? (
        semesters.length ? (
          <>
            <h2>Semesters</h2>
            <Dropdown
              sx={{ maxWidth: 180, marginTop: "1rem", marginBottom: "2rem" }}
              options={semesters}
              label="Semester"
              onChange={handleSemesterChange}
              currentValue={selectedSemesterId}
              optionKey="id"
              optionValue="id"
              optionFormattedValue="name"
            />
          </>
        ) : (
          <p>No semesters found</p>
        )
      ) : null}

      {attendance ? (
        Object.keys(attendance).length ? (
          <>
            <h2>Course</h2>
            <Dropdown
              sx={{ maxWidth: 180, marginTop: "1rem", marginBottom: "2rem" }}
              options={Object.keys(attendance).map((each) => ({
                name: each,
              }))}
              label="Course"
              onChange={handleAttendanceChange}
              currentValue={selected}
              optionKey="name"
              optionValue="name"
              optionFormattedValue="name"
            />
          </>
        ) : (
          <p>No records found</p>
        )
      ) : null}
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
