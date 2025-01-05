import request from "supertest";
import app from "../../src/utils/app-wrapper";
import { execute } from "@/backend/db"; 

jest.mock("@/backend/db"); 

global.Response = jest.fn((body, options) => ({
  status: options.status || 200,
  json: async () => JSON.parse(body),
}));

describe("GET /semester (Black-box)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if semesterId is not provided", async () => {
    const response = await request(app)
      .get("/api/semester") 
      .expect(400);

    expect(response.body.message).toBe("Provide a semesterId value");
  });

  it("should return 404 if the semester is not found", async () => {
    execute.mockResolvedValueOnce([]); 

    const response = await request(app)
      .get("/api/semester?semesterId=999") 
      .expect(404);

    expect(response.body.message).toBe("Semester not found");
  });

  it("should return 200 with the semester's active status", async () => {
    execute.mockResolvedValueOnce([{ active: true }]); 

    const response = await request(app)
      .get("/api/semester?semesterId=1") 
      .expect(200);

    expect(response.body).toEqual({ semesterId: "1", active: true });
  });

  it("should return 500 if a database error occurs", async () => {
    execute.mockRejectedValueOnce(new Error("Database error")); 

    const response = await request(app)
      .get("/api/semester?semesterId=1") 
      .expect(500);

    expect(response.body.message).toBe("Failed to fetch semester status");
  });
});
