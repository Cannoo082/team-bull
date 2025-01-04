import { execute } from "@/backend/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const crn = searchParams.get("crn");

  if (!crn) {
    return new Response(
      JSON.stringify({ message: "Provide a CRN" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const sql = `
        SELECT s.StudentID, s.StudentFirstName, s.StudentLastName
        FROM enrollment e
        JOIN student s ON e.StudentID = s.StudentID
        WHERE e.CRN = ?;

  `;

  try {
    const data = await execute(sql, [crn]);

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ message: "No students found for this CRN" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching students:", error.message);

    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

