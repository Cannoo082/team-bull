"use client"; 
import { useState, useEffect } from "react";
import styles from "@/styles/components/Menu.module.css";


const capitalize = (text) => {
  return text
    .toLowerCase() 
    .split(" ") 
    .map((word) => {
      if (word.trim().length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" "); 
};


const translateFoodName = async (foodName) => {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        foodName
      )}&langpair=tr|en`
    );
    const data = await res.json();
    const translatedText = data.responseData.translatedText || foodName;
    return capitalize(translatedText.trim()); 
  } catch (error) {
    console.error("Translation error:", error);
    return capitalize(foodName); 
  }
};

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [date, setDate] = useState(getTodayDate());
  const [loading, setLoading] = useState(true);
  const [totalCalories, setTotalCalories] = useState(0);
  const [isWeekend, setIsWeekend] = useState(false);

  
  function getTodayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); 
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  }

  
  function checkIfWeekend(selectedDate) {
    const [day, month, year] = selectedDate.split(".");
    const selectedDay = new Date(`${year}-${month}-${day}`).getDay();
    return selectedDay === 0 || selectedDay === 6; // 
  }

  
  const fetchMenu = async (selectedDate) => {
    const isWeekendSelected = checkIfWeekend(selectedDate || date);
    setIsWeekend(isWeekendSelected);

    if (isWeekendSelected) {
      setMenu([]);
      setTotalCalories(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://cu-yemekhane.herokuapp.com/menu/${selectedDate || date}`,
        {
          cache: "no-store",
        }
      );
      const data = await res.json();
      if (data.success) {
        const translatedFoods = await Promise.all(
          data.data.foods.map(async (food) => ({
            name: await translateFoodName(food.name.trim()), 
            calories: food.calories,
          }))
        );
        setMenu(translatedFoods || []);
        setTotalCalories(data.data.totalCalories || 0);
      } else {
        setMenu([]);
        setTotalCalories(0);
      }
    } catch (error) {
      console.error("An error occurs:", error);
      setMenu([]);
      setTotalCalories(0);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div className={styles.menuContainer}>
      <h2 className={styles.title}>Lunch Menu</h2>

      {}
      <div className={styles.dateSelector}>
        <label htmlFor="date" className={styles.label}>
          Pick a date:
        </label>
        <input
          type="date"
          id="date"
          className={styles.dateInput}
          value={date.split(".").reverse().join("-")} 
          onChange={(e) => {
            const selectedDate = e.target.value.split("-").reverse().join(".");
            setDate(selectedDate);
            fetchMenu(selectedDate);
          }}
        />
      </div>

      {}
      {isWeekend ? (
        <p className={styles.weekendMessage}>
          There is no service on the weekends, please select weekdays.
        </p>
      ) : loading ? (
        <p className={styles.loadingMessage}>Loading...</p>
      ) : menu.length > 0 ? (
        // Menü tablosu
        <div className={styles.menuTableWrapper}>
          <table className={styles.menuTable}>
            <thead>
              <tr>
                <th>Meals</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.calories} Calories</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.totalCalories}>
            Total Calories: {totalCalories} calories
          </p>
        </div>
      ) : (
        <p className={styles.noMenuMessage}>There is no menu, please select a valid date.</p>
      )}
    </div>
  );
}



