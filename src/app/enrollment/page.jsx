"use client";

import styles from "@/styles/pages/EnrollmentPage.module.css";
import DisplayCourse from "@/components/pages/EnrollmentPage/DisplayCourse";
import {
  sendRequestGetCoursesForEnrollment,
  sendRequestEnrollStudent,
} from "@/helpers/functions/http";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { error as errMsg } from "@/helpers/constants/messages";
import Dropdown from "@/components/UI/Dropdown";

export default function EnrollmentPage() {
  const authCtx = useContext(AuthContext);
  const [courses, setCourses] = useState(null);
  const [selectedCrn, setSelectedCrn] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  useEffect(() => {
    async function handleGetCourses() {
      const data = await sendRequestGetCoursesForEnrollment(
          authCtx.userState.userId
      );
      if (data === undefined) {
        return alert(errMsg.default);
      }

      if (data.error) {
        return alert(data.message);
      }

      setCourses(data);
    }

    if (refresh) {
      handleGetCourses();
      setRefresh(false);
    }
  }, [refresh]);
  function handleCourseChange(event) {
    setSelectedCrn(event.target.value);
  }
  function selectCourse() {
    if (!courses || selectedCrn === "") {
      return;
    }
    const temp = structuredClone(courses.find((c) => c.CRN === selectedCrn));
    if (!temp) {
      return;
    }
    const start = temp.ClassStartTime;
    const end = temp.ClassEndTime;
    temp.Time = undefined;
    if (start && end) {
      temp.Time =
          start.slice(0, start.lastIndexOf(":")) +
          " / " +
          end.slice(0, end.lastIndexOf(":"));
    }
    return temp;
  }
  async function handleEnroll() {
    if (selectedCrn === "") {
      return;
    }
    setLoading(true);
    const response = await sendRequestEnrollStudent(
        authCtx.userState.userId,
        selectedCrn
    );
    setLoading(false);
    if (response === undefined) {
      return alert(errMsg.default);
    }

    if (response.error) {
      return alert(response.message);
    }
    setSelectedCrn("");
    setRefresh(true);
    return alert("SUCCESS!");
  }
  return (
      <div className={styles.container}>
        <h1>Enrollment Page</h1>
        <div className={styles.welcome}>
          <p>Welcome to the Enrollment Page!</p>
          <p>Here you can view available courses and enroll in the ones that fit your schedule. Use the dropdown menu to select a course and click the enroll button to register.</p>
        </div>
        <div className={styles.box}>
          {courses ? (
              courses.length ? (
                  <Dropdown
                      sx={{ maxWidth: 180, marginTop: "1rem", marginBottom: "2rem" }}
                      options={courses.map((c) => ({
                        id: c.ID,
                        crn: c.CRN,
                        name: c.CourseTitle,
                      }))}
                      label="Course"
                      onChange={handleCourseChange}
                      currentValue={selectedCrn}
                      optionKey="id"
                      optionValue="crn"
                      optionFormattedValue="name"
                  />
              ) : (
                  <p>No courses found</p>
              )
          ) : null}
        </div>
        {selectedCrn && (
            <div className={`${styles.info} ${styles.box}`}>
              <DisplayCourse
                  course={selectCourse()}
                  handleEnroll={handleEnroll}
                  loading={loading}
              />
            </div>
        )}
      </div>
  );
}