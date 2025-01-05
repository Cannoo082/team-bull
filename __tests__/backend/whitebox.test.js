import { execute } from '../../src/backend/db';
import mysql from 'mysql2/promise';

jest.mock('mysql2/promise');

describe('Database execute function', () => {
  it('should execute SQL query with parameters', async () => {
    const mockConnection = {
      execute: jest.fn().mockResolvedValueOnce([['result1', 'result2'], {}]),
      end: jest.fn(),
    };
    mysql.createConnection.mockResolvedValueOnce(mockConnection);

    const sql = 'SELECT * FROM user WHERE ID=?';
    const params = [1];
    const result = await execute(sql, params);

    expect(mockConnection.execute).toHaveBeenCalledWith(sql, params);
    expect(result).toEqual(['result1', 'result2']);
  });

  it('should return undefined if an error occurs', async () => {
    mysql.createConnection.mockRejectedValueOnce(new Error('Connection failed'));

    const sql = 'SELECT * FROM user WHERE ID=?';
    const params = [1];
    const result = await execute(sql, params);

    expect(result).toBeUndefined();
  });
});
