import React, { useState } from "react";
import styles from "@/styles/components/Calendar.module.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getMonthDays = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days = [];
    const totalDays = lastDayOfMonth.getDate();

    let paddingDays = (firstDayOfMonth.getDay() + 6) % 7;

    for (let i = 0; i < paddingDays; i++) {
      days.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const monthDays = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());

  return (
      <div className={styles.calendarWrapper}>
        <div className={styles.calendarContainer}>
          <div className={styles.header}>
            <button onClick={handlePreviousMonth}>&lt;</button>
            <span className={styles.month}>
            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
          </span>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
          <div className={styles.daysOfWeek}>
            {daysOfWeek.map((day, index) => (
                <span key={index} className={styles.weekday}>
              {day}
            </span>
            ))}
          </div>
          <div className={styles.days}>
            {monthDays.map((day, index) => (
                <div
                    key={index}
                    className={`${styles.day} ${
                        day?.toDateString() === new Date().toDateString() ? styles.today : ""
                    } ${day && (day.getDay() === 6 || day.getDay() === 0) ? styles.weekend : ""}`}
                >
                  {day ? day.getDate() : ""}
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Calendar;