"use client";

import { useEffect, useState, useContext } from "react";
import styles from "@/styles/pages/GradesInstructorPage.module.css";
import { AuthContext } from "@/context/AuthContext";
import Dropdown from "@/components/UI/Dropdown";
import Table from "@/components/UI/Table";
import Button from "@/components/UI/Button";
import { getSemesterStatus } from "@/helpers/functions/http";

export default function GradesInstructorPage() {
  const authCtx = useContext(AuthContext);
  const [courses, setCourses] = useState(null);
  const [semesterId, setSemesterId] = useState("25S"); // Varsayılan semester
  const [expandedCourse, setExpandedCourse] = useState(null); // Expanded CRN
  const [examData, setExamData] = useState({}); // { CRN: exams }
  const [loadingCourses, setLoadingCourses] = useState(false); // Yükleme durumu
  const [isActiveSemester, setIsActiveSemester] = useState(false); // Aktif semester bilgisi
  const [studentsData, setStudentsData] = useState(null); // Öğrenci listesi verisi
  const [expandedExam, setExpandedExam] = useState(null); // Expanded exam

  // Aktif semester bilgisini kontrol et
  useEffect(() => {
    async function fetchSemesterStatus() {
      try {
        const data = await getSemesterStatus(semesterId);
        setIsActiveSemester(data.active === 1);
      } catch (error) {
        console.error("Failed to fetch semester status:", error.message);
        setIsActiveSemester(false);
      }
    }

    if (semesterId) {
      fetchSemesterStatus();
    }
  }, [semesterId]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const userId = authCtx.userState.userId;
        if (!userId || !semesterId) return;

        setLoadingCourses(true); // Yükleme durumu başlatılır
        const response = await fetch(
          `/api/academic_courses_by_terms?userId=${userId}&semesterId=${semesterId}`
        );
        const data = await response.json();

        if (!response.ok) {
          console.warn(data.message || "Failed to fetch courses");
          setCourses([]); // Boş kurs listesi ayarla
          return;
        }

        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("An unexpected error occurred.");
        setCourses([]); // Hata durumunda boş kurs listesi
      } finally {
        setLoadingCourses(false); // Yükleme durumu durdurulur
      }
    }

    fetchCourses();
  }, [semesterId, authCtx]);

  async function fetchExams(crn) {
    try {
      if (examData[crn] !== undefined) return; // Daha önce alınmışsa yeniden almayın

      const response = await fetch(`/api/academic_exams_by_terms?crn=${crn}`);
      const data = await response.json();

      if (!response.ok) {
        console.warn(data.message || "Failed to fetch exams");
        setExamData((prev) => ({ ...prev, [crn]: [] })); // Boş sınav listesi ayarla
        return;
      }

      setExamData((prev) => ({ ...prev, [crn]: data }));
    } catch (error) {
      console.error("Error fetching exams:", error);
      setExamData((prev) => ({ ...prev, [crn]: [] })); // Hata durumunda boş sınav listesi
    }
  }

  async function fetchStudents(crn) {
    if (!isActiveSemester) {
      console.warn("Students can only be viewed for the active semester.");
      return;
    }

    try {
      const response = await fetch(`/api/enrollment?crn=${crn}`);
      const data = await response.json();

      if (!response.ok) {
        console.warn(data.message || "Failed to fetch students");
        setStudentsData([]);
        return;
      }

      setStudentsData(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudentsData([]);
    }
  }

  function toggleExpand(crn) {
    if (expandedCourse === crn) {
      setExpandedCourse(null); // Collapse
    } else {
      setExpandedCourse(crn); // Expand
      fetchExams(crn);
    }
  }

  function toggleStudentView(crn, examName) {
    if (expandedExam === examName) {
      setExpandedExam(null);
      setStudentsData(null);
    } else {
      setExpandedExam(examName);
      fetchStudents(crn);
    }
  }

  function handleSemesterChange(event) {
    setSemesterId(event.target.value || null);
    setExpandedCourse(null); // Reset on semester change
    setExamData({});
    setIsActiveSemester(false); // Yeni semester seçildiğinde aktif bilgisi sıfırlanır
  }

  const rowsWithButtons = courses
    ? courses.map((course) => ({
        ...course,
        Action: (
          <div>
            <Button
              title={expandedCourse === course.CRN ? "Hide Exams" : "View Exams"}
              onClick={() => toggleExpand(course.CRN)}
              sx={{ fontSize: "0.9rem", padding: "0.5rem", marginRight: "0.5rem" }}
            />
          </div>
        ),
      }))
    : [];

  return (
    <div className={styles.container}>
      <h1>Instructor Courses</h1>
      <div className={styles.filters}>
        <Dropdown
          sx={{ maxWidth: 180, marginTop: "1rem", marginBottom: "2rem" }}
          options={[
            { id: "23F", name: "Fall 2023" },
            { id: "23S", name: "Spring 2023" },
            { id: "24U", name: "Summer 2023" },
            { id: "24F", name: "Fall 2024" },
            { id: "24S", name: "Spring 2024" },
            { id: "24U", name: "Summer 2024" },
            { id: "25F", name: "Spring 2025" },
          ]}
          label="Semester"
          onChange={handleSemesterChange}
          currentValue={semesterId}
          optionKey="id"
          optionValue="id"
          optionFormattedValue="name"
        />
      </div>

      <p>
        Selected Semester: <strong>{semesterId}</strong>{" "}
        {isActiveSemester && <span style={{ color: "green" }}>(Active)</span>}
      </p>

      {loadingCourses ? (
        <p>Loading courses...</p>
      ) : !courses || courses.length === 0 ? (
        <p>There are no courses for this term.</p>
      ) : (
        <Table
          columns={["CRN", "CourseID", "CourseTitle", "Action"]}
          rows={rowsWithButtons}
          rowKey="CRN"
          emptyValue="-"
        />
      )}

      {expandedCourse && (
        <div className={styles.examTable}>
          <h3>Exams for CRN: {expandedCourse}</h3>
          {examData[expandedCourse] && examData[expandedCourse].length > 0 ? (
            <Table
              columns={["ExamName", "ExamDate", "StartTime", "EndTime", "Location", "Action"]}
              rows={examData[expandedCourse].map((exam) => ({
                ExamName: exam.ExamName || "-",
                ExamDate: exam.ExamDate || "-",
                StartTime: exam.ExamStartTime || "-",
                EndTime: exam.ExamEndTime || "-",
                Location: exam.ExamLocation || "-",
                Action: (
                  <Button
                    title={expandedExam === exam.ExamName ? "Hide Students" : "Enter Grades"}
                    onClick={() => toggleStudentView(expandedCourse, exam.ExamName)}
                    sx={{ fontSize: "0.9rem", padding: "0.5rem", backgroundColor: "blue", color: "white" }}
                  />
                ),
              }))}
              rowKey="ExamName"
              emptyValue="-"
            />
          ) : (
            <p>No exams found for this course.</p>
          )}
        </div>
      )}

      {studentsData && expandedExam && (
        <div className={styles.studentsTable}>
          <h3>Students for Exam: {expandedExam}</h3>
          {studentsData.length > 0 ? (
            <Table
              columns={["StudentID", "FirstName", "LastName"]}
              rows={studentsData.map((student) => ({
                StudentID: student.StudentID,
                FirstName: student.FirstName,
                LastName: student.LastName,
              }))}
              rowKey="StudentID"
              emptyValue="-"
            />
          ) : (
            <p>No students found for this exam.</p>
          )}
        </div>
      )}
    </div>
  );
}

