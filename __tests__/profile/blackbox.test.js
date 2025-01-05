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

describe('GET /profile (Black-box)', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should return 400 if userId is missing', async () => {
    const response = await request(app)
      .get('/api/profile') // Missing userId
      .expect(400);

    expect(response.body.message).toBe('Provide a user id ');
  });

  it('should return 400 if user is not found', async () => {
    execute.mockResolvedValueOnce([]); // Mock no user found

    const response = await request(app)
      .get('/api/profile?userId=1') // Valid userId
      .expect(400);

    expect(response.body.message).toBe('User not found ');
    expect(execute).toHaveBeenCalledWith('SELECT * FROM user WHERE ID=?', ['1']);
  });

  it('should return 500 if there is a database error while checking user info', async () => {
    execute.mockResolvedValueOnce(undefined); // Mock DB failure

    const response = await request(app)
      .get('/api/profile?userId=1')
      .expect(500);

    expect(response.body.message).toBe('Failed to check user info');
    expect(execute).toHaveBeenCalledWith('SELECT * FROM user WHERE ID=?', ['1']);
  });

  it('should return student profile data for a valid student', async () => {
    execute.mockResolvedValueOnce([{ ID: 1, Role: 'student', StudentID: 1 }]); // Mock user role
    execute.mockResolvedValueOnce([
      {
        UserID: 1,
        Email: 'student@example.com',
        CreatedAt: '2025-01-01',
        StudentID: 1,
        Advisor: 'Dr. Smith',
        DepartmentID: 10,
        BuildingID: 5,
      },
    ]); // Mock student profile data

    const response = await request(app)
      .get('/api/profile?userId=1')
      .expect(200);

    expect(response.body).toEqual({
      UserID: 1,
      Email: 'student@example.com',
      CreatedAt: '2025-01-01',
      StudentID: 1,
      Advisor: 'Dr. Smith',
      DepartmentID: 10,
      BuildingID: 5,
    });
  });

  it('should return instructor profile data for a valid instructor', async () => {
    execute.mockResolvedValueOnce([{ ID: 2, Role: 'instructor', InstructorID: 2 }]); // Mock user role
    execute.mockResolvedValueOnce([
      {
        UserID: 2,
        Email: 'instructor@example.com',
        CreatedAt: '2025-01-02',
        InstructorID: 2,
        DepartmentID: 20,
        BuildingID: 10,
      },
    ]); // Mock instructor profile data

    const response = await request(app)
      .get('/api/profile?userId=2')
      .expect(200);

    expect(response.body).toEqual({
      UserID: 2,
      Email: 'instructor@example.com',
      CreatedAt: '2025-01-02',
      InstructorID: 2,
      DepartmentID: 20,
      BuildingID: 10,
    });
  });

  it('should return admin profile data for a valid admin', async () => {
    execute.mockResolvedValueOnce([{ ID: 3, Role: 'admin', AdminID: 3 }]); // Mock user role
    execute.mockResolvedValueOnce([
      {
        UserID: 3,
        Email: 'admin@example.com',
        AdminID: 3,
      },
    ]); // Mock admin profile data

    const response = await request(app)
      .get('/api/profile?userId=3')
      .expect(200);

    expect(response.body).toEqual({
      UserID: 3,
      Email: 'admin@example.com',
      AdminID: 3,
    });
  });

  it('should return 500 if there is a database error while loading profile data', async () => {
    execute.mockResolvedValueOnce([{ ID: 1, Role: 'student', StudentID: 1 }]); // Mock user role
    execute.mockResolvedValueOnce(undefined); // Mock DB failure for profile data

    const response = await request(app)
      .get('/api/profile?userId=1')
      .expect(500);

    expect(response.body.message).toBe('Failed to load data');
  });
});