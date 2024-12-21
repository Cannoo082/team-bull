const mysql = require('mysql2/promise');
const faker = require('@faker-js/faker').faker;
const bcrypt = require('bcrypt');
require('dotenv').config();

(async function seedDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  };

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the database.');

    const executeQuery = async (query, values = []) => {
      const [rows] = await connection.query(query, values);
      return rows; 
    };

    // Seed `building`
    console.log('Seeding `building`...');
    for (let i = 1; i <= 50; i++) {
      await executeQuery(
        `INSERT INTO building (BuildingID, BuildingName, BuildingCode) VALUES (?, ?, ?)`,
        [`B${i.toString().padStart(3, '0')}`, faker.company.name() + ' Building', faker.string.alpha(3).toUpperCase()]
      );
    }

    // Seed `department`
    console.log('Seeding `department`...');
    for (let i = 1; i <= 50; i++) {
      await executeQuery(
        `INSERT INTO department (DepartmentID, DepartmentName, BuildingID) VALUES (?, ?, ?)`,
        [
          `D${i.toString().padStart(3, '0')}`,
          faker.commerce.department().slice(0, 50),
          `B${faker.number.int({ min: 1, max: 50 }).toString().padStart(3, '0')}`,
        ]
      );
    }

    // Seed `instructor`
    console.log('Seeding `instructor`...');
    for (let i = 1; i <= 50; i++) {
      await executeQuery(
        `INSERT INTO instructor (InstructorID, InstructorFirstName, InstructorLastName, InstructorFullName, InstructorEmail, InstructorPersonalEmail, InstructorLocation, InstructorPhoneNum, DepartmentID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `I${i.toString().padStart(3, '0')}`,
          faker.person.firstName(),
          faker.person.lastName(),
          faker.person.fullName(),
          faker.internet.email(),
          faker.internet.email(),
          faker.location.streetAddress(),
          faker.phone.number('###########').slice(0, 15),
          `D${faker.number.int({ min: 1, max: 50 }).toString().padStart(3, '0')}`,
        ]
      );
    }

    // Seed `course`
    console.log('Seeding `course`...');
    for (let i = 1; i <= 50; i++) {
      await executeQuery(
        `INSERT INTO course (CourseCode, CourseTitle, DepartmentID, Credits, CourseDescription) VALUES (?, ?, ?, ?, ?)`,
        [
          `C${i.toString().padStart(3, '0')}`,
          faker.lorem.words(3),
          `D${faker.number.int({ min: 1, max: 50 }).toString().padStart(3, '0')}`,
          faker.number.float({ min: 1, max: 5, precision: 0.5 }),
          faker.lorem.sentence(),
        ]
      );
    }

    // Seed `student`
    console.log('Seeding `student`...');
    for (let i = 1; i <= 50; i++) {
      await executeQuery(
        `INSERT INTO student (StudentID, StudentFirstName, StudentLastName, StudentFullName, StudentEmail, StudentPersonalEmail, DepartmentID, TotalCredits, GPA, StudentPhoneNumber, Advisor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `S${i.toString().padStart(3, '0')}`,
          faker.person.firstName().slice(0, 20),
          faker.person.lastName().slice(0, 20),
          faker.person.fullName().slice(0, 20)  ,
          faker.internet.email(),
          faker.internet.email(),
          `D${faker.number.int({ min: 1, max: 50 }).toString().padStart(3, '0')}`,
          faker.number.float({ min: 0, max: 20, precision: 0.1 }),
          faker.number.float({ min: 0, max: 4, precision: 0.01 }),
          faker.phone.number('###########').slice(0, 15),
          `I${faker.number.int({ min: 1, max: 50 }).toString().padStart(3, '0')}`,
        ]
      );
    }

    // Seed `user`
    console.log('Seeding `user`...');
    const students = await executeQuery(`SELECT StudentID, StudentEmail FROM student`);
    const instructors = await executeQuery(`SELECT InstructorID, InstructorEmail FROM instructor`);
    

    // Create users for students
    for (const { StudentID, StudentEmail } of students) {
        const hashedPassword = await bcrypt.hash('password123', 10); 
        await executeQuery(
        `INSERT INTO User (email, password, role, studentId, instructorId) VALUES (?, ?, ?, ?, ?)`,
        [StudentEmail, hashedPassword, 'STUDENT', StudentID, null]
        );
    }
    
    // Create users for instructors
    for (const { InstructorID, InstructorEmail } of instructors) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await executeQuery(
        `INSERT INTO User (email, password, role, studentId, instructorId) VALUES (?, ?, ?, ?, ?)`,
        [InstructorEmail, hashedPassword, 'INSTRUCTOR', null, InstructorID]
        );
    }

    // Seed `course_schedules`
    console.log('Seeding `course_schedules`...');
    const courses = await executeQuery(`SELECT CourseCode FROM course`);
    const instructorsForSchedules = await executeQuery(`SELECT InstructorID FROM instructor`);
    for (let i = 1; i <= 50; i++) {
    await executeQuery(
        `INSERT INTO course_schedules (CRN, CourseCode, Day, ClassStartTime, ClassEndTime, InstructorID, Term, Year, TeachingMethod, Capacity, Enrolled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
        `CRN${i.toString().padStart(3, '0')}`,
        courses[i % courses.length]?.CourseCode || `C${i.toString().padStart(3, '0')}`,
        faker.helpers.arrayElement(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
        faker.date.soon(),
        faker.date.soon(),
        instructorsForSchedules[i % instructorsForSchedules.length]?.InstructorID,
        faker.helpers.arrayElement(['Fall', 'Spring', 'Summer']),
        2024,
        faker.helpers.arrayElement(['Online', 'InPerson', 'Hybrid']),
        faker.number.int({ min: 10, max: 50 }),
        faker.number.int({ min: 0, max: 50 }),
        ]
    );
    }

    // Seed `enrollment`
    console.log('Seeding `enrollment`...');
    const studentsForEnrollment = await executeQuery(`SELECT StudentID FROM student`);
    const courseSchedules = await executeQuery(`SELECT CRN FROM course_schedules`);
    for (let i = 1; i <= 50; i++) {
    const studentId = studentsForEnrollment[i % studentsForEnrollment.length]?.StudentID;
    const crn = courseSchedules[i % courseSchedules.length]?.CRN;
    if (studentId && crn) {
        await executeQuery(
        `INSERT INTO enrollment (StudentID, CRN, EnrollmentDate, EnrollmentApprovalDate) VALUES (?, ?, ?, ?)`,
        [studentId, crn, faker.date.past(), faker.date.recent()]
        );
    }
    }

    // Seed `attendance`
    console.log('Seeding `attendance`...');
    for (let i = 1; i <= 50; i++) {
    const studentId = studentsForEnrollment[i % studentsForEnrollment.length]?.StudentID;
    const crn = courseSchedules[i % courseSchedules.length]?.CRN;
    if (studentId && crn) {
        await executeQuery(
        `INSERT INTO attendance (StudentID, CRN, Date, Status) VALUES (?, ?, ?, ?)`,
        [studentId, crn, faker.date.past(), faker.helpers.arrayElement(['Present', 'Absent', 'Late'])]
        );
    }
    }

    // Seed `exams`
    console.log('Seeding `exams`...');
    for (let i = 1; i <= 50; i++) {
    const crn = courseSchedules[i % courseSchedules.length]?.CRN;
    if (crn) {
        await executeQuery(
        `INSERT INTO exams (CRN, ExamStartTime, ExamEndTime, ExamLocation) VALUES (?, ?, ?, ?)`,
        [crn, faker.date.soon(), faker.date.soon(), `Room ${faker.number.int({ min: 100, max: 500 })}`]
        );
    }
    }

    // Seed `in_term_grades`
    console.log('Seeding `in_term_grades`...');
    for (let i = 1; i <= 50; i++) {
    const studentId = studentsForEnrollment[i % studentsForEnrollment.length]?.StudentID;
    const crn = courseSchedules[i % courseSchedules.length]?.CRN;
    if (studentId && crn) {
        await executeQuery(
        `INSERT INTO in_term_grades (StudentID, CRN, GradeName, GradePercentage, GradeDescription) VALUES (?, ?, ?, ?, ?)`,
        [
            studentId,
            crn,
            faker.lorem.words(2),
            faker.number.float({ min: 0, max: 100, precision: 0.01 }),
            faker.lorem.sentence(),
        ]
        );
    }
    }

    // Seed `end_of_term_grades`
    console.log('Seeding `end_of_term_grades`...');
    for (let i = 1; i <= 50; i++) {
    const studentId = studentsForEnrollment[i % studentsForEnrollment.length]?.StudentID;
    const crn = courseSchedules[i % courseSchedules.length]?.CRN;
    if (studentId && crn) {
        await executeQuery(
        `INSERT INTO end_of_term_grades (StudentID, CRN, LetterGrade, GradeOutOf100) VALUES (?, ?, ?, ?)`,
        [
            studentId,
            crn,
            faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'F']),
            faker.number.float({ min: 50, max: 100, precision: 0.1 }),
        ]
        );
    }
    }

  

    console.log('Seeding complete!');
    await connection.end();
  } catch (error) {
    console.error('An error occurred during seeding:', error.message || error);
  }
})();
