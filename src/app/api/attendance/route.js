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

  let sql;
  let params;
  let data;
  if (role === "student") {
    sql = `
      SELECT  
        a.Week, 
        a.Status, 
        c.CourseCode, 
        c.CourseTitle            
      FROM 
        user u, 
        attendance a, 
        course_schedules cs, 
        course c 
      WHERE a.CRN=cs.CRN 
        AND cs.CourseID=c.CourseID 
        AND u.StudentID=a.StudentID 
        AND u.StudentID=?  
    `;
    params = [userId];
    const rows = await execute(sql, params);
    if (rows === undefined) {
      return Response.json(
        { message: "Failed to load attendace" },
        { status: 500 }
      );
    }

    data = {};
    rows.forEach((row) => {
      const object = {
        ...row,
        CourseTitle: undefined,
      };
      if (data[row.CourseTitle] === undefined) {
        data[row.CourseTitle] = [object];
      } else {
        data[row.CourseTitle].push(object);
      }
    });
  }

  if (role === "instructor") {
  }

  return Response.json(data);
}
