import { execute } from "@/backend/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const semesterId = searchParams.get("semesterId"); // Required semester ID filter

  if (!userId || !semesterId) {
    return new Response(
      JSON.stringify({ message: "Provide both userId and semesterId" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const sql = `
    SELECT 
        cs.CRN, 
        cs.CourseID, 
        cs.InstructorID,
        cs.SemesterID,
        c.CourseTitle
    FROM 
        user u 
    JOIN 
        course_schedules cs ON u.InstructorID = cs.InstructorID 
    JOIN 
        course c ON cs.CourseID = c.CourseID 
    WHERE 
        u.ID = ? AND cs.SemesterID = ?;
  `;
  const params = [userId, semesterId];

  try {
    const courses = await execute(sql, params);

    if (!courses || courses.length === 0) {
      return new Response(
        JSON.stringify({ message: "No courses found for this instructor and semester" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(courses), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error while fetching courses:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch courses" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


