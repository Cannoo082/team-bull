const { pool } = require('../src/lib/db');
const faker = require('@faker-js/faker').faker;
const { shuffle } = faker.helpers;

const hashedPassword = '$2b$10$THBe7V4iuIDKWLvEC4DENOvKKRhhTiPltsLrvUl4oR5HR5Jebv1Vi'

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
  'Computer Science': [
    'CS101 Introduction to Programming', 'CS102 Data Structures', 'CS103 Computer Organization', 'CS104 Discrete Mathematics', 'CS105 Programming Fundamentals',
    'CS201 Algorithms', 'CS202 Operating Systems', 'CS203 Database Systems', 'CS204 Software Engineering', 'CS205 Mobile App Development',
    'CS301 Artificial Intelligence', 'CS302 Machine Learning', 'CS303 Computer Networks', 'CS304 Web Development', 'CS305 Big Data Analytics',
    'CS401 Advanced Algorithms', 'CS402 Cybersecurity', 'CS403 Cloud Computing', 'CS404 Blockchain Technology', 'CS405 Natural Language Processing'
  ],
  'Mechanical Engineering': [
    'ME101 Engineering Drawing', 'ME102 Mechanics', 'ME103 Thermodynamics', 'ME104 Materials Science', 'ME105 Introduction to Engineering',
    'ME201 Fluid Mechanics', 'ME202 Heat Transfer', 'ME203 Dynamics of Machines', 'ME204 Manufacturing Processes', 'ME205 Mechanical Design',
    'ME301 Control Systems', 'ME302 Mechanical Vibrations', 'ME303 Finite Element Analysis', 'ME304 Renewable Energy', 'ME305 Robotics Fundamentals',
    'ME401 Advanced Robotics', 'ME402 HVAC Systems', 'ME403 Automotive Engineering', 'ME404 Mechatronics', 'ME405 Aerospace Engineering'
  ],
  'Electrical Engineering': [
    'EE101 Circuit Analysis', 'EE102 Digital Logic Design', 'EE103 Electromagnetic Fields', 'EE104 Introduction to Power Systems', 'EE105 Electrical Engineering Basics',
    'EE201 Analog Electronics', 'EE202 Signal Processing', 'EE203 Control Systems', 'EE204 Microcontrollers', 'EE205 Digital Circuits',
    'EE301 Digital Communication', 'EE302 Power Electronics', 'EE303 Embedded Systems', 'EE304 Wireless Networks', 'EE305 Machine Learning for Engineers',
    'EE401 Renewable Energy Systems', 'EE402 Smart Grids', 'EE403 Advanced Signal Processing', 'EE404 IoT Systems', 'EE405 Quantum Computing'
  ],
  'Civil Engineering': [
    'CE101 Introduction to Civil Engineering', 'CE102 Structural Mechanics', 'CE103 Surveying', 'CE104 Geology for Engineers', 'CE105 Hydraulics',
    'CE201 Construction Materials', 'CE202 Fluid Mechanics', 'CE203 Soil Mechanics', 'CE204 Transportation Engineering', 'CE205 Foundation Engineering',
    'CE301 Reinforced Concrete Design', 'CE302 Steel Structures', 'CE303 Environmental Engineering', 'CE304 Hydrology', 'CE305 Advanced Construction Techniques',
    'CE401 Advanced Structural Analysis', 'CE402 Bridge Engineering', 'CE403 Urban Planning', 'CE404 Construction Management', 'CE405 Disaster Management'
  ],
  'Mathematics': [
    'MATH101 Linear Algebra', 'MATH102 Calculus I', 'MATH103 Discrete Mathematics', 'MATH104 Probability and Statistics', 'MATH105 Computational Mathematics',
    'MATH201 Calculus II', 'MATH202 Abstract Algebra', 'MATH203 Differential Equations', 'MATH204 Complex Analysis', 'MATH205 Numerical Analysis',
    'MATH301 Real Analysis', 'MATH302 Numerical Methods', 'MATH303 Mathematical Modeling', 'MATH304 Graph Theory', 'MATH305 Optimization',
    'MATH401 Topology', 'MATH402 Functional Analysis', 'MATH403 Game Theory', 'MATH404 Advanced Probability', 'MATH405 Algebraic Geometry'
  ],
  'Physics': [
    'PHYS101 Classical Mechanics', 'PHYS102 Quantum Physics', 'PHYS103 Thermodynamics', 'PHYS104 Electromagnetism', 'PHYS105 Experimental Physics',
    'PHYS201 Statistical Mechanics', 'PHYS202 Optics', 'PHYS203 Modern Physics', 'PHYS204 Computational Physics', 'PHYS205 Solid State Physics',
    'PHYS301 Condensed Matter Physics', 'PHYS302 Nuclear Physics', 'PHYS303 Astrophysics', 'PHYS304 Plasma Physics', 'PHYS305 Biophysics',
    'PHYS401 Advanced Quantum Mechanics', 'PHYS402 General Relativity', 'PHYS403 Particle Physics', 'PHYS404 Cosmology', 'PHYS405 Quantum Field Theory'
  ],
  'Chemistry': [
    'CHEM101 Organic Chemistry', 'CHEM102 Inorganic Chemistry', 'CHEM103 Physical Chemistry', 'CHEM104 Analytical Chemistry', 'CHEM105 Fundamentals of Chemistry',
    'CHEM201 Environmental Chemistry', 'CHEM202 Biochemistry', 'CHEM203 Polymer Chemistry', 'CHEM204 Quantum Chemistry', 'CHEM205 Industrial Chemistry',
    'CHEM301 Spectroscopy', 'CHEM302 Surface Chemistry', 'CHEM303 Computational Chemistry', 'CHEM304 Medicinal Chemistry', 'CHEM305 Green Chemistry',
    'CHEM401 Advanced Organic Synthesis', 'CHEM402 Material Chemistry', 'CHEM403 Chemical Engineering Principles', 'CHEM404 Nanotechnology', 'CHEM405 Forensic Chemistry'
  ],
  'Biology': [
    'BIO101 Cell Biology', 'BIO102 Genetics', 'BIO103 Ecology', 'BIO104 Evolutionary Biology', 'BIO105 Introduction to Life Sciences',
    'BIO201 Microbiology', 'BIO202 Molecular Biology', 'BIO203 Biostatistics', 'BIO204 Developmental Biology', 'BIO205 Plant Biology',
    'BIO301 Immunology', 'BIO302 Virology', 'BIO303 Neurobiology', 'BIO304 Systems Biology', 'BIO305 Animal Behavior',
    'BIO401 Bioinformatics', 'BIO402 Cancer Biology', 'BIO403 Stem Cell Research', 'BIO404 Synthetic Biology', 'BIO405 Advanced Ecology'
  ],
  'Economics': [
    'ECON101 Microeconomics', 'ECON102 Macroeconomics', 'ECON103 Economic History', 'ECON104 Behavioral Economics', 'ECON105 Financial Markets',
    'ECON201 Econometrics', 'ECON202 Game Theory', 'ECON203 International Economics', 'ECON204 Public Economics', 'ECON205 Labor Economics',
    'ECON301 Development Economics', 'ECON302 Environmental Economics', 'ECON303 Financial Economics', 'ECON304 Urban Economics', 'ECON305 Health Economics',
    'ECON401 Advanced Econometrics', 'ECON402 Industrial Organization', 'ECON403 Advanced Microeconomics', 'ECON404 Advanced Macroeconomics', 'ECON405 Economic Policy Analysis'
  ],
  'Business Administration': [
    'BUS101 Principles of Management', 'BUS102 Marketing Strategies', 'BUS103 Business Law', 'BUS104 Financial Accounting', 'BUS105 Introduction to Business',
    'BUS201 Organizational Behavior', 'BUS202 Corporate Finance', 'BUS203 Entrepreneurship', 'BUS204 Business Ethics', 'BUS205 Sales Management',
    'BUS301 Strategic Management', 'BUS302 Operations Management', 'BUS303 International Business', 'BUS304 Leadership', 'BUS305 Supply Chain Management',
    'BUS401 Advanced Marketing', 'BUS402 Investment Analysis', 'BUS403 Risk Management', 'BUS404 E-Commerce Strategies', 'BUS405 Digital Marketing'
  ],
  'English Literature': [
    'ENG101 Introduction to Poetry', 'ENG102 Shakespearean Drama', 'ENG103 American Literature', 'ENG104 Literary Analysis', 'ENG105 Introduction to Creative Writing',
    'ENG201 Victorian Literature', 'ENG202 Modern Fiction', 'ENG203 Gothic Literature', 'ENG204 Postcolonial Studies', 'ENG205 The Short Story',
    'ENG301 Romantic Poetry', 'ENG302 Literary Criticism', 'ENG303 Advanced Creative Writing', 'ENG304 Comparative Literature', 'ENG305 Digital Narratives',
    'ENG401 Advanced Literary Theory', 'ENG402 Digital Humanities', 'ENG403 World Literature', 'ENG404 Feminist Literature', 'ENG405 Narrative Structures'
  ],
  'History': [
    'HIST101 World History', 'HIST102 Ancient Civilizations', 'HIST103 European History', 'HIST104 Asian History', 'HIST105 African History',
    'HIST201 Medieval History', 'HIST202 Modern Europe', 'HIST203 American History', 'HIST204 History of Science', 'HIST205 Latin American History',
    'HIST301 Middle Eastern History', 'HIST302 History of Warfare', 'HIST303 History of Religion', 'HIST304 Economic History', 'HIST305 Social History',
    'HIST401 Advanced Historiography', 'HIST402 Environmental History', 'HIST403 Cultural History', 'HIST404 Political History', 'HIST405 Historical Methods'
  ],
  'Sociology': [
    'SOC101 Introduction to Sociology', 'SOC102 Social Stratification', 'SOC103 Sociology of Family', 'SOC104 Sociology of Media', 'SOC105 Sociology of Health',
    'SOC201 Cultural Anthropology', 'SOC202 Urban Sociology', 'SOC203 Sociology of Education', 'SOC204 Sociology of Gender', 'SOC205 Race and Ethnicity',
    'SOC301 Social Movements', 'SOC302 Political Sociology', 'SOC303 Sociology of Organizations', 'SOC304 Social Psychology', 'SOC305 Sociology of Technology',
    'SOC401 Global Sociology', 'SOC402 Environmental Sociology', 'SOC403 Criminology', 'SOC404 Advanced Sociological Theory', 'SOC405 Comparative Sociology'
  ],
  'Philosophy': [
    'PHIL101 Introduction to Philosophy', 'PHIL102 Ethics', 'PHIL103 Philosophy of Science', 'PHIL104 Logic', 'PHIL105 Philosophy of Religion',
    'PHIL201 Ancient Philosophy', 'PHIL202 Medieval Philosophy', 'PHIL203 Modern Philosophy', 'PHIL204 Political Philosophy', 'PHIL205 Aesthetics',
    'PHIL301 Existentialism', 'PHIL302 Philosophy of Mind', 'PHIL303 Epistemology', 'PHIL304 Metaphysics', 'PHIL305 Philosophy of Language',
    'PHIL401 Advanced Logic', 'PHIL402 Philosophy of Law', 'PHIL403 Contemporary Philosophy', 'PHIL404 Ethics of AI', 'PHIL405 Philosophy of Art'
  ],
  'Law': [
    'LAW101 Introduction to Law', 'LAW102 Constitutional Law', 'LAW103 Criminal Law', 'LAW104 Civil Procedure', 'LAW105 Legal Research',
    'LAW201 International Law', 'LAW202 Business Law', 'LAW203 Environmental Law', 'LAW204 Human Rights Law', 'LAW205 Intellectual Property Law',
    'LAW301 Labor Law', 'LAW302 Family Law', 'LAW303 Tax Law', 'LAW304 Advanced Criminal Procedure', 'LAW305 Alternative Dispute Resolution',
    'LAW401 Corporate Law', 'LAW402 Cyber Law', 'LAW403 Environmental Litigation', 'LAW404 Advanced Contract Law', 'LAW405 International Trade Law'
  ],
  'Medicine': [
    'MED101 Anatomy', 'MED102 Physiology', 'MED103 Histology', 'MED104 Biochemistry', 'MED105 Medical Terminology',
    'MED201 Pathology', 'MED202 Pharmacology', 'MED203 Microbiology', 'MED204 Immunology', 'MED205 Clinical Skills',
    'MED301 Clinical Medicine I', 'MED302 Clinical Medicine II', 'MED303 Pediatrics', 'MED304 Obstetrics and Gynecology', 'MED305 Geriatrics',
    'MED401 Surgery', 'MED402 Psychiatry', 'MED403 Neurology', 'MED404 Oncology', 'MED405 Emergency Medicine'
  ],
  'Nursing': [
    'NUR101 Fundamentals of Nursing', 'NUR102 Pediatric Nursing', 'NUR103 Community Health Nursing', 'NUR104 Medical-Surgical Nursing', 'NUR105 Nutrition',
    'NUR201 Psychiatric Nursing', 'NUR202 Nursing Leadership', 'NUR203 Critical Care Nursing', 'NUR204 Geriatric Nursing', 'NUR205 Palliative Care',
    'NUR301 Maternity Nursing', 'NUR302 Nursing Informatics', 'NUR303 Emergency Nursing', 'NUR304 Nursing Ethics', 'NUR305 Evidence-Based Practice',
    'NUR401 Advanced Clinical Nursing', 'NUR402 Health Policy', 'NUR403 Nursing Education', 'NUR404 Global Health Nursing', 'NUR405 Advanced Pharmacology'
  ],
  'Environmental Science': [
    'ENV101 Environmental Chemistry', 'ENV102 Ecological Principles', 'ENV103 Climate Change Science', 'ENV104 Conservation Biology', 'ENV105 Introduction to Environmental Science',
    'ENV201 Environmental Policy', 'ENV202 Environmental Impact Assessment', 'ENV203 Renewable Energy', 'ENV204 Water Resource Management', 'ENV205 Marine Biology',
    'ENV301 Sustainable Development', 'ENV302 Environmental Toxicology', 'ENV303 Urban Ecology', 'ENV304 Environmental Economics', 'ENV305 Biodiversity Management',
    'ENV401 Environmental Law', 'ENV402 Advanced Climate Studies', 'ENV403 Waste Management', 'ENV404 Ecosystem Restoration', 'ENV405 Advanced Environmental Statistics'
  ],
  'Art and Design': [
    'ART101 Introduction to Design', 'ART102 Drawing and Sketching', 'ART103 Painting Techniques', 'ART104 History of Art', 'ART105 Basics of Sculpting',
    'ART201 Sculpture', 'ART202 Digital Art', 'ART203 Photography', 'ART204 Graphic Design', 'ART205 Textile Art',
    'ART301 Ceramics', 'ART302 Animation', 'ART303 Industrial Design', 'ART304 Fashion Design', 'ART305 Exhibition Design',
    'ART401 Advanced Sculpture', 'ART402 Contemporary Art', 'ART403 Portfolio Development', 'ART404 Art Critique', 'ART405 Creative Entrepreneurship'
  ],
  'Music': [
    'MUS101 Introduction to Music Theory', 'MUS102 History of Western Music', 'MUS103 Aural Skills', 'MUS104 Fundamentals of Composition', 'MUS105 World Music Basics',
    'MUS201 Instrumental Performance', 'MUS202 Music Technology', 'MUS203 Conducting I', 'MUS204 Choral Arranging', 'MUS205 Music Business',
    'MUS301 Orchestration', 'MUS302 Advanced Composition', 'MUS303 Jazz Studies', 'MUS304 Music Production', 'MUS305 Experimental Music',
    'MUS401 Music Pedagogy', 'MUS402 Conducting II', 'MUS403 Music Psychology', 'MUS404 Advanced Music Theory', 'MUS405 Film Scoring'
  ]
};

const semesterData = [
  {SemesterID: '23F', Year: 2023, Term: 'Fall',
    TermStartDate: '2023-10-02', EnrollmentStartDate: '2023-09-11 10:00:00',
    EnrollmentEndDate: '2023-09-22 17:00:00', EnrollmentApprovalDate: '2023-09-25 12:00:00', Active: false},
  {SemesterID: '24S', Year: 2024, Term: 'Spring',
    TermStartDate: '2024-02-12', EnrollmentStartDate: '2024-01-22 10:00:00',
    EnrollmentEndDate: '2024-02-02 17:00:00', EnrollmentApprovalDate: '2024-02-05 12:00:00', Active: false},
  {SemesterID: '24U', Year: 2024, Term: 'Summer',
    TermStartDate: '2024-07-01', EnrollmentStartDate: '2024-06-24 10:00:00',
    EnrollmentEndDate: '2024-06-26 17:00:00', EnrollmentApprovalDate: '2024-06-28 12:00:00', Active: false},
  {SemesterID: '24F', Year: 2024, Term: 'Fall',
    TermStartDate: '2024-09-30', EnrollmentStartDate: '2024-09-09 10:00:00',
    EnrollmentEndDate: '2024-09-20 17:00:00', EnrollmentApprovalDate: '2024-09-23 12:00:00', Active: true},
  {SemesterID: '25S', Year: 2025, Term: 'Spring',
    TermStartDate: '2025-02-17', EnrollmentStartDate: '2025-01-27 10:00:00',
    EnrollmentEndDate: '2025-02-07 17:00:00', EnrollmentApprovalDate: '2025-02-10 12:00:00', Active: false},
];

(async function seedDatabase() {
  try {
    const executeQuery = async (query, values = []) => {
      const [rows] = await pool.query(query, values);
      return rows;
    };

    // Seed `semester`
    console.log('Seeding `semester`...');
    for (const semester of semesterData) {
      await executeQuery(
        `INSERT INTO semester 
        (SemesterID, Year, Term, TermStartDate, EnrollmentStartDate, EnrollmentEndDate, EnrollmentApprovalDate, Active) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          semester.SemesterID,
          semester.Year,
          semester.Term,
          semester.TermStartDate,
          semester.EnrollmentStartDate,
          semester.EnrollmentEndDate,
          semester.EnrollmentApprovalDate,
          semester.Active,
        ]
      );
    }

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
    for (const department of departments) {
      for (let i = 1; i <= 8; i++) {
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
        
        // Insert into user table
        await executeQuery(
          `INSERT INTO user (Email, Password, Role, InstructorID) VALUES (?, ?, ?, ?)`,
          [
            email,
            hashedPassword,
            'INSTRUCTOR',
            instructorId,
          ]
        );
      }
    }    

    // Seed `course`
    console.log('Seeding `course`...');
    const dbDepartments = await executeQuery(`SELECT DepartmentID, DepartmentCode FROM department`);
    for (const [departmentName, courses] of Object.entries(coursesByDepartment)) {
      const department = departmentsWithBuildings.find((d) => d.name === departmentName);
      if (department) {
        const dbDepartment = dbDepartments.find((d) => d.DepartmentCode === department.code);
        if (dbDepartment) {
          for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            const courseCode = course.split(' ')[0];
            const courseTitle = course.substring(course.indexOf(' ') + 1);
            await executeQuery(
              `INSERT INTO course (CourseCode, CourseTitle, DepartmentID, Credits, YearOfCourse, CourseDescription) 
              VALUES (?, ?, ?, ?, ?, ?)`,
              [
                courseCode,
                courseTitle,
                dbDepartment.DepartmentID,
                3,
                (Math.floor(i / 5) + 1).toString(),
                faker.lorem.sentence(),
              ]
            );
          }
        }
      }
    }

    // Seed `student`
    console.log('Seeding `student` and `user`...');
    for (const department of departments) {
      const advisors = await executeQuery(`
        SELECT InstructorID 
        FROM instructor 
        WHERE DepartmentID = ?
      `, [department.DepartmentID]);
      for (let i = 1; i <= 60; i++) {
        const advisor = faker.helpers.arrayElement(advisors);

        const firstName = faker.person.firstName().slice(0, 20);
        const middleName = faker.helpers.maybe(() => faker.person.firstName().slice(0, 20), { probability: 0.5 });
        const lastName = faker.person.lastName().slice(0, 20);
        const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

        const phoneNumber = faker.phone.number('(###) ###-####').slice(0, 15);
        const emailDomain = 'example.com';

        const totalCreditsBounds = [0, 15, 30, 45, 60];
        const selectedIndex = faker.number.int({ min: 0, max: totalCreditsBounds.length - 2 });
        const totalCredits = totalCreditsBounds[selectedIndex];
        const grade = (selectedIndex + 1).toString(); 

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

        // Insert into user table
        await executeQuery(
          `INSERT INTO user (Email, Password, Role, StudentID) VALUES (?, ?, ?, ?)`,
          [
            email,
            hashedPassword,
            'STUDENT',
            studentId,
          ]
        );
      }
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
      
      // Insert into user table
      await executeQuery(
        `INSERT INTO user (Email, Password, Role, AdminID) VALUES (?, ?, ?, ?)`,
        [
          email,
          hashedPassword,
          'ADMIN',
          adminId,
        ]
      );
    }

    // Seed `course_schedules`
    console.log('Seeding `course_schedules`...');
    const courses = await executeQuery(`
      SELECT c.CourseID, c.DepartmentID, c.YearOfCourse 
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

    const semesters = await executeQuery(`
      SELECT SemesterID 
      FROM semester
    `);

    const availableTimes = ["08:30:00", "09:30:00", "10:30:00", "11:30:00", "12:30:00", "13:30:00", "14:30:00", "15:30:00"];
    const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    let baseNumericPart = 10001;

    const scheduleMap = new Map();

    for (const semester of semesters) {
      for (const selectedCourse of courses) {
        const { DepartmentID, YearOfCourse } = selectedCourse;

        const departmentYearKey = `${DepartmentID}-${YearOfCourse}`;
        if (!scheduleMap.has(departmentYearKey)) {
          scheduleMap.set(departmentYearKey, new Set());
        }

        const eligibleInstructors = instructors.filter(
          (instructor) => instructor.DepartmentID === DepartmentID
        );

        if (eligibleInstructors.length === 0) continue;

        const selectedInstructor = faker.helpers.arrayElement(eligibleInstructors);

        const randomizedDays = shuffle(availableDays);
        const randomizedTimes = shuffle(availableTimes);

        let startTime, endTime, assignedDay;
        for (const day of randomizedDays) {
          for (const time of randomizedTimes) {
            const endTimeCandidate = new Date(`1970-01-01T${time}`);
            endTimeCandidate.setHours(endTimeCandidate.getHours() + 2);
            const formattedEndTime = endTimeCandidate.toTimeString().slice(0, 8);

            const timeSlotKey = `${day}-${time}`;
            if (!scheduleMap.get(departmentYearKey).has(timeSlotKey)) {
              startTime = time;
              endTime = formattedEndTime;
              assignedDay = day;
              scheduleMap.get(departmentYearKey).add(timeSlotKey);
              break;
            }
          }
          if (startTime && endTime && assignedDay) break;
        }

        if (!startTime || !endTime || !assignedDay) {
          console.warn(
            `No available time slot for CourseID ${selectedCourse.CourseID} in Semester ${semester.SemesterID}`
          );
          continue;
        }

        const teachingMethod = faker.helpers.arrayElement(['Online', 'InPerson', 'Hybrid']);

        let location = teachingMethod === 'Online' ? 'Online' : null;
        if (teachingMethod !== 'Online') {
          const departmentBuilding = buildingOfDepartment.find(
            (d) => d.DepartmentID === DepartmentID
          );
          if (departmentBuilding) {
            location = `${departmentBuilding.BuildingCode} Class ${faker.number.int({ min: 100, max: 400 })}`;
          }
        }

        const crn = `${semester.SemesterID}${baseNumericPart}`;
        await executeQuery(
          `INSERT INTO course_schedules (CRN, CourseID, Day, ClassStartTime, ClassEndTime, InstructorID, SemesterID, TeachingMethod, Capacity, Enrolled, Location) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            crn,
            selectedCourse.CourseID,
            assignedDay,
            startTime,
            endTime,
            selectedInstructor.InstructorID,
            semester.SemesterID,
            teachingMethod,
            20,
            0,
            location,
          ]
        );
        baseNumericPart++;
      }
    }

    // Seed `enrollment`
    console.log('Seeding `enrollment`...');
    const studentsForEnrollment = await executeQuery(`
      SELECT StudentID, DepartmentID, Grade 
      FROM student
    `);

    const courseSchedules = await executeQuery(`
      SELECT cs.CRN, c.CourseID, c.DepartmentID, c.YearOfCourse, cs.SemesterID, cs.Capacity, cs.Enrolled
      FROM course_schedules cs
      JOIN course c ON cs.CourseID = c.CourseID
    `);

    const semesterDetails = await executeQuery(`
      SELECT SemesterID, EnrollmentStartDate, EnrollmentEndDate, EnrollmentApprovalDate
      FROM semester
      WHERE SemesterID IN ('23F', '24S', '24F')
    `);

    const enrollmentBatchSize = 1000;
    let enrollmentRecords = [];
    let capacityUpdates = [];

    for (const student of studentsForEnrollment) {
      const { StudentID, DepartmentID, Grade } = student;
      const studentGrade = parseInt(Grade, 10);

      const currentYear = studentGrade;
      const previousYear = studentGrade - 1;

      const currentYearCourses = courseSchedules.filter(
        (course) =>
          course.DepartmentID === DepartmentID &&
          course.YearOfCourse === currentYear.toString()
      );

      const prevYearCourses = courseSchedules.filter(
        (course) =>
          course.DepartmentID === DepartmentID &&
          course.YearOfCourse === previousYear.toString()
      );

      const indices = shuffle([0, 1, 2, 3, 4]);

      for (const semester of semesterDetails) {
        const { SemesterID, EnrollmentStartDate, EnrollmentEndDate, EnrollmentApprovalDate } = semester;

        let targetCourses;
        if (SemesterID === '23F' || SemesterID === '24S') {
          targetCourses = prevYearCourses.filter((course) => course.SemesterID === SemesterID);
        } else if (SemesterID === '24F') {
          targetCourses = currentYearCourses.filter((course) => course.SemesterID === SemesterID);
        }

        if (!targetCourses || targetCourses.length < 5) continue;

        targetCourses = indices.map((index) => targetCourses[index]);


        let selectedCourses;
        if (SemesterID.endsWith('F')) {
          selectedCourses = targetCourses.slice(0, 3);
        } else if (SemesterID.endsWith('S')) {
          selectedCourses = targetCourses.slice(3, 5);
        }

        for (const course of selectedCourses) {
          const enrollmentDate = faker.date.between({
            from: new Date(EnrollmentStartDate),
            to: new Date(EnrollmentEndDate),
          });
    
          enrollmentRecords.push([
            StudentID,
            course.CRN,
            enrollmentDate,
            new Date(EnrollmentApprovalDate),
          ]);
    
          capacityUpdates.push([course.CRN]);
    
          if (enrollmentRecords.length >= enrollmentBatchSize) {
            await executeQuery(
              `INSERT INTO enrollment (StudentID, CRN, EnrollmentDate, EnrollmentApprovalDate) VALUES ?`,
              [enrollmentRecords]
            );
            enrollmentRecords = [];
          }
        }
      }
    }
    
    if (enrollmentRecords.length > 0) {
      await executeQuery(
        `INSERT INTO enrollment (StudentID, CRN, EnrollmentDate, EnrollmentApprovalDate) VALUES ?`,
        [enrollmentRecords]
      );
    }
    
    if (capacityUpdates.length > 0) {
      const enrollmentCounts = new Map();
    
      for (const [CRN] of capacityUpdates) {
        enrollmentCounts.set(CRN, (enrollmentCounts.get(CRN) || 0) + 1);
      }
    
      const updateQueries = Array.from(enrollmentCounts.entries()).map(
        ([CRN, count]) => ({
          query: `UPDATE course_schedules SET Enrolled = Enrolled + ? WHERE CRN = ?`,
          values: [count, CRN],
        })
      );
    
      for (const { query, values } of updateQueries) {
        await executeQuery(query, values);
      }
    }

    // Seed `attendance`
    console.log('Seeding `attendance`...');
    const enrollments = await executeQuery(`
      SELECT StudentID, CRN
      FROM enrollment
    `);

    const weeks = Array.from({ length: 14 }, (_, i) => i + 1);

    const attendanceBatchSize = 1000;
    let attendanceRecords = [];

    for (const enrollment of enrollments) {
      const { StudentID, CRN } = enrollment;

      for (const week of weeks) {
        attendanceRecords.push([
          StudentID,
          CRN,
          week,
          faker.helpers.arrayElement(['Present', 'Absent', 'Late']),
        ]);

        if (attendanceRecords.length >= attendanceBatchSize) {
          await executeQuery(
            `INSERT INTO attendance (StudentID, CRN, Week, Status) VALUES ?`,
            [attendanceRecords]
          );
          attendanceRecords = [];
        }
      }
    }
    if (attendanceRecords.length > 0) {
      await executeQuery(
        `INSERT INTO attendance (StudentID, CRN, Week, Status) VALUES ?`,
        [attendanceRecords]
      );
    }

    // Seed `exams`
    console.log('Seeding `exams`...');

    const courseDetails = await executeQuery(`
      SELECT cs.CRN, cs.Location, cs.Day, cs.ClassStartTime, cs.TeachingMethod, s.TermStartDate, s.Term
      FROM course_schedules cs
      JOIN semester s ON cs.SemesterID = s.SemesterID
      WHERE s.SemesterID IN ('23F', '24S', '24U', '24F')
    `);

    const examDetailsDefault = [
      { name: 'Quiz1', type: 'Quiz', offsetWeeks: 3 },
      { name: 'Quiz2', type: 'Quiz', offsetWeeks: 5 },
      { name: 'Midterm1', type: 'Midterm', offsetWeeks: 7 },
      { name: 'Quiz3', type: 'Quiz', offsetWeeks: 9 },
      { name: 'Midterm2', type: 'Midterm', offsetWeeks: 11 },
      { name: 'Quiz4', type: 'Quiz', offsetWeeks: 13 },
      { name: 'Final', type: 'Final', offsetWeeks: 15 },
    ];

    const examDetailsSummer = [
      { name: 'Quiz1', type: 'Quiz', offsetWeeks: 3 },
      { name: 'Quiz2', type: 'Quiz', offsetWeeks: 4 },
      { name: 'Midterm', type: 'Midterm', offsetWeeks: 5 },
      { name: 'Quiz3', type: 'Quiz', offsetWeeks: 6 },
      { name: 'Final', type: 'Final', offsetWeeks: 8 },
    ];

    const examInsertBatch = [];
    for (const { CRN, Location, Day, ClassStartTime, TeachingMethod, TermStartDate, Term } of courseDetails) {
      if (!TermStartDate) {
        console.warn(`Skipping CRN: ${CRN} due to missing TermStartDate`);
        continue;
      }
    
      const isOnline = TeachingMethod === 'Online';
      const examLocation = isOnline ? 'Online' : Location;
    
      const startDate = new Date(TermStartDate);
      const quizStartTime = new Date(`1970-01-01T${ClassStartTime || '08:30:00'}`);
      const quizEndTime = new Date(quizStartTime);
      quizEndTime.setMinutes(quizEndTime.getMinutes() + 30);

      const examDetails = Term === 'Summer' ? examDetailsSummer : examDetailsDefault;

      for (const { name, type, offsetWeeks } of examDetails) {
        const examDate = new Date(startDate);
        examDate.setDate(
          examDate.getDate() +
            (offsetWeeks - 1) * 7 +
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(Day)
        );

        const startTime = type === 'Quiz' ? quizStartTime.toTimeString().slice(0, 8) : '18:00:00';
        const endTime = type === 'Quiz' ? quizEndTime.toTimeString().slice(0, 8) : '20:00:00';

        examInsertBatch.push([
          CRN,
          name,
          examDate.toISOString().split('T')[0],
          startTime,
          endTime,
          examLocation,
        ]);
      }
    }

    if (examInsertBatch.length > 0) {
      await executeQuery(
        `INSERT INTO exams (CRN, ExamName, ExamDate, ExamStartTime, ExamEndTime, ExamLocation) VALUES ?`,
        [examInsertBatch]
      );
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
    const inTermGradesBatch = [];
    for (const { StudentID, CRN } of enrollment) {
      for (const exam of exams) {
        const gradeValue = faker.number.int({ min: 0, max: 200 }) / 2;
        inTermGradesBatch.push([
          StudentID,
          CRN,
          exam.name,
          gradeValue,
          exam.percentage,
          `${exam.name} Score: ${gradeValue}, Weight: ${exam.percentage}%`,
        ]);
      }
    }
    
    if (inTermGradesBatch.length > 0) {
      await executeQuery(
        `INSERT INTO in_term_grades (StudentID, CRN, GradeName, GradeValue, GradePercentage, GradeDescription) VALUES ?`,
        [inTermGradesBatch]
      );
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

    const endOfTermGradesBatch = [];
    for (const { StudentID, CRN, TotalGrade } of aggregatedGrades) {
      const gradeOutOf100 = parseFloat(TotalGrade);
      const letterGrade = getLetterGrade(gradeOutOf100);
    
      endOfTermGradesBatch.push([
        StudentID,
        CRN,
        letterGrade,
        gradeOutOf100,
      ]);
    }
    
    if (endOfTermGradesBatch.length > 0) {
      await executeQuery(
        `INSERT INTO end_of_term_grades (StudentID, CRN, LetterGrade, GradeOutOf100) VALUES ?`,
        [endOfTermGradesBatch]
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

    // Seed `TotalCredits` update
    console.log('Updating `TotalCredits` based on successful courses in the active term...');

    const activeSemester = await executeQuery(`
      SELECT SemesterID 
      FROM semester 
      WHERE Active = true
    `);

    if (activeSemester.length === 0) {
      console.warn('No active semester found. Skipping total credits update.');
    } else {
      const { SemesterID } = activeSemester[0];

      const studentCredits = await executeQuery(`
        SELECT 
          e.StudentID,
          SUM(c.Credits) AS TotalCreditsInActiveTerm
        FROM 
          enrollment e
        JOIN 
          course_schedules cs ON e.CRN = cs.CRN
        JOIN 
          course c ON cs.CourseID = c.CourseID
        JOIN 
          end_of_term_grades etg ON e.StudentID = etg.StudentID AND e.CRN = etg.CRN
        WHERE 
          cs.SemesterID = ?
          AND etg.LetterGrade != 'FF'
        GROUP BY 
          e.StudentID
      `, [SemesterID]);

      if (studentCredits.length > 0) {
        const updates = studentCredits.map(({ StudentID, TotalCreditsInActiveTerm }) => {
          return executeQuery(
            `UPDATE student 
            SET TotalCredits = TotalCredits + ? 
            WHERE StudentID = ?`,
            [TotalCreditsInActiveTerm, StudentID]
          );
        });

        await Promise.all(updates);
      }
    }

    // Seed reenrollment
    console.log('Processing reenrollment for failed courses...');
    const summerTerm = await executeQuery(`
      SELECT SemesterID, EnrollmentStartDate, EnrollmentEndDate, EnrollmentApprovalDate
      FROM semester
      WHERE SemesterID = '24U'
      LIMIT 1
    `);

    if (!summerTerm || summerTerm.length === 0) {
      console.error('24U semester not found. Aborting reenrollment.');
      return;
    }

    const { EnrollmentStartDate, EnrollmentEndDate, EnrollmentApprovalDate } = summerTerm[0];  

    const failedCourses = await executeQuery(`
      SELECT 
        e.StudentID, 
        e.CRN, 
        cs.CourseID,
        cs.SemesterID
      FROM 
        enrollment e
      JOIN 
        end_of_term_grades etg ON e.StudentID = etg.StudentID AND e.CRN = etg.CRN
      JOIN 
        course_schedules cs ON e.CRN = cs.CRN
      WHERE 
        etg.LetterGrade = 'FF'
        AND cs.SemesterID IN ('23F', '24S')
    `);

    const attendanceBatch = [];
    const inTermGradeBatch = [];
    const endOfTermGradeBatch = [];
    const reenrollmentBatch = [];
    const enrolledUpdates = [];

    const groupedFailures = failedCourses.reduce((acc, course) => {
      if (!acc[course.StudentID]) acc[course.StudentID] = [];
      acc[course.StudentID].push(course);
      return acc;
    }, {});

    for (const [studentID, courses] of Object.entries(groupedFailures)) {
      for (const course of courses) {
        const { CourseID } = course;
    
        const summerCRN = await executeQuery(`
          SELECT cs.CRN, cs.Enrolled
          FROM course_schedules cs
          WHERE cs.CourseID = ? AND cs.SemesterID = '24U'
          LIMIT 1
        `, [CourseID]);
    
        if (summerCRN.length === 0) {
          console.warn(`No CRN available for CourseID: ${CourseID} in 24U`);
          continue;
        }
    
        const { CRN, Enrolled } = summerCRN[0];
    
        const enrollmentDate = faker.date.between({
          from: new Date(EnrollmentStartDate),
          to: new Date(EnrollmentEndDate),
        });
    
        reenrollmentBatch.push([
          studentID,
          CRN,
          enrollmentDate,
          new Date(EnrollmentApprovalDate),
        ]);
    
        const weeks = Array.from({ length: 7 }, (_, i) => i + 1);
        for (const week of weeks) {
          attendanceBatch.push([
            studentID,
            CRN,
            week,
            faker.helpers.arrayElement(['Present', 'Absent', 'Late']),
          ]);
        }

        const exams = [
          { name: 'Midterm', percentage: 30 },
          { name: 'Quiz1', percentage: 10 },
          { name: 'Quiz2', percentage: 10 },
          { name: 'Quiz3', percentage: 10 },
          { name: 'Final', percentage: 40 },
        ];
    
        let totalGrade = 0;
        for (const exam of exams) {
          const gradeValue = faker.number.int({ min: 80, max: 200 }) / 2;
          totalGrade += (gradeValue * exam.percentage) / 100;
      
          inTermGradeBatch.push([
            studentID,
            CRN,
            exam.name,
            gradeValue,
            exam.percentage,
            `${exam.name} Score: ${gradeValue}, Weight: ${exam.percentage}%`,
          ]);
        }
    
        const letterGrade =
          totalGrade >= 90 ? 'AA' : totalGrade >= 80 ? 'BA': totalGrade >= 70 ? 'BB' : totalGrade >= 60 ? 'CB'
          : totalGrade >= 50 ? 'CC' : totalGrade >= 45 ? 'DC' : totalGrade >= 30 ? 'DD': 'FF';

        endOfTermGradeBatch.push([
          studentID,
          CRN,
          letterGrade,
          totalGrade,
        ]);

        enrolledUpdates.push(CRN);
      }
    }

    if (reenrollmentBatch.length > 0) {
      await executeQuery(
        `INSERT INTO enrollment (StudentID, CRN, EnrollmentDate, EnrollmentApprovalDate) VALUES ?`,
        [reenrollmentBatch]
      );
    }

    if (attendanceBatch.length > 0) {
      await executeQuery(
        `INSERT INTO attendance (StudentID, CRN, Week, Status) VALUES ?`,
        [attendanceBatch]
      );
    }
    
    if (inTermGradeBatch.length > 0) {
      await executeQuery(
        `INSERT INTO in_term_grades (StudentID, CRN, GradeName, GradeValue, GradePercentage, GradeDescription) VALUES ?`,
        [inTermGradeBatch]
      );
    }
    
    if (endOfTermGradeBatch.length > 0) {
      await executeQuery(
        `INSERT INTO end_of_term_grades (StudentID, CRN, LetterGrade, GradeOutOf100) VALUES ?`,
        [endOfTermGradeBatch]
      );
    }

    if (enrolledUpdates.length > 0) {
      const enrollmentCounts = enrolledUpdates.reduce((map, CRN) => {
        map[CRN] = (map[CRN] || 0) + 1;
        return map;
      }, {});
    
      for (const [CRN, count] of Object.entries(enrollmentCounts)) {
        await executeQuery(
          `UPDATE course_schedules SET Enrolled = Enrolled + ? WHERE CRN = ?`,
          [count, CRN]
        );
      }
    }

    // Seed `GPA` Update
    console.log('Updating student `GPA` based on end-of-term grades...');
    const gradeToGPA = {'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
                        'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FF': 0.0};

    const students = await executeQuery(`
      SELECT DISTINCT StudentID 
      FROM student
    `);

    for (const student of students) {
      const { StudentID } = student;

      const grades = await executeQuery(`
        SELECT 
          MAX(etg.CRN) AS CRN, 
          MAX(etg.GradeOutOf100) AS GradeOutOf100, 
          MAX(etg.LetterGrade) AS LetterGrade, 
          cs.CourseID, 
          MAX(e.EnrollmentApprovalDate) AS LatestApprovalDate
        FROM end_of_term_grades etg
        JOIN enrollment e ON etg.StudentID = e.StudentID AND etg.CRN = e.CRN
        JOIN course_schedules cs ON e.CRN = cs.CRN
        WHERE e.StudentID = ?
        GROUP BY cs.CourseID
      `, [StudentID]);    

      if (grades.length === 0) continue;

      const totalGPA = grades.reduce((sum, grade) => {
        const gpaValue = gradeToGPA[grade.LetterGrade] || 0.0;
        return sum + gpaValue;
      }, 0);

      const calculatedGPA = totalGPA / grades.length;

      await executeQuery(
        `UPDATE student SET GPA = ? WHERE StudentID = ?`,
        [calculatedGPA.toFixed(2), StudentID]
      );
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('An error occurred during seeding:', error.message || error);
  } finally {
    await pool.end();
  }
})();
