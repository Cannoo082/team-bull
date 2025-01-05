import { execute } from "@/backend/db";

export async function POST(req) {
  const body = await req.json();
  const { studentId, crn, gradeName, gradeValue, gradePercentage } = body;

  if (!studentId || !crn || !gradeName || gradeValue === undefined || !gradePercentage) {
    return new Response(
      JSON.stringify({ message: "Missing required fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const sql = `
      INSERT INTO in_term_grades (StudentID, CRN, GradeName, GradeValue, GradePercentage)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        GradeValue = VALUES(GradeValue),
        GradePercentage = VALUES(GradePercentage);
    `;
    await execute(sql, [studentId, crn, gradeName, gradeValue, gradePercentage]);

    return new Response(
      JSON.stringify({ message: "Grade saved successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error saving grade:", error.message);
    return new Response(
      JSON.stringify({ message: "Internal server error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

