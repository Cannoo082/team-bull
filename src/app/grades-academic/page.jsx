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
  const [semesterId, setSemesterId] = useState("25S"); 
  const [expandedCourse, setExpandedCourse] = useState(null); 
  const [examData, setExamData] = useState({}); 
  const [loadingCourses, setLoadingCourses] = useState(false); 
  const [isActiveSemester, setIsActiveSemester] = useState(false); 
  const [studentsData, setStudentsData] = useState(null); 
  const [expandedExam, setExpandedExam] = useState(null); 
  const [grades, setGrades] = useState({}); 
  const [semesters, setSemesters] = useState([]); 
  const [loadingSemesters, setLoadingSemesters] = useState(true); 



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

        setLoadingCourses(true); 
        const response = await fetch(
          `/api/academic_courses_by_terms?userId=${userId}&semesterId=${semesterId}`
        );
        const data = await response.json();

        if (!response.ok) {
          console.warn(data.message || "Failed to fetch courses");
          setCourses([]); 
          return;
        }

        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("An unexpected error occurred.");
        setCourses([]); 
      } finally {
        setLoadingCourses(false); 
      }
    }

    fetchCourses();
  }, [semesterId, authCtx]);

  useEffect(() => {
    async function fetchSemesters() {
      try {
        const response = await fetch("/api/all-semesters"); 
        const data = await response.json();
  
        if (!response.ok) {
          alert(data.message || "Failed to fetch semesters.");
          setSemesters([]);
          return;
        }

        const formattedSemesters = data.map((semester) => ({
          id: semester.SemesterID,
          name: `${semester.Term} - ${semester.Year}`,
        }));
  
        setSemesters(formattedSemesters);
      } catch (error) {
        console.error("Error fetching semesters:", error);
        alert("An unexpected error occurred.");
        setSemesters([]);
      } finally {
        setLoadingSemesters(false); 
      }
    }
  
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (semesters.length > 0 && !semesterId) {
      setSemesterId(semesters[0].id); 
    }
  }, [semesters, semesterId]);
  
  

  async function fetchExams(crn) {
    try {
      if (examData[crn] !== undefined) return; 

      const response = await fetch(`/api/academic_exams_by_terms?crn=${crn}`);
      const data = await response.json();

      if (!response.ok) {
        console.warn(data.message || "Failed to fetch exams");
        setExamData((prev) => ({ ...prev, [crn]: [] }));
        return;
      }

      setExamData((prev) => ({ ...prev, [crn]: data }));
    } catch (error) {
      console.error("Error fetching exams:", error);
      setExamData((prev) => ({ ...prev, [crn]: [] })); 
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
      setExpandedCourse(null); 
    } else {
      setExpandedCourse(crn); 
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
    setExpandedCourse(null); 
    setExamData({});
    setIsActiveSemester(false); 
  }

  function handleGradeChange(studentId, value) {
    setGrades((prev) => ({ ...prev, [studentId]: value }));
  }

  async function saveGrades() {
    const incompleteGrades = Object.values(grades).some((grade) => grade === "" || grade === undefined);
    if (incompleteGrades || !grades.percentage) {
      alert("Please ensure all grades and the percentage are entered.");
      return;
    }
  
    try {
      const requests = Object.entries(grades).map(([studentId, gradeValue]) => {
        if (studentId === "percentage") return null; 
  
        const payload = {
          studentId,
          crn: expandedCourse,
          gradeName: expandedExam,
          gradeValue,
          gradePercentage: grades.percentage,
        };
  
        console.log("Payload being sent:", payload);
  
        return fetch("/api/grade_control", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      });
  
      const responses = await Promise.all(requests.filter(Boolean)); 
      const allSuccessful = responses.every((res) => res.ok);
  
      if (allSuccessful) {
        alert("Grades have been saved successfully.");
      } else {
        alert("Some grades could not be saved. Please try again.");
      }
    } catch (error) {
      console.error("Error saving grades:", error.message);
      alert("Failed to save grades. Please try again.");
    }
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
      {loadingSemesters ? (
          <p>Loading semesters...</p>
        ) : semesters.length > 0 ? (
          <Dropdown
            sx={{ maxWidth: 180, marginTop: "1rem", marginBottom: "2rem" }}
            options={semesters}
            label="Semester"
            onChange={handleSemesterChange}
            currentValue={semesterId}
            optionKey="id"
            optionValue="id"
            optionFormattedValue="name"
          />
        ) : (
          <p>No semesters available.</p>
        )}

      </div>

      <p>
        Selected Semester: <strong>{semesterId}</strong>{" "}
        {isActiveSemester && <span style={{ color: "green" }}>(Active)</span>}
      </p>

      {expandedCourse && !isActiveSemester && (
  <p>You can only view exams for this semester.</p>
)}

      {loadingCourses ? (
        <p>Loading courses...</p>
      ) : !courses || courses.length === 0 ? (
        <p>There are no courses for this term.</p>
      ) : (
        <Table
          columns={["CRN", "CourseCode", "CourseTitle", "Action"]}
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
        columns={
          isActiveSemester
            ? ["ExamName", "ExamDate", "StartTime", "EndTime", "Location", "Action"]
            : ["ExamName", "ExamDate", "StartTime", "EndTime", "Location"]
        }
        rows={examData[expandedCourse].map((exam) => {
          const row = {
            ExamName: exam.ExamName || "-",
            ExamDate: exam.ExamDate || "-",
            StartTime: exam.ExamStartTime || "-",
            EndTime: exam.ExamEndTime || "-",
            Location: exam.ExamLocation || "-",
          };

          
          if (isActiveSemester) {
            row.Action = (
              <Button
                title={expandedExam === exam.ExamName ? "Hide Students" : "Enter Grades"}
                onClick={() => toggleStudentView(expandedCourse, exam.ExamName)}
                sx={{ fontSize: "0.9rem", padding: "0.5rem", backgroundColor: "blue", color: "white" }}
              />
            );
          }

          return row;
        })}
        rowKey="ExamName"
        emptyValue="-"
      />
    ) : (
      <p>No exams found for this course.</p>
    )}
  </div>
)}


      {isActiveSemester && studentsData && expandedExam && (
        <div className={styles.studentsTable}>
          <h3>Students for Exam: {expandedExam}</h3>
          {studentsData.length > 0 ? (
            <>
              <Table
                columns={["StudentID", "FirstName", "LastName", "Grade"]}
                rows={studentsData.map((student) => ({
                  StudentID: student.StudentID,
                  FirstName: student.StudentFirstName,
                  LastName: student.StudentLastName,
                  Grade: (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grades[student.StudentID] || ""}
                      onChange={(e) => handleGradeChange(student.StudentID, e.target.value)}
                      style={{ width: "60px" }}
                    />
                  ),
                }))}
                rowKey="StudentID"
                emptyValue="-"
              />
                 <p>
                  Please enter percentage for the grade (0-100):
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={grades.percentage || ""}
                    onChange={(e) => setGrades((prev) => ({ ...prev, percentage: e.target.value }))}
                    style={{ marginLeft: "10px", width: "60px" }}
                  />
                </p>


              <Button
                title="Save Grades"
                onClick={saveGrades}
                sx={{ marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "green", color: "white" }}
              />
            </>
          ) : (
            <p>No students found for this exam.</p>
          )}
        </div>
      )}
    </div>
  );
}
