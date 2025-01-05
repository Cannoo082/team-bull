import { GET, POST } from "@/app/api/enrollment-student/route";
import { execute } from "@/backend/db";

jest.mock("@/backend/db");

global.Response = {
  json: (body, options = {}) => ({
    status: options.status || 200,
    json: async () => body,
  }),
};

describe("enrollment-student Route (White-box)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /enrollment-student", () => {
    it("should return 500 if data retrieval fails", async () => {
      execute.mockResolvedValueOnce(undefined);

      const request = {
        url: "http://localhost:3000/api/enrollment-student?userId=1",
      };
      const response = await GET(request);
      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.message).toBe("Failed to get data");
    });

    it("should return data if retrieval is successful", async () => {
      const mockData = [
        { ID: 1, CourseTitle: "Sample Course", Instructor: "Dr. Smith" },
      ];
      execute.mockResolvedValueOnce(mockData); 

      const request = {
        url: "http://localhost:3000/api/enrollment-student?userId=1",
      };
      const response = await GET(request);
      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockData);
    });
  });

  describe("POST /enrollment-student", () => {
    it("should return 400 for invalid JSON format", async () => {
      const request = { json: jest.fn().mockRejectedValueOnce(new Error()) };

      const response = await POST(request);
      const jsonResponse = await response.json();

      expect(response.status).toBe(400);
      expect(jsonResponse.message).toBe("Invalid format for json");
    });

    it("should return 404 if no record is found", async () => {
      execute.mockResolvedValueOnce([]); 

      const request = { json: jest.fn().mockResolvedValueOnce({ userId: 1, crn: "123" }) };
      const response = await POST(request);
      const jsonResponse = await response.json();

      expect(response.status).toBe(404);
      expect(jsonResponse.message).toBe("No record found");
    });

    it("should return 400 if capacity is full", async () => {
      execute.mockResolvedValueOnce([{ Capacity: 10, Enrolled: 10 }]); 

      const request = { json: jest.fn().mockResolvedValueOnce({ userId: 1, crn: "123" }) };
      const response = await POST(request);
      const jsonResponse = await response.json();

      expect(response.status).toBe(400);
      expect(jsonResponse.message).toBe("Capacity is full");
    });

    it("should return 500 if enrollment fails", async () => {
      execute
        .mockResolvedValueOnce([{ Capacity: 10, Enrolled: 5 }]) 
        .mockResolvedValueOnce(undefined); 

      const request = { json: jest.fn().mockResolvedValueOnce({ userId: 1, crn: "123" }) };
      const response = await POST(request);
      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.message).toBe("Failed to enroll student");
    });

    it("should return 200 if enrollment is successful", async () => {
      execute
        .mockResolvedValueOnce([{ Capacity: 10, Enrolled: 5 }]) 
        .mockResolvedValueOnce(true) 
        .mockResolvedValueOnce(true); 

      const request = { json: jest.fn().mockResolvedValueOnce({ userId: 1, crn: "123" }) };
      const response = await POST(request);
      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse.message).toBe("ok");
    });
  });
});
