import { POST } from '../../src/app/api/login/route';
import { execute } from '@/backend/db';
import bcrypt from 'bcrypt';

// Jest mockları
jest.mock('@/backend/db');
jest.mock('bcrypt');

// Global Response mocku
global.Response = {
  json: (body, options = {}) => ({
    status: options.status || 200, // Varsayılan olarak 200 kullan
    json: async () => body,
  }),
};

describe('POST /login', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Mock'ları temizle
  });

  it('should return an error for invalid JSON format', async () => {
    const request = {
      json: async () => {
        throw new Error('Invalid JSON');
      },
    };

    const response = await POST(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({ message: 'Invalid format for json' });
  });

  it('should return an error when email and password are missing', async () => {
    const request = {
      json: async () => ({}),
    };

    const response = await POST(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({
      message: 'Email and password should be provided.',
    });
  });

  it('should return an error if user is not found', async () => {
    const request = {
      json: async () => ({ email: 'test@example.com', password: 'password123' }),
    };

    execute.mockResolvedValueOnce([]);

    const response = await POST(request);
    const jsonResponse = await response.json();

    expect(execute).toHaveBeenCalledWith('SELECT * FROM user WHERE Email=?', [
      'test@example.com',
    ]);
    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({ message: 'User not found ' });
  });

  it('should return an error if database execution fails', async () => {
    const request = {
      json: async () => ({ email: 'test@example.com', password: 'password123' }),
    };

    execute.mockResolvedValueOnce(undefined);

    const response = await POST(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({ message: 'Failed to check user info' });
  });

  it('should return an error for invalid credentials', async () => {
    const request = {
      json: async () => ({ email: 'test@example.com', password: 'wrongPassword' }),
    };

    execute.mockResolvedValueOnce([{ ID: 1, Email: 'test@example.com', Password: 'hashedPassword', Role: 'student' }]);
    bcrypt.compare.mockResolvedValueOnce(false); // Şifre yanlış

    const response = await POST(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({ message: 'Invalid credentials' });
  });

  it('should return user details for valid credentials', async () => {
    const request = {
      json: async () => ({ email: 'test@example.com', password: 'password123' }),
    };

    execute.mockResolvedValueOnce([{ ID: 1, Email: 'test@example.com', Password: 'hashedPassword', Role: 'student' }]);
    bcrypt.compare.mockResolvedValueOnce(true); // Şifre doğru

    const response = await POST(request);
    const jsonResponse = await response.json();

    expect(execute).toHaveBeenCalledWith('SELECT * FROM user WHERE Email=?', [
      'test@example.com',
    ]);
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({
      userId: 1,
      email: 'test@example.com',
      role: 'student',
    });
  });
});
