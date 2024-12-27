import { execute } from "@/backend/db";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const courseId = searchParams.get("courseId");
  if (userId === null || courseId === null) {
    return Response.json(
      { message: "Provide a user id and a course id" },
      { status: 400 }
    );
  }

  const userArr = await execute("SELECT * FROM user WHERE ID=?", [userId]);

  if (userArr === undefined) {
    return Response.json(
      { message: "Failed to check user info" },
      { status: 500 }
    );
  }

  if (userArr.length !== 1) {
    return Response.json({ message: "User not found " }, { status: 400 });
  }

  const user = userArr[0];
  const role = user.Role.toLowerCase();

  let sql;
  let params;
  let rows;
  if (role === "student") {
    sql = `
    (
      SELECT  
        "in" AS type, 
        GradeName AS in_grade_name , 
        GradeValue AS in_grade_value , 
        GradePercentage AS in_grade_percentage , 
        GradeDescription AS in_grade_description , 
        null AS end_letter_grade , 
        null AS end_grade_out_of_100 
      FROM in_term_grades WHERE StudentID=? AND CRN=(SELECT CRN FROM course_schedules WHERE CourseID=?) 
    )
    UNION ALL 
    (
      SELECT 
        "end" AS type, 
        null AS in_grade_name, 
        null AS in_grade_value, 
        null AS in_grade_percentage, 
        null AS in_grade_description, 
        LetterGrade AS end_letter_grade, 
        GradeOutOf100 AS end_grade_out_of_100 
      FROM end_of_term_grades WHERE StudentID=? AND CRN=(SELECT CRN FROM course_schedules WHERE CourseID=?)
    ) 
      `;
    params = [user.StudentID, courseId, user.StudentID, courseId];
    const data = await execute(sql, params);
    if (data === undefined) {
      return Response.json(
        { message: "Failed to load grades" },
        { status: 500 }
      );
    }

    rows = {
      inGrade: [],
      endGrade: {},
    };

    data.forEach((row) => {
      if (row.type === "in") {
        const record = {
          name: row.in_grade_name,
          grade: row.in_grade_value,
          weight: row.in_grade_percentage,
          description: row.in_grade_description,
        };
        rows.inGrade.push(record);
      } else {
        rows.endGrade.letterGrade = row.end_letter_grade;
        rows.endGrade.grade = row.end_grade_out_of_100;
      }
    });
  }

  if (role === "instructor") {
  }

  const grades = [
    { type: "quiz", weight: 5, grade: 40, name: "Quiz 1" },
    { type: "quiz", weight: 5, grade: 40, name: "Quiz 2" },
    { type: "midterm", weight: 20, grade: 20, name: "Midterm" },
    { type: "quiz", weight: 5, grade: 100, name: "Quiz 3" },
    { type: "quiz", weight: 5, grade: 80, name: "Quiz 4" },
    { type: "homework", weight: 10, grade: 80, name: "Homework 1" },
    { type: "homework", weight: 10, grade: null, name: "Homework 2" },
    { type: "final", weight: 40, grade: null, name: "Final" },
  ];
  return Response.json(rows);
}
