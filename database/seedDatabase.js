const { pool } = require('../src/lib/db');
const faker = require('@faker-js/faker').faker;

const buildings = [
  { code: 'ENGB', name: 'Engineering Building'},
  { code: 'SCIB', name: 'Science and Research Center'},
  { code: 'BUSB', name: 'Business and Economics Hall'},
  { code: 'HUMB', name: 'Humanities and Social Sciences Building'},
  { code: 'LAWB', name: 'Law and Legal Studies Center'},
  { code: 'HLTB', name: 'Health Sciences Complex'},
  { code: 'ARTB', name: 'Art and Design Pavilion'},
  { code: 'LIB', name: 'Library and Information Center'},
  { code: 'STU', name: 'Student Union Building'},
  { code: 'ATH', name: 'Athletics and Recreation Complex'},
  { code: 'ADM', name: 'Administration Building'},
];

const departmentsWithBuildings = [
  { code: 'D001', name: 'Computer Science', buildingCode: 'ENGB', abbreviation: 'CS' },
  { code: 'D002', name: 'Mechanical Engineering', buildingCode: 'ENGB', abbreviation: 'ME' },
  { code: 'D003', name: 'Electrical Engineering', buildingCode: 'ENGB', abbreviation: 'EE' },
  { code: 'D004', name: 'Civil Engineering', buildingCode: 'ENGB', abbreviation: 'CE' },
  { code: 'D005', name: 'Mathematics', buildingCode: 'SCIB', abbreviation: 'MATH' },
  { code: 'D006', name: 'Physics', buildingCode: 'SCIB', abbreviation: 'PHYS' },
  { code: 'D007', name: 'Chemistry', buildingCode: 'SCIB', abbreviation: 'CHEM' },
  { code: 'D008', name: 'Biology', buildingCode: 'SCIB', abbreviation: 'BIO' },
  { code: 'D009', name: 'Environmental Science', buildingCode: 'SCIB', abbreviation: 'ENV' },
  { code: 'D010', name: 'Economics', buildingCode: 'BUSB', abbreviation: 'ECON' },
  { code: 'D011', name: 'Business Administration', buildingCode: 'BUSB', abbreviation: 'BUS' },
  { code: 'D012', name: 'English Literature', buildingCode: 'HUMB', abbreviation: 'ENG' },
  { code: 'D013', name: 'History', buildingCode: 'HUMB', abbreviation: 'HIST' },
  { code: 'D014', name: 'Sociology', buildingCode: 'HUMB', abbreviation: 'SOC' },
  { code: 'D015', name: 'Philosophy', buildingCode: 'HUMB', abbreviation: 'PHIL' },
  { code: 'D016', name: 'Law', buildingCode: 'LAWB', abbreviation: 'LAW' },
  { code: 'D017', name: 'Medicine', buildingCode: 'HLTB', abbreviation: 'MED' },
  { code: 'D018', name: 'Nursing', buildingCode: 'HLTB', abbreviation: 'NUR' },
  { code: 'D019', name: 'Art and Design', buildingCode: 'ARTB', abbreviation: 'ART' },
  { code: 'D020', name: 'Music', buildingCode: 'ARTB', abbreviation: 'MUS' },
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
        `INSERT INTO building (BuildingCode, BuildingName) VALUES (?, ?)`,
        [building.code, building.name]
      );
    }

    // Seed `department`
    console.log('Seeding `department`...');
    for (const department of departmentsWithBuildings) {
      const building = await executeQuery(
        `SELECT BuildingID FROM building WHERE BuildingCode = ?`,
        [department.buildingCode]
      );

      if (building.length > 0) {
        const buildingId = building[0].BuildingID;

        await executeQuery(
          `INSERT INTO department (DepartmentCode, DepartmentName, BuildingID, Abbreviation) VALUES (?, ?, ?, ?)`,
          [department.code, department.name, buildingId, department.abbreviation]
        );
      } else {
        console.error(`BuildingCode ${department.buildingCode} not found for department ${department.name}`);
      }
    }

    // Seed `instructor`
    console.log('Seeding `instructor` and `user`...');
    const departments = await executeQuery(
      `SELECT d.DepartmentID, b.BuildingCode 
      FROM department d
      JOIN building b ON d.BuildingID = b.BuildingID
    `);
    for (let i = 1; i <= 50; i++) {
      const department = faker.helpers.arrayElement(departments);
    
      const firstName = faker.person.firstName().slice(0, 20);
      const middleName = faker.helpers.maybe(() => faker.person.firstName().slice(0, 20), { probability: 0.5 });
      const lastName = faker.person.lastName().slice(0, 20);
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

      const phoneNumber = faker.phone.number('(###) ###-####').slice(0, 15);
      const emailDomain = 'example.com';

      const result = await executeQuery(
        `INSERT INTO instructor (InstructorFirstName, InstructorLastName, InstructorFullName, InstructorEmail, InstructorPersonalEmail, InstructorPhoto, WebsiteLink, InstructorLocation, InstructorPhoneNum, DepartmentID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          firstName,
          lastName,
          fullName,
          `${lastName.toLowerCase()}-i${i.toString().padStart(3, '0')}@${emailDomain}`,
          `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}`,
          faker.image.dataUri(),
          `https://www.${lastName.toLowerCase()}${i}.edu`,
          `${department.BuildingCode} Room ${faker.number.int({ min: 100, max: 400 })}`,
          phoneNumber,
          department.DepartmentID,
        ]
      );
    
      const instructorId = result.insertId;
      const email = `${lastName.toLowerCase()}${instructorId}@${emailDomain}`;
    
      await executeQuery(
        `UPDATE instructor SET InstructorEmail = ? WHERE InstructorID = ?`,
        [email, instructorId]
      );
      await executeQuery(
        `UPDATE user SET Email = ? WHERE InstructorID = ?`,
        [email, instructorId]
      );
    }    

    // Seed `course`
    console.log('Seeding `course`...');
    const dbDepartments = await executeQuery(`SELECT DepartmentID, DepartmentCode FROM department`);
    for (const [departmentName, courses] of Object.entries(coursesByDepartment)) {
      const department = departmentsWithBuildings.find((d) => d.name === departmentName);
      if (department) {
        const dbDepartment = dbDepartments.find((d) => d.DepartmentCode === department.code);
        if (dbDepartment) {
          for (const course of courses) {
            const courseCode = course.split(' ')[0];
            const courseTitle = course.substring(course.indexOf(' ') + 1);
            await executeQuery(
              `INSERT INTO course (CourseCode, CourseTitle, DepartmentID, Credits, CourseDescription) 
              VALUES (?, ?, ?, ?, ?)`,
              [
                courseCode,
                courseTitle,
                dbDepartment.DepartmentID,
                faker.number.int({ min: 4, max: 6 }) / 2,
                faker.lorem.sentence(),
              ]
            );
          }
        }
      }
    }

    // Seed `student`
    console.log('Seeding `student` and `user`...');
    const advisors = await executeQuery(`SELECT InstructorID FROM instructor`);

    for (let i = 1; i <= 200; i++) {
      const department = faker.helpers.arrayElement(departments);
      const advisor = faker.helpers.arrayElement(advisors);

      const firstName = faker.person.firstName().slice(0, 20);
      const middleName = faker.helpers.maybe(() => faker.person.firstName().slice(0, 20), { probability: 0.5 });
      const lastName = faker.person.lastName().slice(0, 20);
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

      const phoneNumber = faker.phone.number('(###) ###-####').slice(0, 15);
      const emailDomain = 'example.com';

      const totalCreditsRanges = [
        { min: 0, max: 3.5, grade: '1' },
        { min: 4, max: 7.5, grade: '2' },
        { min: 8, max: 11.5, grade: '3' },
        { min: 12, max: 16, grade: '4' },
      ];
      const selectedRange = faker.helpers.arrayElement(totalCreditsRanges);
      const totalCredits = faker.number.int({ min: selectedRange.min*2, max: selectedRange.max*2 }) / 2;
      const grade = selectedRange.grade;

      const result = await executeQuery(
        `INSERT INTO student (StudentFirstName, StudentLastName, StudentFullName, StudentEmail, StudentPersonalEmail, DepartmentID, Grade, TotalCredits, GPA, StudentPhoto, StudentPhoneNumber, Advisor) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          firstName,
          lastName,
          fullName,
          `${lastName.toLowerCase()}-s${i.toString().padStart(3, '0')}@${emailDomain}`,
          `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}`,
          department.DepartmentID,
          grade,
          totalCredits,
          faker.number.float({ min: 1.5, max: 4, precision: 0.01 }),
          faker.image.dataUri(),
          phoneNumber,
          advisor.InstructorID,
        ]
      );

      const studentId = result.insertId;
      const email = `${lastName.toLowerCase()}${studentId}@${emailDomain}`;
    
      await executeQuery(
        `UPDATE student SET StudentEmail = ? WHERE StudentID = ?`,
        [email, studentId]
      );
      await executeQuery(
        `UPDATE user SET Email = ? WHERE StudentID = ?`,
        [email, studentId]
      );
    }

    // Seed `admin`
    console.log('Seeding `admin` and `user`...');
    for (let i = 1; i <= 6; i++) {
      const firstName = faker.person.firstName().slice(0, 20);
      const middleName = faker.helpers.maybe(() => faker.person.firstName().slice(0, 20), { probability: 0.5 });
      const lastName = faker.person.lastName().slice(0, 20);
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

      const phoneNumber = faker.phone.number('(###) ###-####').slice(0, 15);
      const emailDomain = 'example.com';

      const result = await executeQuery(
        `INSERT INTO admin (AdminFirstName, AdminLastName, AdminFullName, AdminEmail, AdminPhoneNumber, AdminPhoto) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          firstName,
          lastName,
          fullName,
          `${lastName.toLowerCase()}-a${i.toString().padStart(3, '0')}@${emailDomain}`,
          phoneNumber,
          faker.image.dataUri(),
        ]
      );
    
      const adminId = result.insertId;
    
      const email = `${lastName.toLowerCase()}${adminId}@${emailDomain}`;

      await executeQuery(
        `UPDATE admin SET AdminEmail = ? WHERE AdminID = ?`,
        [email, adminId]
      );
      await executeQuery(
        `UPDATE user SET Email = ? WHERE AdminID = ?`,
        [email, adminId]
      );
    }

    // Seed `course_schedules`
    console.log('Seeding `course_schedules`...');
    const courses = await executeQuery(`
      SELECT c.CourseID, c.DepartmentID 
      FROM course c
    `);

    const instructors = await executeQuery(`
      SELECT i.InstructorID, i.DepartmentID 
      FROM instructor i
    `);

    const buildingOfDepartment = await executeQuery(`
      SELECT d.DepartmentID, b.BuildingCode 
      FROM department d 
      JOIN building b ON d.BuildingID = b.BuildingID
    `);

    const availableTimes = ["08:30:00", "09:30:00", "10:30:00", "11:30:00", "12:30:00", "13:30:00", "14:30:00", "15:30:00",];

    for (let i = 1; i <= 50; i++) {
      const selectedCourse = faker.helpers.arrayElement(courses);

      const eligibleInstructors = instructors.filter(
        (instructor) => instructor.DepartmentID === selectedCourse.DepartmentID
      );

      if (eligibleInstructors.length === 0) continue;

      const selectedInstructor = faker.helpers.arrayElement(eligibleInstructors);

      const capacity = faker.number.int({ min: 10, max: 50 });
      const enrolled = faker.number.int({ min: 0, max: capacity });

      const startTime = faker.helpers.arrayElement(availableTimes);
      const endTime = new Date(`1970-01-01T${startTime}`);
      endTime.setHours(endTime.getHours() + 2);
      const formattedEndTime = endTime.toTimeString().slice(0, 8);

      const teachingMethod = faker.helpers.arrayElement(['Online', 'InPerson', 'Hybrid']);

      let location = null;
      if (teachingMethod !== 'Online') {
        const departmentBuilding = buildingOfDepartment.find(
          (d) => d.DepartmentID === selectedCourse.DepartmentID
        );
        if (departmentBuilding) {
          location = `${departmentBuilding.BuildingCode} Class ${faker.number.int({ min: 100, max: 400 })}`;
        }
      }

      await executeQuery(
        `INSERT INTO course_schedules (CRN, CourseID, Day, ClassStartTime, ClassEndTime, InstructorID, Term, Year, TeachingMethod, Capacity, Enrolled, Location) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `CRN${i.toString().padStart(3, '0')}`,
          selectedCourse.CourseID,
          faker.helpers.arrayElement(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
          startTime,
          formattedEndTime,
          selectedInstructor.InstructorID,
          faker.helpers.arrayElement(['Fall', 'Spring', 'Summer']),
          2024,
          teachingMethod,
          capacity,
          enrolled,
          location,
        ]
      );
    }   

    // Seed `enrollment`
    console.log('Seeding `enrollment`...');
    const studentsForEnrollment = await executeQuery(`
      SELECT StudentID, DepartmentID 
      FROM student
    `);

    const courseSchedules = await executeQuery(`
      SELECT cs.CRN, c.DepartmentID 
      FROM course_schedules cs
      JOIN course c ON cs.CourseID = c.CourseID
    `);

    for (const student of studentsForEnrollment) {
      const eligibleCourses = courseSchedules.filter(
        (course) => course.DepartmentID === student.DepartmentID
      );
      if (eligibleCourses.length === 0) continue;
      const selectedCourses = eligibleCourses.slice(0, Math.min(eligibleCourses.length, 3));

      const approvalDate = new Date('2024-09-29');

      for (const course of selectedCourses) {
        const enrollmentDate = faker.date.between({
          from: new Date('2024-09-16'),
          to: new Date('2024-09-27'),
        });

        await executeQuery(
          `INSERT INTO enrollment (StudentID, CRN, EnrollmentDate, EnrollmentApprovalDate) VALUES (?, ?, ?, ?)`,
          [
            student.StudentID,
            course.CRN,
            enrollmentDate,
            approvalDate,
          ]
        );
      }
    }

    // Seed `attendance`
    console.log('Seeding `attendance`...');
    const enrollments = await executeQuery(`
      SELECT StudentID, CRN
      FROM enrollment
    `);

    const weeks = Array.from({ length: 14 }, (_, i) => i + 1);

    for (const enrollment of enrollments) {
      const { StudentID, CRN } = enrollment;

      for (const week of weeks) {
        await executeQuery(
          `INSERT INTO attendance (StudentID, CRN, Week, Status) VALUES (?, ?, ?, ?)`,
          [
            StudentID,
            CRN,
            week,
            faker.helpers.arrayElement(['Present', 'Absent', 'Late']),
          ]
        );
      }
    }

    // Seed `exams`
    console.log('Seeding `exams`...');

    const courseDetails = await executeQuery(`
      SELECT CRN, Location, Day, ClassStartTime, TeachingMethod
      FROM course_schedules
    `);

    const examDetails = [
      { name: 'Quiz1', type: 'Quiz', offsetWeeks: 3 },
      { name: 'Quiz2', type: 'Quiz', offsetWeeks: 5 },
      { name: 'Midterm1', type: 'Midterm', offsetWeeks: 7 },
      { name: 'Quiz3', type: 'Quiz', offsetWeeks: 9 },
      { name: 'Midterm2', type: 'Midterm', offsetWeeks: 11 },
      { name: 'Quiz4', type: 'Quiz', offsetWeeks: 13 },
      { name: 'Final', type: 'Final', offsetWeeks: 15 },
    ];

    const startDate = new Date('2024-09-30');

    for (const { CRN, Location, Day, ClassStartTime, TeachingMethod } of courseDetails) {
      const isOnline = TeachingMethod === 'Online';

      const examLocation = isOnline ? 'Online' : Location;
      if (!examLocation && !isOnline) {
        console.warn(`Skipping CRN: ${CRN} due to missing location`);
        continue;
      }

      const quizStartTime = new Date(`1970-01-01T${ClassStartTime || '08:30:00'}`);
      const quizEndTime = new Date(quizStartTime);
      quizEndTime.setMinutes(quizEndTime.getMinutes() + 30);

      for (const { name, type, offsetWeeks } of examDetails) {
        const examDate = new Date(startDate);
        examDate.setDate(
          examDate.getDate() +
            (offsetWeeks - 1) * 7 +
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(Day)
        );

        const startTime = type === 'Quiz' ? quizStartTime.toTimeString().slice(0, 8) : '18:00:00';
        const endTime = type === 'Quiz' ? quizEndTime.toTimeString().slice(0, 8) : '20:00:00';

        try {
          await executeQuery(
            `INSERT INTO exams (CRN, ExamName, ExamDate, ExamStartTime, ExamEndTime, ExamLocation) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
              CRN,
              name,
              examDate.toISOString().split('T')[0],
              startTime,
              endTime,
              examLocation,
            ]
          );
        } catch (error) {
          console.error(`Failed to insert exam for CRN: ${CRN}, Exam: ${name}. Error: ${error.message}`);
        }
      }
    }

    // Seed `in_term_grades`
    console.log('Seeding `in_term_grades`...');
    const exams = [
      { name: 'Midterm1', percentage: 20 },
      { name: 'Midterm2', percentage: 20 },
      { name: 'Quiz1', percentage: 5 },
      { name: 'Quiz2', percentage: 5 },
      { name: 'Quiz3', percentage: 5 },
      { name: 'Quiz4', percentage: 5 },
      { name: 'Final', percentage: 40 },
    ];

    const enrollment = await executeQuery(`SELECT StudentID, CRN FROM enrollment`);

    for (const { StudentID, CRN } of enrollment) {
      for (const exam of exams) {
        const gradeValue = faker.number.int({ min: 0, max: 200 }) / 2;

        await executeQuery(
          `INSERT INTO in_term_grades (StudentID, CRN, GradeName, GradeValue, GradePercentage, GradeDescription) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            StudentID,
            CRN,
            exam.name,
            gradeValue,
            exam.percentage,
            `${exam.name} Score: ${gradeValue}, Weight: ${exam.percentage}%`,
          ]
        );
      }
    }

    // Seed `end_of_term_grades`
    console.log('Seeding `end_of_term_grades`...');

    const aggregatedGrades = await executeQuery(`
      SELECT StudentID, CRN, SUM(GradeValue * (GradePercentage / 100)) AS TotalGrade 
      FROM in_term_grades 
      GROUP BY StudentID, CRN
    `);

    const getLetterGrade = (grade) => {
      if (grade >= 90) return 'AA';
      if (grade >= 80) return 'BA';
      if (grade >= 70) return 'BB';
      if (grade >= 60) return 'CB';
      if (grade >= 50) return 'CC';
      if (grade >= 45) return 'DC';
      if (grade >= 40) return 'DD';
      return 'FF';
    };

    for (const { StudentID, CRN, TotalGrade } of aggregatedGrades) {
      const gradeOutOf100 = parseFloat(TotalGrade);
      const letterGrade = getLetterGrade(gradeOutOf100);

      await executeQuery(
        `INSERT INTO end_of_term_grades (StudentID, CRN, LetterGrade, GradeOutOf100) VALUES (?, ?, ?, ?)`,
        [
          StudentID,
          CRN,
          letterGrade,
          gradeOutOf100,
        ]
      );
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
