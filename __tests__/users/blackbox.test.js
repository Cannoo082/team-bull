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

describe('PATCH /users (Black-box)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for invalid operation', async () => {
    const response = await request(app)
      .patch('/api/users?operation=invalid-operation')
      .send({})
      .expect(400);

    expect(response.body.message).toBe('Invalid operation');
  });

  it('should return 400 for missing parameters in change-email', async () => {
    const response = await request(app)
      .patch('/api/users?operation=change-email')
      .send({})
      .expect(400);

    expect(response.body.message).toBe('Invalid parameters');
  });

  it('should return 200 for a successful change-email operation', async () => {
    execute.mockResolvedValueOnce(true); // Mock successful DB operation

    const response = await request(app)
      .patch('/api/users?operation=change-email')
      .send({ userId: 1, newEmail: 'new@example.com' })
      .expect(200);

    expect(response.body.message).toBe('Success');
    expect(execute).toHaveBeenCalledWith('UPDATE user SET Email=? WHERE ID=?', [
      'new@example.com',
      1,
    ]);
  });

  it('should return 500 if database fails during change-email', async () => {
    execute.mockResolvedValueOnce(undefined); // Mock DB failure

    const response = await request(app)
      .patch('/api/users?operation=change-email')
      .send({ userId: 1, newEmail: 'new@example.com' })
      .expect(500);

    expect(response.body.message).toBe('Failed to change email');
  });

  it('should return 400 for missing parameters in change-password', async () => {
    const response = await request(app)
      .patch('/api/users?operation=change-password')
      .send({})
      .expect(400);

    expect(response.body.message).toBe('Invalid parameters');
  });

  it('should return 404 if user is not found during change-password', async () => {
    execute.mockResolvedValueOnce([]); // Mock user not found

    const response = await request(app)
      .patch('/api/users?operation=change-password')
      .send({ userId: 1, password: 'oldPassword', newPassword: 'newPassword' })
      .expect(404);

    expect(response.body.message).toBe('User not found');
  });

  it('should return 400 for incorrect password during change-password', async () => {
    execute.mockResolvedValueOnce([{ Password: 'hashedPassword' }]); // Mock existing password
    bcrypt.compare.mockResolvedValueOnce(false); // Mock password mismatch

    const response = await request(app)
      .patch('/api/users?operation=change-password')
      .send({ userId: 1, password: 'wrongPassword', newPassword: 'newPassword' })
      .expect(400);

    expect(response.body.message).toBe('Incorrect password');
  });

  it('should return 200 for a successful change-password operation', async () => {
    execute.mockResolvedValueOnce([{ Password: 'hashedPassword' }]); // Mock existing password
    bcrypt.compare.mockResolvedValueOnce(true); // Mock password match
    bcrypt.genSalt.mockResolvedValueOnce('salt'); // Mock salt generation
    bcrypt.hash.mockResolvedValueOnce('newHashedPassword'); // Mock hashed password
    execute.mockResolvedValueOnce(true); // Mock successful password update

    const response = await request(app)
      .patch('/api/users?operation=change-password')
      .send({ userId: 1, password: 'oldPassword', newPassword: 'newPassword' })
      .expect(200);

    expect(response.body.message).toBe('Success');
    expect(execute).toHaveBeenCalledWith(
      'UPDATE user SET Password=? WHERE ID=?',
      ['newHashedPassword', 1]
    );
  });

  it('should return 500 if database fails during change-password', async () => {
    execute.mockResolvedValueOnce([{ Password: 'hashedPassword' }]); // Mock existing password
    bcrypt.compare.mockResolvedValueOnce(true); // Mock password match
    bcrypt.genSalt.mockResolvedValueOnce('salt'); // Mock salt generation
    bcrypt.hash.mockResolvedValueOnce('newHashedPassword'); // Mock hashed password
    execute.mockResolvedValueOnce(undefined); // Mock DB failure during update

    const response = await request(app)
      .patch('/api/users?operation=change-password')
      .send({ userId: 1, password: 'oldPassword', newPassword: 'newPassword' })
      .expect(500);

    expect(response.body.message).toBe('Failed to change password');
  });

  it('should return 500 if bcrypt operations fail during change-password', async () => {
    execute.mockResolvedValueOnce([{ Password: 'hashedPassword' }]); // Mock existing password
    bcrypt.compare.mockResolvedValueOnce(true); // Mock password match
    bcrypt.genSalt.mockRejectedValueOnce(new Error('Bcrypt error')); // Mock bcrypt failure

    const response = await request(app)
      .patch('/api/users?operation=change-password')
      .send({ userId: 1, password: 'oldPassword', newPassword: 'newPassword' })
      .expect(500);

    expect(response.body.message).toBe('Bcrypt error');
  });
});
