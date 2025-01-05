import { execute } from "@/backend/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const semesterId = searchParams.get("semesterId");

  if (!semesterId) {
    return new Response(
      JSON.stringify({ message: "Provide a semesterId value" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const sql = `
    SELECT active 
    FROM semester 
    WHERE semesterId = ?;
  `;
  const params = [semesterId];

  try {
    const results = await execute(sql, params);

    if (!results || results.length === 0) {
      return new Response(
        JSON.stringify({ message: "Semester not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ semesterId, active: results[0].active }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching semester status:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch semester status" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
