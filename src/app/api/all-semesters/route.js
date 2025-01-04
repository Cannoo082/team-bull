import { execute } from "@/backend/db";

export async function GET() {
  const sql = "SELECT * FROM semester ORDER BY TermStartDate";
  const params = [];

  const semesters = await execute(sql, params);
  if (semesters === undefined) {
    return Response.json(
      { message: "Failed to fetch semesters" },
      { status: 500 }
    );
  }

  return Response.json(semesters);
}
