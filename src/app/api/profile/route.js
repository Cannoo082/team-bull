import { execute } from "@/backend/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (userId === null) {
    return Response.json({ message: "Provide a user id " }, { status: 400 });
  }

  const userArr = await execute("SELECT * FROM user WHERE ID=?", [userId]);

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
  const role = user.Role.toLowerCase();
  let data;
  if (role === "student") {
    const sql = `
      SELECT 
        u.ID AS UserID, 
        u.Email, 
        u.CreatedAt, 
        u.StudentID, 
        s.*, 
        i.*, 
        d.*, 
        b.* 
      FROM 
        user u, 
        student s, 
        instructor i, 
        department d, 
        building b 
      WHERE 
        u.StudentID=s.StudentID 
        AND s.Advisor=i.InstructorID 
        AND s.DepartmentID=d.DepartmentID 
        AND d.BuildingID=b.BuildingID 
        AND u.ID=?     
    `;
    const params = [userId];
    data = await execute(sql, params);
    if (data === undefined) {
      return Response.json({ message: "Failed to load data" }, { status: 500 });
    }
  } else if (role === "instructor") {
    const sql = `
      SELECT 
        u.ID AS UserID , 
        u.Email, 
        u.CreatedAt, 
        u.InstructorID, 
        i.*, 
        d.*, 
        b.* 
      FROM 
        user u, 
        instructor i, 
        department d, 
        building b 
      WHERE 
        u.InstructorID=i.InstructorID 
        AND i.DepartmentID=d.DepartmentID 
        AND d.BuildingID=b.BuildingID 
        AND u.ID=? 
    `;
    const params = [userId];
    data = await execute(sql, params);
    if (data === undefined) {
      return Response.json({ message: "Failed to load data" }, { status: 500 });
    }
  } else {
    const sql = `
      SELECT 
        u.ID AS UserID, 
        u.Email, 
        a.* 
      FROM 
      user u, 
      admin a 
      WHERE 
        u.AdminID=a.AdminID 
        AND u.ID=?`;
    const params = [userId];
    data = await execute(sql, params);
    if (data === undefined) {
      return Response.json({ message: "Failed to load data" }, { status: 500 });
    }
  } 

  return Response.json(data[0]);
}
