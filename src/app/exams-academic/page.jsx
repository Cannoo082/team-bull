"use client";

import { useEffect, useState, useContext } from "react";
import styles from "@/styles/pages/ExamsInstructorPage.module.css";
import { AuthContext } from "@/context/AuthContext";
import Dropdown from "@/components/UI/Dropdown";
import Table from "@/components/UI/Table";
import Button from "@/components/UI/Button";
import { getSemesterStatus, addExam, deleteExam } from "@/helpers/functions/http";

export default function ExamsInstructorPage() {
  const authCtx = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [semesterId, setSemesterId] = useState("25S"); // Varsayılan semester
  const [expandedCourse, setExpandedCourse] = useState(null); // Expanded CRN
  const [examData, setExamData] = useState({}); // { CRN: exams }
  const [loadingCourses, setLoadingCourses] = useState(false); // Yükleme durumu
  const [isActiveSemester, setIsActiveSemester] = useState(false); // Aktif semester bilgisi
  const [selectedCRN, setSelectedCRN] = useState(null); // Seçilen CRN
  const [form, setForm] = useState({
    examName: "",
    examDate: "",
    startTime: "",
    endTime: "",
    location: "",
  });

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
          setCourses([]);
          return;
        }

        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("An unexpected error occurred.");
        setCourses([]);
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
        setExamData((prev) => ({ ...prev, [crn]: [] }));
        return;
      }

      setExamData((prev) => ({ ...prev, [crn]: data }));
    } catch (error) {
      console.error("Error fetching exams:", error);
      setExamData((prev) => ({ ...prev, [crn]: [] }));
    }
  }

  function toggleExpand(crn) {
    if (expandedCourse === crn) {
      setExpandedCourse(null); // Collapse
    } else {
      setExpandedCourse(crn); // Expand
      fetchExams(crn); // Sınavları getir
    }
  }

  function handleSemesterChange(event) {
    setSemesterId(event.target.value || null);
    setExpandedCourse(null); // Reset on semester change
    setExamData({});
    setIsActiveSemester(false);
  }

  async function handleAddExam() {
    try {
      await addExam({ crn: selectedCRN, ...form });
      alert("Exam added successfully.");
      const newExam = {
        ExamName: form.examName,
        ExamDate: form.examDate,
        ExamStartTime: form.startTime,
        ExamEndTime: form.endTime,
        ExamLocation: form.location,
      };
      setExamData((prev) => ({
        ...prev,
        [selectedCRN]: prev[selectedCRN] ? [...prev[selectedCRN], newExam] : [newExam],
      }));
      setForm({
        examName: "",
        examDate: "",
        startTime: "",
        endTime: "",
        location: "",
      });
      setSelectedCRN(null);
    } catch (error) {
      alert(error.message || "Failed to add exam.");
    }
  }

  async function handleDeleteExam(examName, crn) {
    if (!confirm(`Are you sure you want to delete the exam: ${examName}?`)) {
      return;
    }

    try {
      await deleteExam({ examName, crn });

      alert("Exam deleted successfully.");

      setExamData((prev) => ({
        ...prev,
        [crn]: prev[crn].filter((exam) => exam.ExamName !== examName),
      }));
    } catch (error) {
      alert(error.message || "Failed to delete exam.");
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const rowsWithButtons = courses.map((course) => ({
    ...course,
    Action: (
      <div>
        <Button
          title={expandedCourse === course.CRN ? "Hide Exams" : "View Exams"}
          onClick={() => toggleExpand(course.CRN)}
          sx={{ fontSize: "0.9rem", padding: "0.5rem", marginRight: "0.5rem" }}
        />
        {isActiveSemester && (
          <Button
            title="Add Exam"
            onClick={() => {
              setSelectedCRN(course.CRN);
              setForm({
                examName: "",
                examDate: "",
                startTime: "",
                endTime: "",
                location: "",
              });
            }}
            sx={{ fontSize: "0.9rem", padding: "0.5rem", backgroundColor: "green", color: "white" }}
          />
        )}
      </div>
    ),
  }));

  return (
    <div className={styles.container}>
      <h1>Instructor Courses</h1>

      <Dropdown
        sx={{ maxWidth: 180, marginTop: "1rem", marginBottom: "2rem" }}
        options={[
          { id: "23S", name: "Spring 2023" },
          { id: "23F", name: "Fall 2023" },
          { id: "24U", name: "Summer 2023" },
          { id: "24S", name: "Spring 2024" },
          { id: "24F", name: "Fall 2024" },
          { id: "24U", name: "Summer 2024" },
          { id: "25S", name: "Spring 2025" },
        ]}
        label="Semester"
        onChange={handleSemesterChange}
        currentValue={semesterId}
        optionKey="id"
        optionValue="id"
        optionFormattedValue="name"
      />

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

      {isActiveSemester && selectedCRN && (
        <div className={styles.addExamForm}>
          <h3>Add Exam for CRN: {selectedCRN}</h3>
          <div>
            <input
              type="text"
              name="examName"
              placeholder="Exam Name"
              value={form.examName}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="examDate"
              placeholder="Exam Date"
              value={form.examDate}
              onChange={handleInputChange}
            />
            <input
              type="time"
              name="startTime"
              placeholder="Start Time"
              value={form.startTime}
              onChange={handleInputChange}
            />
            <input
              type="time"
              name="endTime"
              placeholder="End Time"
              value={form.endTime}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleInputChange}
            />
            <Button
              title="Add Exam"
              onClick={handleAddExam}
              sx={{ marginTop: "1rem", backgroundColor: "blue", color: "white" }}
            />
          </div>
        </div>
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
                Action: isActiveSemester ? (
                  <Button
                    title="Delete"
                    onClick={() => handleDeleteExam(exam.ExamName, expandedCourse)}
                    sx={{ fontSize: "0.9rem", padding: "0.5rem", backgroundColor: "red", color: "white" }}
                  />
                ) : null,
              }))}
              rowKey="ExamName"
              emptyValue="-"
            />
          ) : (
            <p>No exams found for this course.</p>
          )}
        </div>
      )}
    </div>
  );
}








