import { execute } from "@/backend/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { crn, examName, examDate, startTime, endTime, location } = body;

    if (!crn || !examName || !examDate || !startTime || !endTime || !location) {
      return new Response(
        JSON.stringify({ message: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sql = `
      INSERT INTO exams (CRN, ExamName, ExamDate, ExamStartTime, ExamEndTime, ExamLocation)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [crn, examName, examDate, startTime, endTime, location];

    await execute(sql, params);

    return new Response(JSON.stringify({ message: "Exam added successfully." }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding exam:", error);
    return new Response(
      JSON.stringify({ message: "Failed to add exam." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
