"use client";
import styles from "@/styles/pages/GradesStudentPage.module.css";
import Button from "@/components/UI/Button";
import {
  sendRequestGetCourses,
  sendRequestGetGrades,
} from "@/helpers/functions/http";
import { error as errMsg } from "@/helpers/constants/messages";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import Dropdown from "@/components/UI/Dropdown";
import Table from "@/components/UI/Table";
import { formatString } from "@/helpers/functions/util";
const selectedCourseIdDefault = "";
export default function GradesStudentPage() {
  const authCtx = useContext(AuthContext);
  const [courses, setCourses] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(
    selectedCourseIdDefault
  );
  const [grades, setGrades] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
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
    async function handleGetGrades() {
      const userId = authCtx.userState.userId;
      const data = await sendRequestGetGrades(userId, selectedCourseId);
      if (data === undefined) {
        return alert(errMsg.default);
      }

      if (data.error) {
        return alert(data.message);
      }
      setGrades(data);
    }
    if (selectedCourseId !== selectedCourseIdDefault) {
      setSelectedGrade(null);
      handleGetGrades();
    }
  }, [selectedCourseId]);

  function handleCourseChange(event) {
    setSelectedCourseId(event.target.value);
  }
  console.log(grades);
  return (
    <div className={styles.container}>
      <h1>Grades</h1>
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
      {!grades ? null : (
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
          {selectedGrade === "in_grade" && (
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
          )}
          {selectedGrade === "end_grade" && (
            <>
              <p>grade: {grades.endGrade.grade}</p>
              <p>letter grade: {grades.endGrade.letterGrade}</p>
            </>
          )}
        </>
      )}
    </div>
  );
}
