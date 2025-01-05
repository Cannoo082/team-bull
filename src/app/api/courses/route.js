import { execute } from "@/backend/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const semesterId = searchParams.get("semesterId");

  if (userId === null || semesterId === null) {
    return Response.json(
      { message: "Provide a user id and a semester id" },
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

  if (role !== "student") {
    return Response.json({ message: "Only students" }, { status: 400 });
  }

  const sql = `
      SELECT c.* FROM enrollment e 
      JOIN course_schedules cs ON e.CRN=cs.CRN 
      JOIN course c ON cs.CourseID=c.CourseID 
      WHERE e.StudentID=? AND cs.SemesterID=?; 
    `;
  const params = [user.StudentID, semesterId];

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
