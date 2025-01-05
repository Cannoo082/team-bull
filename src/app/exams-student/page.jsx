"use client";

import styles from "@/styles/pages/ExamsStudentPage.module.css";
import {
  sendRequestGetCourses,
  sendRequestGetExams,
  sendRequestGetAllSemesters,
} from "@/helpers/functions/http";
import { error as errMsg } from "@/helpers/constants/messages";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import Dropdown from "@/components/UI/Dropdown";
import Table from "@/components/UI/Table";
import { formatString } from "@/helpers/functions/util";
let selectedSemesterIdDefault = "";
let selectedCourseIdDefault = "";
export default function ExamsStudentPage() {
  const authCtx = useContext(AuthContext);
  const [selectedSemesterId, setSelectedSemesterId] = useState(
    selectedSemesterIdDefault
  );
  const [selectedCourseId, setSelectedCourseId] = useState(
    selectedCourseIdDefault
  );
  const [semesters, setSemesters] = useState(null);
  const [courses, setCourses] = useState(null);
  const [exams, setExams] = useState(null);
  useEffect(() => {
    selectedSemesterIdDefault = "";
    selectedCourseIdDefault = "";
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
    async function handleGetCourses() {
      const data = await sendRequestGetCourses(
        authCtx.userState.userId,
        selectedSemesterId
      );
      if (data === undefined) {
        return alert(errMsg.default);
      }

      if (data.error) {
        return alert(data.message);
      }

      setCourses(data);
    }
    if (selectedSemesterId !== selectedSemesterIdDefault) {
      handleGetCourses();
    }
  }, [selectedSemesterId]);

  useEffect(() => {
    async function handleGetExams() {
      const userId = authCtx.userState.userId;
      const data = await sendRequestGetExams(
        userId,
        selectedCourseId,
        selectedSemesterId
      );
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

  function handleSemesterChange(event) {
    setSelectedSemesterId(event.target.value);
    setSelectedCourseId(selectedCourseIdDefault);
  }

  function handleCourseChange(event) {
    setSelectedCourseId(event.target.value);
  }
  return (
    <div className={styles.container}>
      <h1>Exams</h1>
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
      {courses ? (
        courses.length ? (
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
        ) : (
          <p>No courses found</p>
        )
      ) : null}
      {!exams ? null : !exams.length ? (
        <p>No exams found</p>
      ) : (
        selectedCourseId !== selectedCourseIdDefault && (
          <Table
            columns={["name", "date", "start_time", "end_time", "location"]}
            rows={exams}
            rowKey="name"
            emptyValue="-"
            handleColumnFormat={(word) => formatString(word, ["_"])}
          />
        )
      )}
    </div>
  );
}
