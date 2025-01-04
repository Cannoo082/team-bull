import { execute } from "@/backend/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { examName, crn } = body;

    if (!examName || !crn) {
      return new Response(
        JSON.stringify({ message: "Exam name and CRN are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sql = `DELETE FROM exams WHERE ExamName = ? AND CRN = ?`;
    const params = [examName, crn];

    const result = await execute(sql, params);

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "No exam found to delete." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Exam deleted successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting exam:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete exam." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
