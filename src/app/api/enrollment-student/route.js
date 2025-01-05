import { execute } from "@/backend/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const sql = `
    SELECT  
      ROW_NUMBER() OVER() AS ID, 
      c.*, 
      cs.*, 
      i.InstructorFullName AS Instructor ,   
      i.InstructorEmail, 
      s.Active  
    FROM course_schedules cs 
      JOIN course c ON cs.CourseID=c.CourseID 
      JOIN semester s ON cs.SemesterID=s.SemesterID 
      JOIN student st ON st.DepartmentID=c.DepartmentID 
      JOIN instructor i ON i.InstructorID=cs.InstructorID 
      JOIN user u ON u.StudentID=st.StudentID 
    WHERE s.Active=1 
    AND cs.CRN NOT IN (SELECT CRN FROM enrollment WHERE StudentID=(SELECT StudentID FROM user WHERE ID=?))
    AND u.ID=? 
    ORDER BY c.CourseTitle          
  `;
  const params = [userId, userId];

  const data = await execute(sql, params);
  if (data === undefined) {
    return Response.json({ message: "Failed to get data" }, { status: 500 });
  }

  return Response.json(data);
}

export async function POST(request) {
  try {
    var { userId, crn } = await request.json();
  } catch (error) {
    return Response.json(
      { message: "Invalid format for json" },
      { status: 400 }
    );
  }
  if (userId === undefined || crn === undefined) {
    return Response.json(
      { message: "Provide userId and crn" },
      { status: 400 }
    );
  }

  const res = await execute(
    "SELECT Capacity, Enrolled FROM course_schedules WHERE CRN=?",
    [crn]
  );
  if (res === undefined) {
    return Response.json(
      { message: "Failed to enroll student" },
      { status: 500 }
    );
  }

  if (!res.length) {
    return Response.json({ message: "No record found" }, { status: 404 });
  }
  const { Capacity: cap, Enrolled: enr } = res[0];

  if (enr >= cap) {
    return Response.json({ message: "Capacity is full" }, { status: 400 });
  }
  const sql = `
    INSERT INTO enrollment (StudentID, CRN) 
    VALUES ((SELECT StudentID FROM user WHERE ID=?), ?)`;
  const params = [userId, crn];
  if ((await execute(sql, params)) === undefined) {
    return Response.json(
      { message: "Failed to enroll student" },
      { status: 500 }
    );
  }

  const update = await execute(
    "UPDATE course_schedules SET Enrolled=Enrolled+1 WHERE CRN=?",
    [crn]
  );
  if (update === undefined) {
    return Response.json(
      { message: "Failed to update number of enrollment" },
      { status: 500 }
    );
  }

  return Response.json({ message: "ok" });
}
