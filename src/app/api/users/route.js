import { execute } from "@/backend/db";
import bcrypt from "bcrypt";

const operations = ["change-email", "change-password"];
export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const operation = searchParams.get("operation");

  if (operation === null || !operations.includes(operation)) {
    return Response.json({ message: "Invalid operation" }, { status: 400 });
  }

  try {
    var json = await request.json();
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }

  console.log(json);
  const response = { message: "Success" };
  if (operation === "change-email") {
    const { userId, newEmail } = json;
    if (userId === undefined || newEmail === undefined) {
      return Response.json({ message: "Invalid parameters" }, { status: 400 });
    }
    const sql = "UPDATE user SET Email=? WHERE ID=?";
    const params = [newEmail, userId];
    const result = await execute(sql, params);
    if (result === undefined) {
      return Response.json(
        { message: "Failed to change email" },
        { status: 500 }
      );
    }
  } else if (operation === "change-password") {
    const { userId, password, newPassword } = json;
    if (
      userId === undefined ||
      password === undefined ||
      newPassword === undefined
    ) {
      return Response.json({ message: "Invalid parameters" }, { status: 400 });
    }
    const sql = "SELECT Password FROM user WHERE  ID=?";
    const params = [userId];
    const result = await execute(sql, params);
    if (result === undefined) {
      return Response.json({ message: "Failed to change password"}, { status: 500 });
    }
    if (!result.length) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    const { Password: passwordConfirm } = result[0];
    const areCredentialsValid = await bcrypt.compare(password, passwordConfirm);
    if (!areCredentialsValid) {
      return Response.json({ message: "Incorrect password" }, { status: 400 });
    }
    let salt, hashedPassword;
    try {
      salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(newPassword, salt);
    } catch (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    const changePassworSql = "UPDATE user SET Password=? WHERE ID=?";
    const changePasswordParams = [hashedPassword, userId];
    const changePasswordResult = await execute(
      changePassworSql,
      changePasswordParams
    );
    if (changePasswordResult === undefined) {
      return Response.json(
        { message: "Failed to change password" },
        { status: 500 }
      );
    }
  }
  return Response.json(response);
}
