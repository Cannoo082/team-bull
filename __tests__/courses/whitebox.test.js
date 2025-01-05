import { GET } from '../../src/app/api/courses/route';
import { execute } from '@/backend/db';

jest.mock('@/backend/db');

global.Response = {
    json: (body, options = {}) => ({
        status: options.status || 200,
        json: async () => body,
    }),
};

describe('GET /courses', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error when userId or semesterId is not provided', async () => {
        const request = {
            url: 'http://example.com/api/courses',
        };

        const response = await GET(request);
        const jsonResponse = await response.json();

        expect(response.status).toBe(400);
        expect(jsonResponse).toEqual({
            message: 'Provide a user id and a semester id',
        });
    });

    it('should return an error if user is not found', async () => {
        const request = {
            url: 'http://example.com/api/courses?userId=1&semesterId=2025',
        };

        execute.mockResolvedValueOnce([]);

        const response = await GET(request);
        const jsonResponse = await response.json();

        expect(execute).toHaveBeenCalledWith('SELECT * FROM user WHERE ID=?', ['1']);
        expect(response.status).toBe(400);
        expect(jsonResponse).toEqual({ message: 'User not found ' });
    });

    it('should return an error if user is not a student', async () => {
        const request = {
            url: 'http://example.com/api/courses?userId=1&semesterId=2025',
        };

        execute.mockResolvedValueOnce([{ ID: 1, Role: 'instructor' }]);

        const response = await GET(request);
        const jsonResponse = await response.json();

        expect(response.status).toBe(400);
        expect(jsonResponse).toEqual({ message: 'Only students' });
    });
});
