"use client";

import { useEffect, useState, useContext } from "react";
import { sendRequestGetAllExams } from "@/helpers/functions/http";
import { AuthContext } from "@/context/AuthContext";
import styles from "@/styles/pages/CalendarStudentPage.module.css";

export default function ExamDatesPage() {
  const authCtx = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    async function fetchExams() {
      const userId = authCtx?.userState?.userId;

      if (!userId) {
        setErrorMessage("User not logged in");
        return;
      }

      try {
        const data = await sendRequestGetAllExams(userId);

        if (data?.error) {
          setErrorMessage(data.message || "Failed to fetch exams");
          return;
        }

        setExams(data);
      } catch (error) {
        setErrorMessage("An error occurred while fetching exams");
      }
    }

    fetchExams();
  }, [authCtx]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInSelectedMonth = getDaysInMonth(selectedMonth, selectedYear);

  const groupedExams = exams.reduce((acc, exam) => {
    const date = exam.ExamDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(exam);
    return acc;
  }, {});

  const allDays = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);
  const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Exam Calendar</h1>

      <div className={styles.selector}>
        <label>Select Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <label>Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <option key={i} value={new Date().getFullYear() + i - 2}>
              {new Date().getFullYear() + i - 2}
            </option>
          ))}
        </select>
      </div>

      {errorMessage ? (
        <p style={{ color: "red" }}>{errorMessage}</p>
      ) : (
        <div>
          <div className={styles.weekdays}>
            {weekdays.map((weekday) => (
              <div key={weekday}>{weekday}</div>
            ))}
          </div>

          <div className={styles.calendar}>
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`}></div>
            ))}

            {allDays.map((day) => {
              const dayString = `${day.toString().padStart(2, "0")}.${selectedMonth
                .toString()
                .padStart(2, "0")}.${selectedYear}`;

              const examsOnThisDay = groupedExams[dayString] || [];

              return (
                <div
                  key={day}
                  className={`${styles.day} ${examsOnThisDay.length ? styles.exam : ""}`}
                >
                  <div className={styles.dayNumber}>{day}</div>
                  {examsOnThisDay.length > 0 && (
                    <ul className={styles.examList}>
                      {examsOnThisDay.map((exam, index) => (
                        <li key={index} className={styles.examItem}>
                          <strong>{exam.ExamName}</strong>
                          <div>{exam.ExamStartTime} - {exam.ExamEndTime}</div>
                          <div>{exam.ExamLocation}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}















