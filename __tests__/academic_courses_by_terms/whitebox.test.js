import { GET } from "../../src/app/api/academic_courses_by_terms/route";
import { execute } from "@/backend/db";

jest.mock("@/backend/db");

global.Response = jest.fn((body, options) => ({
  status: options.status || 200,
  json: async () => JSON.parse(body),
}));

describe("GET /academic_courses_by_terms (White-box)", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Mock'ları temizle
  });

  it("should return courses for valid userId and semesterId", async () => {
    const request = {
      url: "http://localhost:3000/api/academic_courses_by_terms?userId=1&semesterId=2025",
    };

    execute.mockResolvedValueOnce([
      {
        CRN: "12345",
        CourseID: "CSE101",
        CourseCode: "CSE-101",
        InstructorID: "10",
        SemesterID: "2025",
        CourseTitle: "Introduction to Programming",
      },
    ]);

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual([
      {
        CRN: "12345",
        CourseID: "CSE101",
        CourseCode: "CSE-101",
        InstructorID: "10",
        SemesterID: "2025",
        CourseTitle: "Introduction to Programming",
      },
    ]);
  });

  it("should return 400 if userId or semesterId is missing", async () => {
    const request = { url: "http://localhost:3000/api/academic_courses_by_terms?userId=1" };

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse.message).toBe("Provide both userId and semesterId");
  });

  it("should return 404 if no courses found", async () => {
    const request = {
      url: "http://localhost:3000/api/academic_courses_by_terms?userId=999&semesterId=2025",
    };

    execute.mockResolvedValueOnce([]); // Kurs bulunamadığında boş array mocklama

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(404);
    expect(jsonResponse.message).toBe(
      "No courses found for this instructor and semester"
    );
  });

  it("should return 500 if database fails", async () => {
    const request = {
      url: "http://localhost:3000/api/academic_courses_by_terms?userId=1&semesterId=2025",
    };

    execute.mockRejectedValueOnce(new Error("Database error")); // Mock veritabanı hatası

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse.message).toBe("Failed to fetch courses");
  });
});
