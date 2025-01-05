import { sendRequestLogin } from '@/helpers/functions/http';

global.fetch = jest.fn();

describe('HTTP Functions', () => {
  it('should send a POST request for login and return data', async () => {
    const mockResponse = { userId: 1, email: 'test@example.com' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const data = await sendRequestLogin('test@example.com', 'password123');
    expect(data).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('/api/login', expect.any(Object));
  });

  it('should handle failed login request gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
      status: 400,
    });

    const data = await sendRequestLogin('test@example.com', 'wrongPassword');
    expect(data).toEqual({
      error: true,
      status: 400,
      message: 'Invalid credentials',
    });
  });
});
