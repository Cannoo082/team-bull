import styles from "@/styles/components/DisplayCourse.module.css";
import Table from "@/components/UI/Table";
import { formatString } from "@/helpers/functions/util";
import Button from "@/components/UI/Button";
export default function DisplayCourse({ handleEnroll, loading, course }) {
  if (!course) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Table
        columns={[
          "CRN",
          "CourseCode",
          "CourseTitle",
          "TeachingMethod",
          "Instructor",
          "InstructorEmail", 
          "Day",
          "Time",
          "Capacity",
          "Enrolled",
          "Location",
          "Credits",
          "YearOfCourse",
        ]}
        rows={[course]}
        rowKey="CRN"
        emptyValue="-"
        handleColumnFormat={(word) => formatString(word, ["_"])}
      /> 
      <Button sx={{width: "10rem"}} title="Enroll" onClick={handleEnroll} loading={loading} />
    </div>
  );
}
