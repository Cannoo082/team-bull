import { GET } from "@/app/api/semester/route";
import { execute } from "@/backend/db";

jest.mock("@/backend/db");

global.Response = jest.fn((body, options) => ({
  status: options.status || 200,
  json: async () => JSON.parse(body),
}));

describe("semester Route (White-box)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if semesterId is not provided", async () => {
    const request = { url: "http://localhost:3000/api/semester" };

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse.message).toBe("Provide a semesterId value");
  });

  it("should return 404 if the semester is not found", async () => {
    execute.mockResolvedValueOnce([]); // Mock no results found

    const request = {
      url: "http://localhost:3000/api/semester?semesterId=999",
    };

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(404);
    expect(jsonResponse.message).toBe("Semester not found");
  });

  it("should return 200 with the semester's active status", async () => {
    execute.mockResolvedValueOnce([{ active: true }]); // Mock active semester

    const request = {
      url: "http://localhost:3000/api/semester?semesterId=1",
    };

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({ semesterId: "1", active: true });
  });

  it("should return 500 if a database error occurs", async () => {
    execute.mockRejectedValueOnce(new Error("Database error")); // Mock DB error

    const request = {
      url: "http://localhost:3000/api/semester?semesterId=1",
    };

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse.message).toBe("Failed to fetch semester status");
  });
});
