import { execute } from "@/backend/db";

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const examName = searchParams.get("examName");
  const crn = searchParams.get("crn");

  if (!examName || !crn) {
    return new Response(
      JSON.stringify({ message: "Missing required parameters" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const deleteExamSql = `DELETE FROM exams WHERE ExamName = ? AND CRN = ?`;
    await execute(deleteExamSql, [examName, crn]);

    const deleteGradesSql = `DELETE FROM in_term_grades WHERE GradeName = ? AND CRN = ?`;
    await execute(deleteGradesSql, [examName, crn]);

    return new Response(
      JSON.stringify({ message: "Exam and related grades deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting exam and grades:", error.message);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

