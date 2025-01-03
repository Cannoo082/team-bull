"use client";

import { useEffect, useState, useContext } from "react";
import { sendRequestGetAllExams } from "@/helpers/functions/http";
import styles from "@/styles/pages/CalenderStudentPage.module.css";
import { AuthContext } from "@/context/AuthContext";

export default function ExamDatesPage() {
  const authCtx = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [calendarData, setCalendarData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState(null);

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}`); 
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate(); 
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth(); 
    const daysInMonth = getDaysInMonth(year, month);
  
   
    const firstDayIndex = new Date(`${year}-${month + 1}-01`).getDay();
  

    return Array(firstDayIndex).fill(null).concat(
      Array.from({ length: daysInMonth }, (_, index) => index + 1)
    );
  };
  

  const fetchExams = async () => {
    const userId = authCtx?.userState?.userId;
  
    if (!userId) {
      setErrorMessage("User not logged in");
      return;
    }
  
    const data = await sendRequestGetAllExams(userId);
  
    try {
      const response = await sendRequestGetAllExams(userId);
  
      console.log("API yanıtı:", response); // Gelen yanıtı doğrudan konsola yazdırın
  
      if (!response || response.length === 0) {
        setErrorMessage("No exams found");
        return;
      }
  
      setExams(response); 
    } catch (error) {
      console.error("API çağrısı sırasında hata:", error);
      setErrorMessage("Failed to fetch exams");
    }
  
    const examData = {};
    data.forEach((exam) => {
      const examDate = parseDate(exam.ExamDate); 
      const day = examDate.getDate();
      const month = examDate.getMonth();
      const year = examDate.getFullYear();
  
      if (year === currentMonth.getFullYear() && month === currentMonth.getMonth()) {
        if (!examData[day]) {
          examData[day] = [];
        }
  
        examData[day].push({
          name: exam.ExamName,
          time: `${exam.ExamStartTime} - ${exam.ExamEndTime}`,
          location: exam.ExamLocation,
        });
      }
    });
  
    setCalendarData(examData);
  };
  

  useEffect(() => {
    fetchExams();
  }, [authCtx, currentMonth]);

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className={styles.frameParent}>
      <div className={styles.frameGroup}>
        <div className={styles.header}>
          <button onClick={handlePreviousMonth} className={styles.navButton}>
            &lt;
          </button>
          <h1>
            {currentMonth.toLocaleString("en-US", { month: "long" })} {currentMonth.getFullYear()}
          </h1>
          <button onClick={handleNextMonth} className={styles.navButton}>
            &gt;
          </button>
        </div>

        <div className={styles.grid}>
          {calendarDays.map((day, index) =>
            day ? (
              <div key={index} className={styles.frameChild}>
                <div className={styles.dayNumber}>{day}</div>
                <ul className={styles.tasks}>
                  {(calendarData[day] || []).map((task, idx) => (
                    <li key={idx} className={styles.task}>
                      <strong>{task.name}</strong>
                      <br />
                      {task.time}
                      <br />
                      {task.location}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div key={index} className={styles.emptyCell}></div>
            )
          )}
        </div>
      </div>
    </div>
  );
}












