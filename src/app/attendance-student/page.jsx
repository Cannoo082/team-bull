"use client";

import styles from "@/styles/pages/AttendanceStudent.module.css";
import {formatString} from "@/helpers/functions/util";
import Table from "@/components/UI/Table";
import {useEffect, useState, useContext} from "react";
import {AuthContext} from "@/context/AuthContext";
import {sendRequestGetAttendance} from "@/helpers/functions/http";
import Dropdown from "@/components/UI/Dropdown";

const defaultVal = "";
export default function AttendanceStudent() {
    const authCtx = useContext(AuthContext);
    const [attendance, setAttendance] = useState(null);
    const [selected, setSelected] = useState(defaultVal);
    useEffect(() => {
        async function handleAttendance() {
            const data = await sendRequestGetAttendance(authCtx.userState.userId);
            if (data === undefined) {
                return alert(errMsg.default);
            }

            if (data.error) {
                return alert(data.message);
            }

            setAttendance(data);
        }

        handleAttendance();
    }, []);

    function handleAttendanceChange(event) {
        setSelected(event.target.value);
    }

    if (!attendance) {
        return null;
    }

    if (!Object.keys(attendance).length) {
        return (
            <>
                <h1>Attendance</h1>
                <div className={styles.welcome}>
                    <p>Welcome to the Attendance Page!</p>
                    <p>Here you can view your attendance records for the selected course. Use the dropdown menu to
                        select a
                        course to see the attendance details.</p>
                </div>
                <div className={styles.box}>
                    <p>No records found</p>
                </div>
            </>
        );
    }
    console.log(attendance);
    return (
        <div className={styles.container}>
            <h1>Attendance</h1>
            <div className={styles.welcome}>
                <p>Welcome to the Attendance Page!</p>
                <p>Here you can view your attendance records for the selected course. Use the dropdown menu to select a
                    course to see the attendance details.</p>
            </div>
            {Object.keys(attendance).length > 0 && (
                <div className={styles.box}>
                    <Dropdown
                        sx={{maxWidth: 180, marginTop: "1rem", marginBottom: "2rem"}}
                        options={Object.keys(attendance).map((each) => ({
                            name: each,
                        }))}
                        label="Attendance"
                        onChange={handleAttendanceChange}
                        currentValue={selected}
                        optionKey="name"
                        optionValue="name"
                        optionFormattedValue="name"
                    />
                </div>
            )}
            {selected && (
                <div className={`${styles.info} ${styles.box}`}>
                    <Table
                        columns={["CourseCode", "Week", "Status"]}
                        rows={attendance[selected]}
                        rowKey="Week"
                        emptyValue="-"
                        handleColumnFormat={(word) => formatString(word, ["_"])}
                        sx={{width: "40%"}}
                    />
                </div>
            )}
        </div>
    );
}