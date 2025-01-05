"use client";
import styles from "@/styles/pages/GradesStudentPage.module.css";
import Button from "@/components/UI/Button";
import {
  sendRequestGetCourses,
  sendRequestGetGrades,
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
export default function GradesStudentPage() {
  const authCtx = useContext(AuthContext);
  const [selectedSemesterId, setSelectedSemesterId] = useState(
    selectedSemesterIdDefault
  );
  const [selectedCourseId, setSelectedCourseId] = useState(
    selectedCourseIdDefault
  );
  const [semesters, setSemesters] = useState(null);
  const [courses, setCourses] = useState(null);
  const [grades, setGrades] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
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
    async function handleGetGrades() {
      const userId = authCtx.userState.userId;
      const data = await sendRequestGetGrades(
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
      setGrades(data);
    }
    if (selectedCourseId !== selectedCourseIdDefault) {
      handleGetGrades();
    }
  }, [selectedCourseId]);

  function handleSemesterChange(event) {
    setSelectedSemesterId(event.target.value);
    setSelectedCourseId(selectedCourseIdDefault);
    setSelectedGrade(null);
  }
  function handleCourseChange(event) {
    setSelectedCourseId(event.target.value);
  }

  return (
    <div className={styles.container}>
      <h1>Grades</h1>
      <div className={styles.welcome}>
        <p>Welcome to the Grades Page!</p>
        <p>
          Here you can view your grades for the selected semester and course.
          Use the dropdown menus to select a semester and course to see the
          grades.
        </p>
      </div>
      {semesters ? (
        semesters.length > 0 ? (
          <div className={styles.box}>
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
          </div>
        ) : (
          <div className={styles.box}>
            <p>No semesters found</p>
          </div>
        )
      ) : null}
      {courses ? (
        courses.length > 0 ? (
          <div className={styles.box}>
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
          </div>
        ) : (
          <div className={styles.box}>
            <p>No courses found</p>
          </div>
        )
      ) : null}
      {selectedCourseId && grades ? (
        <>
          <div className={styles["grade-buttons-container"]}>
            <Button
              title="In Grade"
              sx={{ width: "10rem" }}
              onClick={() => {
                if (selectedGrade !== "in_grade") {
                  setSelectedGrade("in_grade");
                }
              }}
            />
            <span style={{ width: "1rem" }}></span>
            <Button
              title="End Grade"
              sx={{ width: "10rem" }}
              onClick={() => {
                if (selectedGrade !== "end_grade") {
                  setSelectedGrade("end_grade");
                }
              }}
            />
          </div>
          <br />
          {selectedGrade === "in_grade" &&
            grades.inGrade &&
            (grades.inGrade.length ? (
              <div className={`${styles.info} ${styles.box}`}>
                <Table
                  columns={["name", "grade", "weight", "description"]}
                  rows={grades.inGrade.map((grade) => ({
                    ...grade,
                    weight: "%" + grade.weight,
                  }))}
                  rowKey="name"
                  emptyValue="-"
                  handleColumnFormat={(word) => formatString(word, ["_"])}
                />
              </div>
            ) : (
              <div className={styles.box}>
                <p>No in grades found</p>
              </div>
            ))}
          {selectedGrade === "end_grade" &&
            grades.endGrade &&
            (Object.keys(grades.endGrade).length ? (
              <div className={`${styles.info} ${styles.box}`}>
                <p>Grade: {grades.endGrade.grade}</p>
                <p>Letter Grade: {grades.endGrade.letterGrade}</p>
              </div>
            ) : (
              <div className={styles.box}>
                <p>No end grades found</p>
              </div>
            ))}
        </>
      ) : null }
    </div>
  );
}
