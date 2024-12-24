export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (userId === null) {
    return Response.json({ message: "Provide a user id" }, { status: 400 });
  }

  console.log(userId, userId === "");
  const courses = [
    { id: 1, name: "Course 1" },
    { id: 2, name: "Course 2" },
    { id: 3, name: "Course 3" },
    { id: 4, name: "Course 4" },
  ];
  return Response.json(courses);
}
