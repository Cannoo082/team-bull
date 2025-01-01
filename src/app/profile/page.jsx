"use client";

import styles from "@/styles/pages/ProfilePage.module.css";
import { useEffect, useState, useContext } from "react";
import { sendRequestGetProfile } from "@/helpers/functions/http";
import { AuthContext } from "@/context/AuthContext";

export default function ProfilePage() {
  const authCtx = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function handleProfilesData() {
      const data = await sendRequestGetProfile(authCtx.userState.userId);
      if (data === undefined) {
        return alert(errMsg.default);
      }

      if (data.error) {
        return alert(data.message);
      }

      console.log(data);
      setProfile(data);
    }
    handleProfilesData();
  }, []);

  if (authCtx.userState.role === "admin") {
    return (
      <div className={styles.container}>
        <h1>Profile page </h1>
        {profile && (
          <div className={styles.info}>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>Name</h3>
              <p>{profile["AdminFullName"]}</p>
            </div>
            <div className={styles.row}>
              <h3>Admin ID</h3>
              <p>{profile["AdminID"]}</p>
            </div>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>User ID</h3>
              <p>{profile["UserID"]}</p>
            </div>
            <div className={styles.row}>
              <h3>Email</h3>
              <p>{profile["Email"]}</p>
            </div>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>University Email </h3>
              <p>{profile["AdminEmail"]}</p>
            </div>
            <div className={styles.row}>
              <h3>Phone Number </h3>
              <p>{profile["AdminPhoneNumber"]}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (authCtx.userState.role === "student") {
    return (
      <div className={styles.container}>
        <h1>Profile page </h1>
        {profile && (
          <div className={styles.info}>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>Name</h3>
              <p>{profile["StudentFullName"]}</p>
            </div>
            <div className={styles.row}>
              <h3>Student ID</h3>
              <p>{profile["StudentID"]}</p>
            </div>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>User ID</h3>
              <p>{profile["UserID"]}</p>
            </div>
            <div className={styles.row}>
              <h3>Email</h3>
              <p>{profile["Email"]}</p>
            </div>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>University Email </h3>
              <p>{profile["StudentEmail"]}</p>
            </div>
            <div className={styles.row}>
              <h3>Phone Number </h3>
              <p>{profile["StudentPhoneNumber"]}</p>
            </div>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>Grade </h3>
              <p>{profile["Grade"]}</p>
            </div>
            <div className={styles.row}>
              <h3>GPA</h3>
              <p>{profile["GPA"]}</p>
            </div>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>Advisor </h3>
              <p>{profile["InstructorFullName"]}</p>
            </div>
            <div className={styles.row}>
              <h3>Department </h3>
              <p>{profile["DepartmentName"]}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (authCtx.userState.role === "academic") {
    return (
      <div className={styles.container}>
        <h1>Profile page </h1>
        {profile && (
          <div className={styles.info}>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>Name</h3>
              <p>{profile["InstructorFullName"]}</p>
            </div>
            <div className={styles.row}>
              <h3>Instructor ID</h3>
              <p>{profile["InstructorID"]}</p>
            </div>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>User ID</h3>
              <p>{profile["UserID"]}</p>
            </div>
            <div className={styles.row}>
              <h3>Email</h3>
              <p>{profile["Email"]}</p>
            </div>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>University Email </h3>
              <p>{profile["InstructorEmail"]}</p>
            </div>
            <div className={styles.row}>
              <h3>Personal Email</h3>
              <p>{profile["InstructorPersonalEmail"]}</p>
            </div>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>Website </h3>
              <a href={profile["WebsiteLink"]} target="_blank">
                {profile["WebsiteLink"]}
              </a>
            </div>
            <div className={styles.row}>
              <h3>Location</h3>
              <p>{profile["InstructorLocation"]}</p>
            </div>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>Phone Number</h3>
              <p>{profile["InstructorPhoneNum"]}</p>
            </div>
            <div className={styles.row}>
              <h3>Department </h3>
              <p>
                {profile["DepartmentName"]}{" "}
                <i>
                  ({profile["Abbreviation"]} - {profile["DepartmentCode"]})
                </i>
              </p>
            </div>
            <div className={`${styles.row} ${styles.odd}`}>
              <h3>Building</h3>
              <p>
                {profile["BuildingName"]} <i>({profile["BuildingCode"]})</i>
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
}
