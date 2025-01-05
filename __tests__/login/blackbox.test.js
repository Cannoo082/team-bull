import request from 'supertest';
import app from '../../src/utils/app-wrapper'; 
import { execute } from '@/backend/db'; 
import bcrypt from 'bcrypt';

jest.mock('@/backend/db'); 
jest.mock('bcrypt');

global.Response = {
  json: (body, options = {}) => ({
    status: options.status || 200,
    json: async () => body,
  }),
};

describe('POST /login (Black-box)', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should return 400 if email and password are missing', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({}) 
      .expect(400); 

    expect(response.body.message).toBe('Email and password should be provided.');
  });

  it('should return 400 if email or password is invalid', async () => {
    execute.mockResolvedValueOnce([]);

    const response = await request(app)
      .post('/api/login')
      .send({ email: 'invalid@example.com', password: 'password123' }) // Invalid email
      .expect(400); 

    expect(response.body.message).toBe('User not found ');
  });

  it('should return 400 if credentials are incorrect', async () => {
    execute.mockResolvedValueOnce([
      { ID: 1, Email: 'test@example.com', Password: 'hashedPassword', Role: 'student' },
    ]);
    bcrypt.compare.mockResolvedValueOnce(false); 

    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'wrongPassword' })
      .expect(400); 

    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return 200 for valid login and return user details', async () => {
    execute.mockResolvedValueOnce([
      { ID: 1, Email: 'test@example.com', Password: 'hashedPassword', Role: 'student' },
    ]);
    bcrypt.compare.mockResolvedValueOnce(true); 

    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200); 

    expect(response.body).toEqual({
      userId: 1,
      email: 'test@example.com',
      role: 'student',
    });
  });

  it('should return 500 if there is a database error', async () => {

    execute.mockResolvedValueOnce(undefined);
  
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(500);
  
    expect(response.body.message).toBe('Failed to check user info');
  });
  

  it('should return 500 if bcrypt comparison fails', async () => {
    execute.mockResolvedValueOnce([
      { ID: 1, Email: 'test@example.com', Password: 'hashedPassword', Role: 'student' },
    ]);
    bcrypt.compare.mockRejectedValueOnce(new Error('Bcrypt error')); // Mock bcrypt failure

    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(500); // Expect HTTP status 500

    expect(response.body.message).toBe('Bcrypt error');
  });
});
