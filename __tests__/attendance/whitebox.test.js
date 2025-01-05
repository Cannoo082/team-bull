import { GET } from "@/app/api/attendance/route";
import { execute } from "@/backend/db";

jest.mock("@/backend/db");

global.Response = {
  json: (body, options = {}) => ({
    status: options.status || 200,
    json: async () => body,
  }),
};

describe("GET /attendance (White-box)", () => {
  it("should return an error when semesterId or userId is not provided", async () => {
    const request = { url: "http://localhost/api/attendance?userId=1" };
    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: "Provide a semester id and a user id",
    });
  });

  it("should return attendance data for a valid student", async () => {
    const request = {
      url: "http://localhost/api/attendance?userId=1&semesterId=1",
    };

    execute.mockResolvedValueOnce([{ ID: 1, Role: "student" }]); // Mock valid user
    execute.mockResolvedValueOnce([
      { Week: 1, Status: "Present", CourseCode: "CS101", CourseTitle: "Intro to CS" },
      { Week: 2, Status: "Absent", CourseCode: "CS101", CourseTitle: "Intro to CS" },
    ]); // Mock attendance query

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      "Intro to CS": [
        { Week: 1, Status: "Present", CourseCode: "CS101" },
        { Week: 2, Status: "Absent", CourseCode: "CS101" },
      ],
    });
  });

  it("should return an error if user is not found", async () => {
    const request = {
      url: "http://localhost/api/attendance?userId=999&semesterId=1",
    };

    execute.mockResolvedValueOnce([]); // Mock no user found
    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ message: "User not found " });
  });
});
