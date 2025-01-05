import request from 'supertest';
import app from '../../src/utils/app-wrapper';
import { execute } from '@/backend/db';

jest.mock('@/backend/db');

global.Response = {
  json: (body, options = {}) => ({
    status: options.status || 200,
    json: async () => body,
  }),
};

describe("GET /attendance (Black-box)", () => {
  it("should return 400 if semesterId or userId is missing", async () => {
    const response = await request(app)
      .get("/api/attendance?userId=1")
      .expect(400);

    expect(response.body.message).toBe("Provide a semester id and a user id");
  });

  it("should return 400 if user is not found", async () => {
    execute.mockResolvedValueOnce([]); // Mock no user found
    const response = await request(app)
      .get("/api/attendance?userId=999&semesterId=1")
      .expect(400);

    expect(response.body.message).toBe("User not found ");
  });

  it("should return attendance data for students", async () => {
    execute.mockResolvedValueOnce([{ ID: 1, Role: "student" }]); // Mock valid user
    execute.mockResolvedValueOnce([
      { Week: 1, Status: "Present", CourseCode: "CS101", CourseTitle: "Intro to CS" },
      { Week: 2, Status: "Absent", CourseCode: "CS101", CourseTitle: "Intro to CS" },
    ]); // Mock attendance query

    const response = await request(app)
      .get("/api/attendance?userId=1&semesterId=1")
      .expect(200);

    expect(response.body).toEqual({
      "Intro to CS": [
        { Week: 1, Status: "Present", CourseCode: "CS101" },
        { Week: 2, Status: "Absent", CourseCode: "CS101" },
      ],
    });
  });
});
