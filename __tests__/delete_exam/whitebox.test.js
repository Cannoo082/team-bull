import { DELETE } from "@/app/api/delete_exam/route";
import { execute } from "@/backend/db";

jest.mock("@/backend/db");

global.Response = jest.fn((body, options) => ({
  status: options.status || 200,
  json: async () => JSON.parse(body),
}));

describe("DELETE /delete_exam (White-box)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if required parameters are missing", async () => {
    const request = { url: "http://localhost:3000/api/delete_exam" }; // Missing parameters

    const response = await DELETE(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse.message).toBe("Missing required parameters");
  });

  it("should return 200 if exam and related grades are deleted successfully", async () => {
    const request = {
      url: "http://localhost:3000/api/delete_exam?examName=Midterm&crn=12345",
    };

    execute.mockResolvedValueOnce(); // Mock successful exam deletion
    execute.mockResolvedValueOnce(); // Mock successful grades deletion

    const response = await DELETE(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse.message).toBe(
      "Exam and related grades deleted successfully"
    );
    expect(execute).toHaveBeenCalledWith(
      "DELETE FROM exams WHERE ExamName = ? AND CRN = ?",
      ["Midterm", "12345"]
    );
    expect(execute).toHaveBeenCalledWith(
      "DELETE FROM in_term_grades WHERE GradeName = ? AND CRN = ?",
      ["Midterm", "12345"]
    );
  });

  it("should return 500 if a database error occurs", async () => {
    const request = {
      url: "http://localhost:3000/api/delete_exam?examName=Midterm&crn=12345",
    };

    execute.mockRejectedValueOnce(new Error("Database error")); // Mock database error

    const response = await DELETE(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse.message).toBe("Internal server error");
  });
});
