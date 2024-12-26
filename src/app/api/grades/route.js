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
    if (role === "student") {
      sql = `
        SELECT c.* FROM enrollment e 
        JOIN course_schedules cs ON e.CRN=cs.CRN 
        JOIN course c ON cs.CourseID=c.CourseID 
        WHERE e.StudentID=?; 
      `;
      params = [user.StudentID];
    }
  
    if (role === "instructor") {
    }
  
  console.log(userId, courseId); 
  
  const grades = [
    {
      type: "quiz",
      weight: 5,
      grade: Math.ceil(Math.random() * 100),
      name: "Quiz 1",
    },
    { type: "quiz", weight: 5, grade: 40, name: "Quiz 2" },
    { type: "midterm", weight: 20, grade: 20, name: "Midterm" },
    { type: "quiz", weight: 5, grade: 100, name: "Quiz 3" },
    { type: "quiz", weight: 5, grade: 80, name: "Quiz 4" },
    { type: "homework", weight: 10, grade: 80, name: "Homework 1" },
    { type: "homework", weight: 10, grade: null, name: "Homework 2" },
    { type: "final", weight: 40, grade: null, name: "Final" },
  ];
  return Response.json(grades);
}
