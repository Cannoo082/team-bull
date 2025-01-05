import { PATCH } from '../../src/app/api/users/route';
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

describe('PATCH /user', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should return an error for invalid operation', async () => {
    const request = {
      url: 'http://example.com/api/user?operation=invalid-operation',
      json: async () => ({}),
    };

    const response = await PATCH(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({ message: 'Invalid operation' });
  });

  it('should return success for valid email change operation', async () => {
    const mockRequest = {
      url: 'http://example.com/api/user?operation=change-email',
      json: async () => ({ userId: 1, newEmail: 'new@example.com' }),
    };

    execute.mockResolvedValueOnce(true);

    const response = await PATCH(mockRequest);
    const jsonResponse = await response.json();

    expect(execute).toHaveBeenCalledWith('UPDATE user SET Email=? WHERE ID=?', [
      'new@example.com',
      1,
    ]);
    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({ message: 'Success' });
  });

  it('should return success for valid password change operation', async () => {
    const mockRequest = {
      url: 'http://example.com/api/user?operation=change-password',
      json: async () => ({
        userId: 1,
        password: 'oldPassword',
        newPassword: 'newPassword',
      }),
    };

    execute.mockResolvedValueOnce([{ Password: 'hashedOldPassword' }]);
    bcrypt.compare.mockResolvedValueOnce(true);
    bcrypt.genSalt.mockResolvedValueOnce('salt');
    bcrypt.hash.mockResolvedValueOnce('hashedNewPassword');
    execute.mockResolvedValueOnce(true);

    const response = await PATCH(mockRequest);
    const jsonResponse = await response.json();

    expect(bcrypt.compare).toHaveBeenCalledWith(
      'oldPassword',
      'hashedOldPassword'
    );
    expect(execute).toHaveBeenCalledWith(
      'UPDATE user SET Password=? WHERE ID=?',
      ['hashedNewPassword', 1]
    );
    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({ message: 'Success' });
  });

  it('should return error when parameters are missing for email change', async () => {
    const mockRequest = {
      url: 'http://example.com/api/user?operation=change-email',
      json: async () => ({}),
    };

    const response = await PATCH(mockRequest);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({ message: 'Invalid parameters' });
  });

  it('should return error for incorrect password', async () => {
    const mockRequest = {
      url: 'http://example.com/api/user?operation=change-password',
      json: async () => ({
        userId: 1,
        password: 'wrongPassword',
        newPassword: 'newPassword',
      }),
    };

    execute.mockResolvedValueOnce([{ Password: 'hashedOldPassword' }]);
    bcrypt.compare.mockResolvedValueOnce(false);

    const response = await PATCH(mockRequest);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({ message: 'Incorrect password' });
  });

  it('should return error when user is not found', async () => {
    const mockRequest = {
      url: 'http://example.com/api/user?operation=change-password',
      json: async () => ({
        userId: 1,
        password: 'oldPassword',
        newPassword: 'newPassword',
      }),
    };

    execute.mockResolvedValueOnce([]);

    const response = await PATCH(mockRequest);
    const jsonResponse = await response.json();

    expect(response.status).toBe(404);
    expect(jsonResponse).toEqual({ message: 'User not found' });
  });
});
