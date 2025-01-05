import { GET } from '../../src/app/api/grades/route';
import { execute } from '@/backend/db';

jest.mock('@/backend/db');

global.Response = {
    json: (body, options = {}) => ({
        status: options.status || 200,
        json: async () => body,
    }),
};

describe('GET /grades', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should return an error if userId, courseId, or semesterId is missing', async () => {
        const request = {
            url: 'http://example.com/api/grades',
        };

        const response = await GET(request);
        const jsonResponse = await response.json();

        expect(response.status).toBe(400);
        expect(jsonResponse).toEqual({
            message: 'Provide a user id, course id and a semester id',
        });
    });

    it('should return an error if user is not found', async () => {
        const request = {
            url: 'http://example.com/api/grades?userId=1&courseId=101&semesterId=2025',
        };

        execute.mockResolvedValueOnce([]);

        const response = await GET(request);
        const jsonResponse = await response.json();

        expect(execute).toHaveBeenCalledWith('SELECT * FROM user WHERE ID=?', ['1']);
        expect(response.status).toBe(400);
        expect(jsonResponse).toEqual({ message: 'User not found ' });
    });

    it('should return grades data for a valid student', async () => {
        const request = {
            url: 'http://example.com/api/grades?userId=1&courseId=101&semesterId=2025',
        };

        execute.mockResolvedValueOnce([{ ID: 1, Role: 'student', StudentID: 1 }]);
        execute.mockResolvedValueOnce([
            {
                type: 'in',
                in_grade_name: 'Quiz 1',
                in_grade_value: 40,
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

        const response = await GET(request);
        const jsonResponse = await response.json();

        expect(response.status).toBe(200);
        expect(jsonResponse).toEqual({
            inGrade: [
                {
                    name: 'Quiz 1',
                    grade: 40,
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
