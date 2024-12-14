export async function POST(request) {
  try {
    var { email, password } = await request.json();
  } catch (error) {
    return Response.json(
      { message: "Invalid format for json" },
      { status: 400 }
    );
  }

  if (email === undefined || password === undefined) {
    return Response.json(
      { message: "Email and password should be provided." },
      { status: 400 }
    );
  }

  return Response.json({ message: "ok" }, {status: 201}); 
}
