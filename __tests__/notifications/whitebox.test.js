import { GET } from '../../src/app/api/notifications/route';
import { execute } from '@/backend/db';

jest.mock('@/backend/db');

global.Response = {
  json: (body, options = {}) => ({
    status: options.status || 200,
    json: async () => body,
  }),
};

describe('GET /notifications', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should return an error when userId is not provided', async () => {
    const request = {
      url: 'http://example.com/api/notifications',
    };

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({ message: 'Provide a user id' });
  });

  it('should return an error if database execution fails', async () => {
    const request = {
      url: 'http://example.com/api/notifications?userId=1',
    };

    execute.mockResolvedValueOnce(undefined); 

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(execute).toHaveBeenCalledWith(
      ` 
    SELECT 
        n.*, 
        un.UserNotificationID, 
        un.IsRead 
    FROM user_notification un, notification n 
    WHERE un.NotificationID=n.NotificationID AND un.UserID=?
  `,
      ['1']
    );
    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({ message: 'Failed to load notifications' });
  });

  it('should return notifications for a valid userId', async () => {
    const request = {
      url: 'http://example.com/api/notifications?userId=1',
    };

    execute.mockResolvedValueOnce([
      {
        NotificationID: 1,
        Title: 'Exam Reminder',
        Body: 'Don’t forget your exam tomorrow.',
        Date: '2025-01-01',
        UserNotificationID: 101,
        IsRead: false,
      },
      {
        NotificationID: 2,
        Title: 'Class Canceled',
        Body: 'Your class for today has been canceled.',
        Date: '2025-01-02',
        UserNotificationID: 102,
        IsRead: true,
      },
    ]);

    const response = await GET(request);
    const jsonResponse = await response.json();

    expect(execute).toHaveBeenCalledWith(
      ` 
    SELECT 
        n.*, 
        un.UserNotificationID, 
        un.IsRead 
    FROM user_notification un, notification n 
    WHERE un.NotificationID=n.NotificationID AND un.UserID=?
  `,
      ['1']
    );
    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual([
      {
        NotificationID: 1,
        Title: 'Exam Reminder',
        Body: 'Don’t forget your exam tomorrow.',
        Date: '2025-01-01',
        UserNotificationID: 101,
        IsRead: false,
      },
      {
        NotificationID: 2,
        Title: 'Class Canceled',
        Body: 'Your class for today has been canceled.',
        Date: '2025-01-02',
        UserNotificationID: 102,
        IsRead: true,
      },
    ]);
  });
});
