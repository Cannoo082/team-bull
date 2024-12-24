export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const courseId = searchParams.get("courseId");
  if (userId === null || courseId === null) {
    return Response.json(
      { message: "Provide a user id and a course id" },
      { status: 400 }
    );
  }

  const grades = [
    { type: "quiz", weight: 5, date: "10-11-2024", name: "Quiz 1" },
    { type: "quiz", weight: 5, date: "11-11-2024", name: "Quiz 2" },
    { type: "midterm", weight: 20, date: "12-11-2024", name: "Midterm 1" },
    { type: "quiz", weight: 5, date: "13-11-2024", name: "Quiz 3" },
    { type: "quiz", weight: 5, date: "14-11-2024", name: "Quiz 4" },
    { type: "midterm", weight: 20, date: "15-11-2024", name: "Midterm 2" },
    { type: "final", weight: 40, date: "18-11-2024", name: "Final" },
  ];
  return Response.json(grades);
}
