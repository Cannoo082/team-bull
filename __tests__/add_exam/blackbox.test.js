import request from "supertest";
import app from "../../src/utils/app-wrapper";
import { execute } from "@/backend/db";

jest.mock("@/backend/db");

global.Response = jest.fn((body, options) => ({
    status: options.status || 200,
    json: async () => JSON.parse(body),
}));

describe("POST /add_exam (Black-box)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if any required field is missing", async () => {
    const response = await request(app)
      .post("/api/add_exam")
      .send({
        crn: "12345",
        examName: "Midterm",
        examDate: "2025-01-15",
        startTime: "10:00",
      })
      .expect(400);

    expect(response.body.message).toBe("All fields are required.");
  });

  it("should return 201 if exam is added successfully", async () => {
    execute.mockResolvedValueOnce();

    const response = await request(app)
      .post("/api/add_exam")
      .send({
        crn: "12345",
        examName: "Midterm",
        examDate: "2025-01-15",
        startTime: "10:00",
        endTime: "12:00",
        location: "Room 101",
      })
      .expect(201);

    expect(response.body.message).toBe("Exam added successfully.");
    expect(execute).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO exams"),
      expect.arrayContaining(["12345", "Midterm", "2025-01-15", "10:00", "12:00", "Room 101"])
    );
  });

  it("should return 500 if database execution fails", async () => {
    execute.mockRejectedValueOnce(new Error("Database error"));

    const response = await request(app)
      .post("/api/add_exam")
      .send({
        crn: "12345",
        examName: "Midterm",
        examDate: "2025-01-15",
        startTime: "10:00",
        endTime: "12:00",
        location: "Room 101",
      })
      .expect(500);

    expect(response.body.message).toBe("Failed to add exam.");
  });
});
