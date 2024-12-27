"use client";

import styles from "@/styles/pages/ExamsStudentPage.module.css";
import {
  sendRequestGetCourses,
  sendRequestGetExams,
} from "@/helpers/functions/http";
import { error as errMsg } from "@/helpers/constants/messages";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import Dropdown from "@/components/UI/Dropdown";
import Table from "@/components/UI/Table";
import { formatString } from "@/helpers/functions/util";
const selectedCourseIdDefault = "";
export default function ExamsStudentPage() {
  const authCtx = useContext(AuthContext);
  const [courses, setCourses] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(
    selectedCourseIdDefault
  );
  const [exams, setExams] = useState(null);
  useEffect(() => {
    async function handleGetCourses() {
      const data = await sendRequestGetCourses(authCtx.userState.userId);
      if (data === undefined) {
        return alert(errMsg.default);
      }

      if (data.error) {
        return alert(data.message);
      }

      setCourses(data);
    }

    handleGetCourses();
  }, []);

  useEffect(() => {
    async function handleGetExams() {
      const userId = authCtx.userState.userId;
      const data = await sendRequestGetExams(userId, selectedCourseId);
      if (data === undefined) {
        return alert(errMsg.default);
      }

      if (data.error) {
        return alert(data.message);
      }
      setExams(data);
    }
    if (selectedCourseId !== selectedCourseIdDefault) {
      handleGetExams();
    }
  }, [selectedCourseId]);

  function handleCourseChange(event) {
    setSelectedCourseId(event.target.value);
  }
  console.log(exams);
  return (
    <div className={styles.container}>
      <h1>Exams</h1>
      {courses && (
        <>
          <h2>Courses</h2>
          <Dropdown
            sx={{ maxWidth: 180, marginTop: "1rem", marginBottom: "2rem" }}
            options={courses}
            label="Course"
            onChange={handleCourseChange}
            currentValue={selectedCourseId}
            optionKey="id"
            optionValue="id"
            optionFormattedValue="name"
          />
        </>
      )}
      {!exams ? null : !exams.length ? (
        <p>No exams found</p>
      ) : (
        <Table
          columns={["name", "date", "start_time", "end_time", "location"]}
          rows={exams}
          rowKey="name"
          emptyValue="-"
          handleColumnFormat={(word) => formatString(word, ["_"])}
        />
      )}
    </div>
  );
}
