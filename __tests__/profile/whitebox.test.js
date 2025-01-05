import { GET } from '../../src/app/api/profile/route';
import { execute } from '@/backend/db';

// Jest mockları
jest.mock('@/backend/db');

// Global Response mocku
global.Response = {
  json: (body, options = {}) => ({
    status: options.status || 200,
    json: async () => body,
  }),
};

describe('GET /profile', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Mock'ları temizle
  });

  it('should return an error when userId is not provided', async () => {
    const request = {
      url: 'http://example.com/api/profile',
    };

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({ message: 'Provide a user id ' });
  });

  it('should return an error if user is not found', async () => {
    const request = {
      url: 'http://example.com/api/profile?userId=1',
    };

    execute.mockResolvedValueOnce([]);

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(execute).toHaveBeenCalledWith('SELECT * FROM user WHERE ID=?', ['1']);
    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({ message: 'User not found ' });
  });

  it('should return an error if database execution fails for user check', async () => {
    const request = {
      url: 'http://example.com/api/profile?userId=1',
    };

    execute.mockResolvedValueOnce(undefined);

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({ message: 'Failed to check user info' });
  });

  it('should return student profile data for a valid student', async () => {
    const request = {
      url: 'http://example.com/api/profile?userId=1',
    };

    execute.mockResolvedValueOnce([{ ID: 1, Role: 'student', StudentID: 1 }]);
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
    ]);

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({
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
    const request = {
      url: 'http://example.com/api/profile?userId=2',
    };

    execute.mockResolvedValueOnce([{ ID: 2, Role: 'instructor', InstructorID: 2 }]);
    execute.mockResolvedValueOnce([
      {
        UserID: 2,
        Email: 'instructor@example.com',
        CreatedAt: '2025-01-02',
        InstructorID: 2,
        DepartmentID: 20,
        BuildingID: 10,
      },
    ]);

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({
      UserID: 2,
      Email: 'instructor@example.com',
      CreatedAt: '2025-01-02',
      InstructorID: 2,
      DepartmentID: 20,
      BuildingID: 10,
    });
  });

  it('should return admin profile data for a valid admin', async () => {
    const request = {
      url: 'http://example.com/api/profile?userId=3',
    };

    execute.mockResolvedValueOnce([{ ID: 3, Role: 'admin', AdminID: 3 }]);
    execute.mockResolvedValueOnce([
      {
        UserID: 3,
        Email: 'admin@example.com',
        AdminID: 3,
      },
    ]);

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({
      UserID: 3,
      Email: 'admin@example.com',
      AdminID: 3,
    });
  });
});
