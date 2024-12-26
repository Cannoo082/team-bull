import mysql from "mysql2/promise";

export async function execute(sql, params, info = false) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      supportBigNumbers: true,
      decimalNumbers: true,
    });

    // result[0] => rows (data)
    // result[1] => fields (unnecessary)
    const result = await connection.execute(sql, params);

    return result[0];
  } catch (error) {
    console.log(error.message);

    if (info) {
      return { error: true, errorObject: error };
    }
  } finally {
    if (connection) {
      connection.end();
    }
  }

  return;
}
