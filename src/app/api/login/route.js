import { execute } from "@/backend/db"; 
import bcrypt from "bcrypt";

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

  const sqlConfirm = "SELECT * FROM user WHERE Email=?";
  const paramsConfirm = [email];
  const userArr = await execute(sqlConfirm, paramsConfirm);

  if (userArr === undefined) {
    return Response.json(
      { message: "Failed to check user info" },
      { status: 500 }
    );
  }

  if (userArr.length !== 1) {
    return Response.json({ message: "User not found " }, { status: 400 });
  }

  const user = userArr[0];
  const { Password: userPassword } = user;

  let passwordCorrect;
  try {
    passwordCorrect = await bcrypt.compare(password, userPassword);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
  console.log(user);
  if (passwordCorrect) {
    const role = user.Role?.toLowerCase();

    return Response.json({
      userId: user.ID,
      email: user.Email,
      role: role === "instructor" ? "academic" : role,
    });
  }

  return Response.json({ message: "Invalid credentials" }, { status: 400 });
}
