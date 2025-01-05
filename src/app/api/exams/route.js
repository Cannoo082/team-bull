import { execute } from "@/backend/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");
  const semesterId = searchParams.get("semesterId");
  if (courseId === null || semesterId === null) {
    return Response.json(
      { message: "Provide a course id and a semester id  " },
      { status: 400 }
    );
  }

  const sql =
    "SELECT e.* FROM course_schedules cs JOIN exams e ON cs.CRN=e.CRN WHERE cs.CourseID=? AND cs.SemesterID=?";
  const params = [courseId, semesterId];

  const exams = await execute(sql, params);
  if (exams === undefined) {
    return Response.json({ message: "Failed to load exams" }, { status: 500 });
  }

  return Response.json(
    exams.map((exam) => {
      const date = exam.ExamDate;
      if (date) {
        var formattedDate = new Date(date);
        formattedDate = formattedDate.toLocaleDateString("tr-TR", {
          timeZone: "Europe/Istanbul",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
      return {
        CRN: exam.CRN,
        name: exam.ExamName,
        date: formattedDate,
        start_time: exam.ExamStartTime,
        end_time: exam.ExamEndTime,
        location: exam.ExamLocation,
      };
    })
  );
}
