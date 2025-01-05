import { GET } from "@/app/api/academic_exams_by_terms/route";
import { execute } from "@/backend/db";

jest.mock("@/backend/db");

global.Response = jest.fn((body, options) => ({
    status: options.status || 200,
    json: async () => JSON.parse(body),
}));

describe("GET /academic_exams_by_terms (White-box)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if CRN is missing", async () => {
    const request = { url: "http://localhost:3000/api/academic_exams_by_terms" }; // Missing CRN

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse.message).toBe("Provide a CRN value");
  });

  it("should return 404 if no exams are found for the provided CRN", async () => {
    const request = {
      url: "http://localhost:3000/api/academic_exams_by_terms?crn=99999",
    };

    execute.mockResolvedValueOnce([]); // Mock no results

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(404);
    expect(jsonResponse.message).toBe("No exams found for the provided CRN");
  });

  it("should return 200 with formatted results for a valid CRN", async () => {
    const request = {
      url: "http://localhost:3000/api/academic_exams_by_terms?crn=12345",
    };

    const mockData = [
        {
        ExamID: 1,
        CRN: "12345",
        ExamName: "Midterm",
        ExamDate: "2025-01-15T00:00:00.000Z",
        ExamStartTime: "10:00:00",
        ExamEndTime: "12:00:00",
        ExamLocation: "Room 101",
        CourseTitle: "Introduction to Programming",
        },
    ];

    execute.mockResolvedValueOnce(mockData); // Mock valid results

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual([
        {
            ExamID: 1,
            CRN: "12345",
            ExamName: "Midterm",
            ExamDate: "15.01.2025", // Formatted date
            ExamStartTime: "10:00:00",
            ExamEndTime: "12:00:00",
            ExamLocation: "Room 101",
            CourseTitle: "Introduction to Programming",
          },
    ]);
  });

  it("should return 500 if a database error occurs", async () => {
    const request = {
      url: "http://localhost:3000/api/academic_exams_by_terms?crn=12345",
    };

    execute.mockRejectedValueOnce(new Error("Database error")); // Mock DB error

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse.message).toBe("Failed to fetch exams");
  });
});
