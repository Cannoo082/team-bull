import { execute } from "@/backend/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(
      JSON.stringify({ message: "Provide a user ID" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const sql = `
    SELECT e.*
    FROM exams e
    JOIN course_schedules cs ON e.CRN = cs.CRN
    JOIN enrollment en ON cs.CRN = en.CRN
    JOIN user u ON en.StudentID = u.StudentID
    WHERE u.ID = ?;
  `;
  const params = [userId];

  try {
    const exams = await execute(sql, params);

    if (!exams || exams.length === 0) {
      return new Response(
        JSON.stringify({ message: "No exams found for this user" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const formattedExams = exams.map((exam) => {
      const date = exam.ExamDate;
      const formattedDate = date
        ? new Date(date).toLocaleDateString("tr-TR", {
            timeZone: "Europe/Istanbul",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : null;

      return {
        CRN: exam.CRN,
        ExamName: exam.ExamName,
        ExamDate: formattedDate,
        ExamStartTime: exam.ExamStartTime,
        ExamEndTime: exam.ExamEndTime,
        ExamLocation: exam.ExamLocation,
      };
    });

    return new Response(JSON.stringify(formattedExams), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error while fetching exams:", error);
    return new Response(
      JSON.stringify({ message: "Failed to load exams" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
  