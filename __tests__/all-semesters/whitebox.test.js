import { POST } from "@/app/api/add_exam/route";
import { execute } from "@/backend/db";

jest.mock("@/backend/db");

global.Response = jest.fn((body, options) => ({
  status: options.status || 200,
  json: async () => JSON.parse(body),
}));

describe("POST /add_exam (White-box)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if any required field is missing", async () => {
    const request = {
      json: async () => ({
        crn: "12345",
        examName: "Midterm",
        examDate: "2025-01-15",
        startTime: "10:00",
      }),
    };

    const response = await POST(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse.message).toBe("All fields are required.");
  });

  it("should return 201 if exam is added successfully", async () => {
    const request = {
      json: async () => ({
        crn: "12345",
        examName: "Midterm",
        examDate: "2025-01-15",
        startTime: "10:00",
        endTime: "12:00",
        location: "Room 101",
      }),
    };

    execute.mockResolvedValueOnce();

    const response = await POST(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(201);
    expect(jsonResponse.message).toBe("Exam added successfully.");
    expect(execute).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO exams"),
      expect.arrayContaining(["12345", "Midterm", "2025-01-15", "10:00", "12:00", "Room 101"])
    );
  });

  it("should return 500 if database execution fails", async () => {
    const request = {
      json: async () => ({
        crn: "12345",
        examName: "Midterm",
        examDate: "2025-01-15",
        startTime: "10:00",
        endTime: "12:00",
        location: "Room 101",
      }),
    };

    execute.mockRejectedValueOnce(new Error("Database error"));

    const response = await POST(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse.message).toBe("Failed to add exam.");
  });
});
