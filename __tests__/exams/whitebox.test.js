import { GET } from '../../src/app/api/exams/route';
import { execute } from '@/backend/db';

jest.mock('@/backend/db');

global.Response = {
    json: (body, options = {}) => ({
        status: options.status || 200,
        json: async () => body,
    }),
};

describe('GET /exams', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    it('should return an error when courseId or semesterId is not provided', async () => {
        const request = {
            url: 'http://example.com/api/exams',
        };

        const response = await GET(request);
        const jsonResponse = await response.json();

        expect(response.status).toBe(400);
        expect(jsonResponse).toEqual({
            message: 'Provide a course id and a semester id  ',
        });
    });

    it('should return an error if database execution fails for exams', async () => {
        const request = {
            url: 'http://example.com/api/exams?courseId=101&semesterId=2025',
        };

        execute.mockResolvedValueOnce(undefined);

        const response = await GET(request);
        const jsonResponse = await response.json();

        expect(execute).toHaveBeenCalledWith(
            'SELECT e.* FROM course_schedules cs JOIN exams e ON cs.CRN=e.CRN WHERE cs.CourseID=? AND cs.SemesterID=?',
            ['101', '2025']
        );
        expect(response.status).toBe(500);
        expect(jsonResponse).toEqual({ message: 'Failed to load exams' });
    });

    it('should return exams data for a valid courseId and semesterId', async () => {
        const request = {
            url: 'http://example.com/api/exams?courseId=101&semesterId=2025',
        };

        execute.mockResolvedValueOnce([
            {
                CRN: '12345',
                ExamName: 'Midterm',
                ExamDate: '2025-01-15',
                ExamStartTime: '10:00',
                ExamEndTime: '12:00',
                ExamLocation: 'Room A',
            },
        ]);

        const response = await GET(request);
        const jsonResponse = await response.json();

        expect(execute).toHaveBeenCalledWith(
            'SELECT e.* FROM course_schedules cs JOIN exams e ON cs.CRN=e.CRN WHERE cs.CourseID=? AND cs.SemesterID=?',
            ['101', '2025']
        );
        expect(response.status).toBe(200);
        expect(jsonResponse).toEqual([
            {
                CRN: '12345',
                name: 'Midterm',
                date: '15.01.2025',
                start_time: '10:00',
                end_time: '12:00',
                location: 'Room A',
            },
        ]);
    });
});
