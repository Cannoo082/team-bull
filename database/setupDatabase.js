const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

(async function initializeDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
  };

  try {
    const connection = await mysql.createConnection({
      ...dbConfig,
      multipleStatements: true,
    });
    const databaseName = process.env.DB_NAME;
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    console.log(`Database "${databaseName}" ensured.`);

    await connection.changeUser({ database: databaseName });

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');


    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

    const dropStatements = `
        DROP TABLE IF EXISTS attendance;
        DROP TABLE IF EXISTS enrollment;
        DROP TABLE IF EXISTS end_of_term_grades;
        DROP TABLE IF EXISTS in_term_grades;
        DROP TABLE IF EXISTS exams;
        DROP TABLE IF EXISTS course_schedules;
        DROP TABLE IF EXISTS course;
        DROP TABLE IF EXISTS instructor;
        DROP TABLE IF EXISTS student;
        DROP TABLE IF EXISTS department;
        DROP TABLE IF EXISTS building;
        DROP TABLE IF EXISTS user;
        DROP TABLE IF EXISTS admin;
        DROP TABLE IF EXISTS notification;
        DROP TABLE IF EXISTS user_notification;
    `;
    const fullScript = dropStatements + schema;

    await connection.query(fullScript);
    console.log('Database schema initialized successfully.');

    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    await connection.end();
  } catch (error) {
    console.error('An error occurred during database initialization:', error.message || error);
    process.exit(1);
  }
})();
