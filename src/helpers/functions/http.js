import * as endpoints from "../constants/endpoints";
import { error as errMsg } from "@/helpers/constants/messages";
function optionsFactory({ method = "POST", mode = "cors", body = {} }) {
  return {
    method,
    mode,
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

async function sendRequest(endpoint, options = {}, info = true) {
  let response, data;

  try {
    response = await fetch(endpoint, options);
    data = await response.json();
  } catch (error) {
    console.log(error.message);
    return;
  }

  if (!response.ok) {
    console.log(`failed to fetch, status code: ${response.status}`);

    if (info) {
      return {
        error: true,
        status: response.status,
        message: data?.message || errMsg.default,
      };
    }
    return;
  }

  return data;
}

export async function sendRequestLogin(email, password) {
  const endpoint = endpoints.login;
  const options = optionsFactory({
    body: {
      email,
      password,
    },
  });

  return await sendRequest(endpoint, options);
}

export async function sendRequestGetCourses(userId, semesterId) {
  const endpoint = `${endpoints.courses}?userId=${userId}&semesterId=${semesterId}`;
  return await sendRequest(endpoint);
}

export async function sendRequestGetGrades(userId, courseId, semesterId) {
  const endpoint = `${endpoints.grades}?userId=${userId}&courseId=${courseId}&semesterId=${semesterId}`;
  return await sendRequest(endpoint);
}

export async function sendRequestGetExams(userId, courseId, semesterId) {
  const endpoint = `${endpoints.exams}?userId=${userId}&courseId=${courseId}&semesterId=${semesterId}`;
  return await sendRequest(endpoint);
}

export async function sendRequestGetNotifications(userId) {
  const endpoint = `${endpoints.notifications}?userId=${userId}`;
  return await sendRequest(endpoint);
}

export async function sendRequestGetAllExams(userId) {
  if (!userId) {
    console.error("User ID is required");
    return {
      error: true,
      message: "User ID is required",
    };
  }

  const endpoint = `${endpoints.examsByUser}?userId=${userId}`;
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  return await sendRequest(endpoint, options);
}

export async function sendRequestGetProfile(userId) {
  const endpoint = `${endpoints.profile}?userId=${userId}`;
  return await sendRequest(endpoint);
}

export async function sendRequestGetAttendance(userId, semesterId) {
  const endpoint = `${endpoints.attendance}?userId=${userId}&semesterId=${semesterId}`;
  return await sendRequest(endpoint);
}

export async function sendRequestChangeEmail(userId, newEmail) {
  const endpoint = `${endpoints.users}?operation=change-email`;

  const options = optionsFactory({
    method: "PATCH",
    body: { userId, newEmail },
  });

  return await sendRequest(endpoint, options);
}

export async function sendRequestChangePassword(userId, password, newPassword) {
  const endpoint = `${endpoints.users}?operation=change-password`;

  const options = optionsFactory({
    method: "PATCH",
    body: { userId, password, newPassword },
  });

  return await sendRequest(endpoint, options);
}

export async function sendRequestGetAcademicCourses(userId, semesterId = null) {
  const endpoint = semesterId
    ? `${endpoints.academic_courses_by_terms}?userId=${userId}&semesterId=${semesterId}`
    : `${endpoints.academic_courses_by_terms}?userId=${userId}`;
}

export async function sendRequestGetExamsByCRN(crn) {
  if (!crn) throw new Error("CRN value is required to fetch exams.");

  const endpoint = `${endpoints.academic_exams_by_terms}?crn=${crn}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Failed to fetch exams.");

    return data;
  } catch (error) {
    throw new Error("Error fetching exams by CRN.");
  }
}

export async function getSemesterStatus(semesterId) {
  if (!semesterId)
    throw new Error("Semester ID is required to fetch semester status.");

  const endpoint = `${endpoints.semester}?semesterId=${semesterId}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message || "Failed to fetch semester status.");

    return data; // { semesterId: "25S", active: 1 }
  } catch (error) {
    throw new Error("Error fetching semester status.");
  }
}

export async function addExam({
  crn,
  examName,
  examDate,
  startTime,
  endTime,
  location,
}) {
  try {
    const response = await fetch("/api/add_exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crn,
        examName,
        examDate,
        startTime,
        endTime,
        location,
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Failed to add exam.");

    return data;
  } catch (error) {
    throw new Error("Error adding exam.");
  }
}

export async function deleteExam({ examName, crn }) {
  try {
    const response = await fetch("/api/delete_exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examName, crn }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Failed to delete exam.");

    return data;
  } catch (error) {
    throw new Error("Error deleting exam.");
  }
}

export async function fetchStudentsByCRN(crn) {
  if (!crn) {
    return new Response(JSON.stringify({ message: "Provide a CRN" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sql = `
    SELECT e.StudentID, u.FirstName, u.LastName
    FROM enrollment e
    JOIN user u ON e.StudentID = u.ID
    WHERE e.CRN = ?;
  `;

  const data = await execute(sql, [crn]);

  if (!data || data.length === 0) {
    return new Response(
      JSON.stringify({ message: "No students found for this CRN" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function saveGrade(
  studentId,
  crn,
  gradeName,
  gradeValue,
  gradePercentage
) {
  try {
    const response = await fetch("/api/in_term_grades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        crn,
        gradeName,
        gradeValue,
        gradePercentage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to save grade:", errorData.message);
      throw new Error(errorData.message || "Failed to save grade.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in saveGrade:", error.message);
    throw error;
  }
}

export async function fetchGrades(crn, gradeName) {
  try {
    const response = await fetch(
      `/api/get_grades?crn=${crn}&gradeName=${gradeName}`
    );
    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to fetch grades:", error.message);
      throw new Error(error.message || "Failed to fetch grades");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in fetchGrades:", error.message);
    throw error;
  }
}

export async function sendRequestGetAllSemesters() {
  const endpoint = endpoints.semestersAll;
  return await sendRequest(endpoint);
}

export async function sendRequestGetCoursesForEnrollment(userId) {
  const endpoint = `${endpoints.enrollmentStudent}?userId=${userId}`;
  return await sendRequest(endpoint);
}

export async function sendRequestEnrollStudent(userId, crn) {
  const endpoint = endpoints.enrollmentStudent;
  const options = optionsFactory({
    body: {
      userId,
      crn,
    },
  });

  return await sendRequest(endpoint, options);
}
