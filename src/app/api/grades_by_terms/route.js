import { execute } from "@/backend/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const crn = searchParams.get("crn");
  const gradeName = searchParams.get("gradeName");

  if (!crn || !gradeName) {
    return new Response(
      JSON.stringify({ message: "Missing required query parameters." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const sql = `
      SELECT 
        itg.StudentID,
        itg.CRN,
        itg.GradeName,
        itg.GradeValue, 
        itg.GradePercentage
      FROM 
        in_term_grades itg
      JOIN 
        student s ON itg.StudentID = s.StudentID
      WHERE 
        itg.CRN = ? AND itg.GradeName = ?;
    `;

    const results = await execute(sql, [crn, gradeName]);

    if (results.length === 0) {
      return new Response(
        JSON.stringify({ message: "No data found.", data: [] }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ data: results }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching grades:", error.message);
    return new Response(
      JSON.stringify({ message: "Internal server error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

