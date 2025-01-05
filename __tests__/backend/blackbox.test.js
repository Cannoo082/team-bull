import { execute } from '../../src/backend/db';
import mysql from 'mysql2/promise';

jest.mock('mysql2/promise');

describe('execute (Black-box)', () => {
  let mockConnection;

  beforeEach(() => {
    mockConnection = {
      execute: jest.fn(),
      end: jest.fn(),
    };
    mysql.createConnection.mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute the SQL query and return rows on success', async () => {
    const mockRows = [{ id: 1, name: 'Test' }];
    mockConnection.execute.mockResolvedValueOnce([mockRows, []]);

    const sql = 'SELECT * FROM users WHERE id = ?';
    const params = [1];
    const result = await execute(sql, params);

    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(mockConnection.execute).toHaveBeenCalledWith(sql, params);
    expect(mockConnection.end).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockRows);
  });

  it('should handle database connection errors gracefully', async () => {
    mysql.createConnection.mockRejectedValueOnce(new Error('Connection failed'));

    const sql = 'SELECT * FROM users WHERE id = ?';
    const params = [1];
    const result = await execute(sql, params);

    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(mockConnection.execute).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should return an error object if info flag is true and an error occurs', async () => {
    mockConnection.execute.mockRejectedValueOnce(new Error('Execution failed'));

    const sql = 'SELECT * FROM users WHERE id = ?';
    const params = [1];
    const result = await execute(sql, params, true);

    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(mockConnection.execute).toHaveBeenCalledWith(sql, params);
    expect(mockConnection.end).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      error: true,
      errorObject: new Error('Execution failed'),
    });
  });

  it('should return undefined if no rows are returned', async () => {
    mockConnection.execute.mockResolvedValueOnce([[], []]);

    const sql = 'SELECT * FROM users WHERE id = ?';
    const params = [1];
    const result = await execute(sql, params);

    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(mockConnection.execute).toHaveBeenCalledWith(sql, params);
    expect(mockConnection.end).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it('should close the connection even if an error occurs', async () => {
    mockConnection.execute.mockRejectedValueOnce(new Error('Execution failed'));

    const sql = 'SELECT * FROM users WHERE id = ?';
    const params = [1];
    await execute(sql, params);

    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(mockConnection.execute).toHaveBeenCalledWith(sql, params);
    expect(mockConnection.end).toHaveBeenCalledTimes(1);
  });
});
