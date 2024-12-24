const { pool } = require('../src/lib/db');
const faker = require('@faker-js/faker').faker;
const bcrypt = require('bcrypt');

const buildings = [
  { id: 'B001', name: 'Engineering Building', abbreviation: 'ENG' },
  { id: 'B002', name: 'Science and Research Center', abbreviation: 'SCI' },
  { id: 'B003', name: 'Business and Economics Hall', abbreviation: 'BUS' },
  { id: 'B004', name: 'Humanities and Social Sciences Building', abbreviation: 'HUM' },
  { id: 'B005', name: 'Law and Legal Studies Center', abbreviation: 'LAW' },
  { id: 'B006', name: 'Health Sciences Complex', abbreviation: 'HLT' },
  { id: 'B007', name: 'Art and Design Pavilion', abbreviation: 'ART' },
  { id: 'B008', name: 'Library and Information Center', abbreviation: 'LIB' },
  { id: 'B009', name: 'Student Union Building', abbreviation: 'STU' },
  { id: 'B010', name: 'Athletics and Recreation Complex', abbreviation: 'ATH' },
  { id: 'B011', name: 'Administration Building', abbreviation: 'ADM' },
];

const departmentsWithBuildings = [
  { id: 'D001', name: 'Computer Science', buildingId: 'B001', abbreviation: 'CS' },
  { id: 'D002', name: 'Mechanical Engineering', buildingId: 'B001', abbreviation: 'ME' },
  { id: 'D003', name: 'Electrical Engineering', buildingId: 'B001', abbreviation: 'EE' },
  { id: 'D004', name: 'Civil Engineering', buildingId: 'B001', abbreviation: 'CE' },
  { id: 'D005', name: 'Mathematics', buildingId: 'B002', abbreviation: 'MATH' },
  { id: 'D006', name: 'Physics', buildingId: 'B002', abbreviation: 'PHYS' },
  { id: 'D007', name: 'Chemistry', buildingId: 'B002', abbreviation: 'CHEM' },
  { id: 'D008', name: 'Biology', buildingId: 'B002', abbreviation: 'BIO' },
  { id: 'D009', name: 'Environmental Science', buildingId: 'B002', abbreviation: 'ENV' },
  { id: 'D010', name: 'Economics', buildingId: 'B003', abbreviation: 'ECON' },
  { id: 'D011', name: 'Business Administration', buildingId: 'B003', abbreviation: 'BUS' },
  { id: 'D012', name: 'English Literature', buildingId: 'B004', abbreviation: 'ENG' },
  { id: 'D013', name: 'History', buildingId: 'B004', abbreviation: 'HIST' },
  { id: 'D014', name: 'Sociology', buildingId: 'B004', abbreviation: 'SOC' },
  { id: 'D015', name: 'Philosophy', buildingId: 'B004', abbreviation: 'PHIL' },
  { id: 'D016', name: 'Law', buildingId: 'B005', abbreviation: 'LAW' },
  { id: 'D017', name: 'Medicine', buildingId: 'B006', abbreviation: 'MED' },
  { id: 'D018', name: 'Nursing', buildingId: 'B006', abbreviation: 'NUR' },
  { id: 'D019', name: 'Art and Design', buildingId: 'B007', abbreviation: 'ART' },
  { id: 'D020', name: 'Music', buildingId: 'B007', abbreviation: 'MUS' },
];

const coursesByDepartment = {
  'Computer Science': ['CS101 Data Structures', 'CS102 Algorithms', 'CS201 Operating Systems', 'CS301 Artificial Intelligence', 'CS302 Machine Learning'],
  'Mechanical Engineering': ['ME101 Thermodynamics', 'ME102 Fluid Mechanics', 'ME201 Mechanics of Materials', 'ME202 Heat Transfer', 'ME301 Control Systems'],
  'Electrical Engineering': ['EE101 Circuit Analysis', 'EE102 Electromagnetic Fields', 'EE201 Power Systems', 'EE202 Signal Processing', 'EE301 Microelectronics'],
  'Civil Engineering': ['CE101 Structural Analysis', 'CE102 Construction Materials', 'CE201 Geotechnical Engineering', 'CE202 Transportation Systems', 'CE301 Hydrology'],
  'Mathematics': ['MATH101 Linear Algebra', 'MATH102 Calculus I', 'MATH201 Calculus II', 'MATH202 Abstract Algebra', 'MATH301 Differential Equations'],
  'Physics': ['PHYS101 Classical Mechanics', 'PHYS102 Quantum Physics', 'PHYS201 Thermodynamics', 'PHYS202 Electrodynamics', 'PHYS301 Nuclear Physics'],
  'Chemistry': ['CHEM101 Organic Chemistry', 'CHEM102 Inorganic Chemistry', 'CHEM201 Analytical Chemistry', 'CHEM202 Physical Chemistry', 'CHEM301 Biochemistry'],
  'Biology': ['BIO101 Cell Biology', 'BIO102 Genetics', 'BIO201 Ecology', 'BIO202 Evolutionary Biology', 'BIO301 Microbiology'],
  'Economics': ['ECON101 Microeconomics', 'ECON102 Macroeconomics', 'ECON201 Econometrics', 'ECON202 Game Theory', 'ECON301 International Trade'],
  'Business Administration': ['BUS101 Principles of Management', 'BUS102 Marketing Strategies', 'BUS201 Business Ethics', 'BUS202 Entrepreneurship', 'BUS301 Organizational Behavior'],
  'English Literature': ['ENG101 Introduction to Poetry', 'ENG102 Shakespearean Drama', 'ENG201 Modern Fiction', 'ENG202 Victorian Literature', 'ENG301 Literary Theory'],
  'History': ['HIST101 World History', 'HIST102 Ancient Civilizations', 'HIST201 Medieval History', 'HIST202 Modern Europe', 'HIST301 American History'],
  'Sociology': ['SOC101 Introduction to Sociology', 'SOC102 Social Stratification', 'SOC201 Cultural Anthropology', 'SOC202 Urban Sociology', 'SOC301 Sociology of Education'],
  'Philosophy': ['PHIL101 Introduction to Philosophy', 'PHIL102 Ethics', 'PHIL201 Philosophy of Science', 'PHIL202 Logic', 'PHIL301 Political Philosophy'],
  'Law': ['LAW101 Introduction to Law', 'LAW102 Constitutional Law', 'LAW201 Criminal Law', 'LAW202 International Law', 'LAW301 Corporate Law'],
  'Medicine': ['MED101 Anatomy', 'MED102 Physiology', 'MED201 Pharmacology', 'MED202 Pathology', 'MED301 Clinical Medicine'],
  'Nursing': ['NUR101 Fundamentals of Nursing', 'NUR102 Pediatric Nursing', 'NUR201 Community Health Nursing', 'NUR202 Psychiatric Nursing', 'NUR301 Critical Care Nursing'],
  'Environmental Science': ['ENV101 Environmental Chemistry', 'ENV102 Ecological Principles', 'ENV201 Environmental Policy', 'ENV202 Climate Change Science', 'ENV301 Sustainable Development'],
  'Art and Design': ['ART101 Introduction to Design', 'ART102 Drawing and Sketching', 'ART201 Sculpture', 'ART202 Digital Art', 'ART301 Art History'],
  'Music': ['MUS101 Introduction to Music Theory', 'MUS102 History of Western Music', 'MUS201 Instrumental Performance', 'MUS202 Composition', 'MUS301 Conducting'],
};

(async function seedDatabase() {
  try {
    const executeQuery = async (query, values = []) => {
      const [rows] = await pool.query(query, values);
      return rows;
    };

    // Seed `building`
    console.log('Seeding `building`...');
    for (const building of buildings) {
      await executeQuery(
        `INSERT INTO building (BuildingID, BuildingName, BuildingCode) VALUES (?, ?, ?)`,
        [building.id, building.name, building.abbreviation]
      );
    }

    // Seed `department`
    console.log('Seeding `department`...');
    for (const department of departmentsWithBuildings) {
      await executeQuery(
        `INSERT INTO department (DepartmentID, DepartmentName, BuildingID, Abbreviation) VALUES (?, ?, ?, ?)`,
        [department.id, department.name, department.buildingId, department.abbreviation]
      );
    }

    // Seed `instructor`
    console.log('Seeding `instructor`...');
    const departments = await executeQuery(`SELECT DepartmentID FROM department`);
    for (let i = 1; i <= 50; i++) {
      const department = faker.helpers.arrayElement(departments);

      const firstName = faker.person.firstName().slice(0, 20);
      const middleName = faker.helpers.maybe(() => faker.person.firstName().slice(0, 20), { probability: 0.5 });
      const lastName = faker.person.lastName().slice(0, 20);

      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

      const phoneNumber = faker.phone.number('(###) ###-####').slice(0, 15);

      const emailDomain = 'example.com';
      const email = `${lastName.toLowerCase()}-i${i.toString().padStart(3, '0')}@${emailDomain}`;

      const personalEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}`;

      await executeQuery(
        `INSERT INTO instructor (InstructorID, InstructorFirstName, InstructorLastName, InstructorFullName, InstructorEmail, InstructorPersonalEmail, InstructorLocation, InstructorPhoneNum, DepartmentID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `I${i.toString().padStart(3, '0')}`,
          firstName,
          lastName,
          fullName,
          email,
          personalEmail,
          faker.location.streetAddress(),
          phoneNumber,
          department.DepartmentID,
        ]
      );
    }

    // Seed `course`
    console.log('Seeding `course`...');
    for (const [departmentName, courses] of Object.entries(coursesByDepartment)) {
      const department = departmentsWithBuildings.find((d) => d.name === departmentName);
      if (department) {
        for (const course of courses) {
          const courseCode = course.split(' ')[0];
          const courseTitle = course.substring(course.indexOf(' ') + 1);
          await executeQuery(
            `INSERT INTO course (CourseCode, CourseTitle, DepartmentID, Credits, CourseDescription) VALUES (?, ?, ?, ?, ?)`,
            [
              courseCode,
              courseTitle,
              department.id,
              faker.number.int({ min: 2, max: 6 }) / 2,
              faker.lorem.sentence(),
            ]
          );
        }
      }
    }

    // Seed `student`
    console.log('Seeding `student`...');
    const advisors = await executeQuery(`SELECT InstructorID FROM instructor`);

    for (let i = 1; i <= 50; i++) {
      const department = faker.helpers.arrayElement(departments);
      const advisor = faker.helpers.arrayElement(advisors);

      const firstName = faker.person.firstName().slice(0, 20);
      const middleName = faker.helpers.maybe(() => faker.person.firstName().slice(0, 20), { probability: 0.5 });
      const lastName = faker.person.lastName().slice(0, 20);

      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

      const phoneNumber = faker.phone.number('(###) ###-####').slice(0, 15);

      const emailDomain = 'example.com';
      const email = `${lastName.toLowerCase()}-s${i.toString().padStart(3, '0')}@${emailDomain}`;
      const personalEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}`;

      await executeQuery(
        `INSERT INTO student (StudentID, StudentFirstName, StudentLastName, StudentFullName, StudentEmail, StudentPersonalEmail, DepartmentID, Grade, TotalCredits, GPA, StudentPhoto, StudentPhoneNumber, Advisor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `S${i.toString().padStart(3, '0')}`,
          firstName,
          lastName,
          fullName,
          email,
          personalEmail,
          department.DepartmentID,
          faker.helpers.arrayElement(['1', '2', '3', '4']),
          faker.number.int({ min: 0, max: 40 }) / 2,
          faker.number.float({ min: 0, max: 4, precision: 0.5 }),
          faker.image.dataUri(),
          phoneNumber,
          advisor.InstructorID,
        ]
      );
    }

    // Seed `admin`
    console.log('Seeding `admin`...');
    for (let i = 1; i <= 6; i++) {
      const firstName = faker.person.firstName().slice(0, 20);
      const middleName = faker.helpers.maybe(() => faker.person.firstName().slice(0, 20), { probability: 0.5 });
      const lastName = faker.person.lastName().slice(0, 20);

      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

      const phoneNumber = faker.phone.number('(###) ###-####').slice(0, 15);

      const emailDomain = 'example.com';
      const email = `${lastName.toLowerCase()}-a${i.toString().padStart(3, '0')}@${emailDomain}`;

      await executeQuery(
        `INSERT INTO admin (AdminID, AdminFirstName, AdminLastName, AdminFullName, AdminEmail, AdminPhoneNumber) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          `A${i.toString().padStart(3, '0')}`,
          firstName,
          lastName,
          fullName,
          email,
          phoneNumber,
        ]
      );
    }

    // Seed `user`
    console.log('Seeding `user`...');
    const students = await executeQuery(`SELECT StudentID, StudentEmail FROM student`);
    const instructors = await executeQuery(`SELECT InstructorID, InstructorEmail FROM instructor`);
    const admins = await executeQuery(`SELECT AdminID, AdminEmail FROM admin`);

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

    // Create users for admins
    for (const { AdminID, AdminEmail } of admins) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await executeQuery(
        `INSERT INTO user (email, password, role, adminId) VALUES (?, ?, ?, ?)`,
        [AdminEmail, hashedPassword, 'ADMIN', AdminID]
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

    // Fetch all unique CRNs and enrolled students
    const distinctCRNs = await executeQuery(`SELECT DISTINCT CRN FROM course_schedules`);
    const enrollment = await executeQuery(`SELECT StudentID, CRN FROM enrollment`);

    // Precompute grade details for each CRN
    const gradesByCRN = {};
    for (const { CRN } of distinctCRNs) {
      const gradeName = faker.helpers.arrayElement(['Midterm1', 'Midterm2', 'Quiz1', 'Quiz2', 'Quiz3', 'Quiz4', 'Final']);
      const gradeValue = faker.number.int({ min: 0, max: 200 }) / 2; ;
      const gradePercentage = faker.number.int({ min: 2, max: 120 }) / 2;
      const gradeComponentsCount = faker.number.int({ min: 2, max: 5 });
      let remainingValue = gradeValue;
      const gradeComponents = [];

      for (let j = 1; j <= gradeComponentsCount; j++) {
        const value = j === gradeComponentsCount
          ? remainingValue
          : faker.number.float({ min: 0, max: remainingValue, precision: 0.1 });
        gradeComponents.push(`Q${j}:${value.toFixed(1)}`);
        remainingValue -= value;
      }

      const gradeDescription = gradeComponents.join(', ');

      gradesByCRN[CRN] = {
        gradeName,
        gradeValue: gradeValue.toFixed(1),
        gradePercentage: gradePercentage.toFixed(2),
        gradeDescription,
      };
    }

    // Assign grades to students for their CRNs
    for (const { StudentID, CRN } of enrollment) {
      if (gradesByCRN[CRN]) {
        const { gradeName, gradeValue, gradePercentage, gradeDescription } = gradesByCRN[CRN];
        await executeQuery(
          `INSERT INTO in_term_grades (StudentID, CRN, GradeName, GradeValue, GradePercentage, GradeDescription) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            StudentID,
            CRN,
            gradeName,
            gradeValue,
            gradePercentage,
            gradeDescription,
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
            faker.helpers.arrayElement(['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FF']),
            faker.number.float({ min: 50, max: 100, precision: 0.1 }),
        ]
        );
    }
    }

    // Seed `notification`
    console.log('Seeding `notification`...');
    for (let i = 1; i <= 20; i++) {
      const type = faker.helpers.arrayElement(['GRADE', 'ANNOUNCEMENT', 'EVENT', 'EXAM']);
      const priority =
        type === 'EXAM'
          ? 'HIGH'
          : type === 'GRADE'
          ? 'MEDIUM'
          : faker.helpers.arrayElement(['LOW', 'MEDIUM', 'HIGH']);

      await executeQuery(
        `INSERT INTO notification (Title, Message, Type, Priority) VALUES (?, ?, ?, ?)`,
        [
          faker.lorem.words(5),
          faker.lorem.paragraph(),
          type,
          priority,
        ]
      );
    }

    // Seed `user_notification`
    console.log('Seeding `user_notification`...');
    const notifications = await executeQuery(`SELECT NotificationID FROM notification`);
    const users = await executeQuery(`SELECT ID FROM user`);
    for (let i = 1; i <= 50; i++) {
      const userId = users[i % users.length]?.ID;
      const notificationId = notifications[i % notifications.length]?.NotificationID;
      if (userId && notificationId) {
        const isRead = faker.helpers.arrayElement([0, 1]);
        const readAt = isRead === 1 ? faker.date.recent() : null;
        await executeQuery(
          `INSERT INTO user_notification (NotificationID, UserID, IsRead, ReadAt) VALUES (?, ?, ?, ?)`,
          [
            notificationId,
            userId,
            isRead,
            readAt,
          ]
        );
      }
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('An error occurred during seeding:', error.message || error);
  } finally {
    await pool.end();
  }
})();
