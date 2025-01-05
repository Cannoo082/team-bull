import { execute } from "@/backend/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const crn = searchParams.get("crn");

  if (!crn) {
    return new Response(
      JSON.stringify({ message: "Provide a CRN value" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const sql = `
    SELECT e.*, c.CourseTitle 
    FROM course_schedules cs
    JOIN exams e ON cs.CRN = e.CRN
    JOIN course c ON c.CourseID = cs.CourseID
    WHERE cs.CRN = ?;
  `;
  const params = [crn];

  try {
    const results = await execute(sql, params);

    if (!results || results.length === 0) {
      return new Response(
        JSON.stringify({ message: "No exams found for the provided CRN" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Format the results if needed (e.g., date formatting)
    const formattedResults = results.map((exam) => {
      const date = exam.ExamDate;
      let formattedDate = null;

      if (date) {
        formattedDate = new Date(date).toLocaleDateString("tr-TR", {
          timeZone: "Europe/Istanbul",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }

      return {
        ...exam,
        ExamDate: formattedDate,
      };
    });

    return new Response(JSON.stringify(formattedResults), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error while fetching exams:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch exams" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
