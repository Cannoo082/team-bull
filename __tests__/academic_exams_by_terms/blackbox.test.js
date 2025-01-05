import request from "supertest";
import app from "../../src/utils/app-wrapper";

global.Response = jest.fn((body, options) => ({
    status: options.status || 200,
    json: async () => JSON.parse(body),
}));

describe("GET /academic_exams_by_terms (Black-box)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if CRN is missing", async () => {
    const response = await request(app)
      .get("/api/academic_exams_by_terms") 
      .expect(400);

    expect(response.body.message).toBe("Provide a CRN value");
  });

  it("should return 404 if no exams are found for the provided CRN", async () => {
    const response = await request(app)
      .get("/api/academic_exams_by_terms?crn=99999") 
      .expect(404);

    expect(response.body.message).toBe("No exams found for the provided CRN");
  });

});
