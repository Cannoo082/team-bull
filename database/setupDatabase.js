const { initDB } = require('../src/lib/db');
const { pool } = require('../src/lib/db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

(async function initializeDatabase() {
  try {
    await initDB();

    const databaseName = process.env.DB_NAME;
    await pool.query(`USE \`${databaseName}\``);

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    const dropStatements = `
        DROP TABLE IF EXISTS user_notification;
        DROP TABLE IF EXISTS notification;
        DROP TABLE IF EXISTS user;
        DROP TABLE IF EXISTS attendance;
        DROP TABLE IF EXISTS enrollment;
        DROP TABLE IF EXISTS end_of_term_grades;
        DROP TABLE IF EXISTS in_term_grades;
        DROP TABLE IF EXISTS exams;
        DROP TABLE IF EXISTS course_schedules;
        DROP TABLE IF EXISTS course;
        DROP TABLE IF EXISTS student;
        DROP TABLE IF EXISTS instructor;
        DROP TABLE IF EXISTS department;
        DROP TABLE IF EXISTS building;
        DROP TABLE IF EXISTS admin;
    `;
    const fullScript = dropStatements + schema;

    await pool.query(fullScript);
    
    console.log('Database schema initialized successfully.');
  } catch (error) {
    console.error('An error occurred during database initialization:', error.message || error);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
