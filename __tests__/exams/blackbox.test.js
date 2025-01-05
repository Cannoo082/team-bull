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

describe('GET /exams (Black-box)', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if courseId or semesterId is missing', async () => {
        const response = await request(app)
            .get('/api/exams') // Missing parameters
            .expect(400);

        expect(response.body.message).toBe('Provide a course id and a semester id  ');
    });

    it('should return 500 if database execution fails while loading exams', async () => {
        execute.mockResolvedValueOnce(undefined); // Mock DB failure

        const response = await request(app)
            .get('/api/exams?courseId=101&semesterId=2025') // Valid parameters
            .expect(500);

        expect(response.body.message).toBe('Failed to load exams');
    });

    it('should return 200 with a list of exams for valid courseId and semesterId', async () => {
        execute.mockResolvedValueOnce([
            {
                CRN: '12345',
                ExamName: 'Midterm',
                ExamDate: '2025-01-15',
                ExamStartTime: '10:00',
                ExamEndTime: '12:00',
                ExamLocation: 'Room 101',
            },
        ]); // Mock valid exams data

        const response = await request(app)
            .get('/api/exams?courseId=101&semesterId=2025') // Valid parameters
            .expect(200);

        expect(response.body).toEqual([
            {
                CRN: '12345',
                name: 'Midterm',
                date: '15.01.2025',
                start_time: '10:00',
                end_time: '12:00',
                location: 'Room 101',
            },
        ]);
    });

    it('should return 200 with an empty list if no exams are found', async () => {
        execute.mockResolvedValueOnce([]); // Mock no exams found

        const response = await request(app)
            .get('/api/exams?courseId=101&semesterId=2025') // Valid parameters
            .expect(200);

        expect(response.body).toEqual([]); // Expect an empty array
    });

    it('should handle invalid dates gracefully', async () => {
        execute.mockResolvedValueOnce([
            {
                CRN: '12345',
                ExamName: 'Midterm',
                ExamDate: null, // Invalid date
                ExamStartTime: '10:00',
                ExamEndTime: '12:00',
                ExamLocation: 'Room 101',
            },
        ]); // Mock exams data with an invalid date

        const response = await request(app)
            .get('/api/exams?courseId=101&semesterId=2025') // Valid parameters
            .expect(200);

        expect(response.body).toEqual([
            {
                CRN: '12345',
                name: 'Midterm',
                date: undefined, // No formatted date should be returned
                start_time: '10:00',
                end_time: '12:00',
                location: 'Room 101',
            },
        ]);
    });
});
