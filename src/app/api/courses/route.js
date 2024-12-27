import { execute } from "@/backend/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (userId === null) {
    return Response.json({ message: "Provide a user id" }, { status: 400 });
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

  const courses = await execute(sql, params);
  if (courses === undefined) {
    return Response.json(
      { message: "Failed to load courses" },
      { status: 500 }
    );
  }

  return Response.json(
    courses.map((course) => ({ id: course.CourseID, name: course.CourseTitle }))
  );
}
