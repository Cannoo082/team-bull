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

describe('GET /notifications (Black-box)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if userId is missing', async () => {
    const response = await request(app)
      .get('/api/notifications') 
      .expect(400); 

    expect(response.body.message).toBe('Provide a user id');
  });

  it('should return 500 if database execution fails', async () => {
    execute.mockResolvedValueOnce(undefined); 

    const response = await request(app)
      .get('/api/notifications?userId=1') 
      .expect(500); 

    expect(response.body.message).toBe('Failed to load notifications');
  });

  it('should return 200 with an empty array if no notifications are found', async () => {
    execute.mockResolvedValueOnce([]); 

    const response = await request(app)
      .get('/api/notifications?userId=1') 
      .expect(200); 

    expect(response.body).toEqual([]);
  });

  it('should return 200 with notifications if data exists', async () => {
    const mockNotifications = [
      {
        NotificationID: 1,
        Title: 'Notification 1',
        Message: 'This is a test notification',
        DateCreated: '2025-01-01',
        UserNotificationID: 10,
        IsRead: false,
      },
      {
        NotificationID: 2,
        Title: 'Notification 2',
        Message: 'Another test notification',
        DateCreated: '2025-01-02',
        UserNotificationID: 11,
        IsRead: true,
      },
    ];

    execute.mockResolvedValueOnce(mockNotifications); 

    const response = await request(app)
      .get('/api/notifications?userId=1') 
      .expect(200);

    expect(response.body).toEqual(mockNotifications);
  });
});
