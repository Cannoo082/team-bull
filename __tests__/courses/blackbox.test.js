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

describe('GET /courses (Black-box)', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if userId or semesterId is missing', async () => {
        const response = await request(app)
            .get('/api/courses') // Missing userId and semesterId
            .expect(400);

        expect(response.body.message).toBe('Provide a user id and a semester id');
    });

    it('should return 500 if database execution fails while checking user info', async () => {
        execute.mockResolvedValueOnce(undefined); // Mock DB failure

        const response = await request(app)
            .get('/api/courses?userId=1&semesterId=2025') // Valid parameters
            .expect(500);

        expect(response.body.message).toBe('Failed to check user info');
    });

    it('should return 400 if user is not found', async () => {
        execute.mockResolvedValueOnce([]); // Mock user not found

        const response = await request(app)
            .get('/api/courses?userId=1&semesterId=2025') // Valid parameters
            .expect(400);

        expect(response.body.message).toBe('User not found ');
    });

    it('should return 400 if user is not a student', async () => {
        execute.mockResolvedValueOnce([{ ID: 1, Role: 'instructor' }]); // Mock non-student user

        const response = await request(app)
            .get('/api/courses?userId=1&semesterId=2025') // Valid parameters
            .expect(400);

        expect(response.body.message).toBe('Only students');
    });

    it('should return 500 if database execution fails while loading courses', async () => {
        execute.mockResolvedValueOnce([{ ID: 1, Role: 'student', StudentID: 123 }]); // Mock valid student user
        execute.mockResolvedValueOnce(undefined); // Mock DB failure for courses query

        const response = await request(app)
            .get('/api/courses?userId=1&semesterId=2025') // Valid parameters
            .expect(500);

        expect(response.body.message).toBe('Failed to load courses');
    });

    it('should return 200 with a list of courses for a student', async () => {
        execute.mockResolvedValueOnce([{ ID: 1, Role: 'student', StudentID: 123 }]); // Mock valid student user
        execute.mockResolvedValueOnce([
            { CourseID: 'C101', CourseTitle: 'Mathematics 101' },
            { CourseID: 'C102', CourseTitle: 'Physics 101' },
        ]); // Mock courses for the student

        const response = await request(app)
            .get('/api/courses?userId=1&semesterId=2025') // Valid parameters
            .expect(200);

        expect(response.body).toEqual([
            { id: 'C101', name: 'Mathematics 101' },
            { id: 'C102', name: 'Physics 101' },
        ]);
    });

    it('should return 200 with an empty list if no courses are found for the student', async () => {
        execute.mockResolvedValueOnce([{ ID: 1, Role: 'student', StudentID: 123 }]); // Mock valid student user
        execute.mockResolvedValueOnce([]); // Mock no courses found

        const response = await request(app)
            .get('/api/courses?userId=1&semesterId=2025') // Valid parameters
            .expect(200);

        expect(response.body).toEqual([]); // Expect an empty array
    });
});
