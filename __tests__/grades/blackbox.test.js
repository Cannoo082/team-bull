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

describe('GET /grades (Black-box)', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if userId, courseId, or semesterId is missing', async () => {
        const response = await request(app)
            .get('/api/grades') 
            .expect(400);

        expect(response.body.message).toBe('Provide a user id, course id and a semester id');
    });

    it('should return 400 if user is not found', async () => {
        execute.mockResolvedValueOnce([]); 

        const response = await request(app)
            .get('/api/grades?userId=1&courseId=101&semesterId=2025') 
            .expect(400);

        expect(response.body.message).toBe('User not found ');
    });

    it('should return 500 if database execution fails while checking user info', async () => {
        execute.mockResolvedValueOnce(undefined); 

        const response = await request(app)
            .get('/api/grades?userId=1&courseId=101&semesterId=2025') 
            .expect(500);

        expect(response.body.message).toBe('Failed to check user info');
    });

    it('should return 500 if database execution fails while loading grades', async () => {
        execute.mockResolvedValueOnce([{ ID: 1, Role: 'student', StudentID: 1001 }]); 
        execute.mockResolvedValueOnce(undefined); 

        const response = await request(app)
            .get('/api/grades?userId=1&courseId=101&semesterId=2025') 
            .expect(500);

        expect(response.body.message).toBe('Failed to load grades');
    });

    it('should return 200 with in-term and end-of-term grades for a valid student', async () => {
        execute.mockResolvedValueOnce([{ ID: 1, Role: 'student', StudentID: 1001 }]);
        execute.mockResolvedValueOnce([
            {
                type: 'in',
                in_grade_name: 'Quiz 1',
                in_grade_value: 85,
                in_grade_percentage: 5,
                in_grade_description: 'First quiz',
                end_letter_grade: null,
                end_grade_out_of_100: null,
            },
            {
                type: 'end',
                in_grade_name: null,
                in_grade_value: null,
                in_grade_percentage: null,
                in_grade_description: null,
                end_letter_grade: 'A',
                end_grade_out_of_100: 95,
            },
        ]); 

        const response = await request(app)
            .get('/api/grades?userId=1&courseId=101&semesterId=2025') 
            .expect(200);

        expect(response.body).toEqual({
            inGrade: [
                {
                    name: 'Quiz 1',
                    grade: 85,
                    weight: 5,
                    description: 'First quiz',
                },
            ],
            endGrade: {
                letterGrade: 'A',
                grade: 95,
            },
        });
    });
});
