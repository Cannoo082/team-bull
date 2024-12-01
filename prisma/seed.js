const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  // Dummy data for BUILDING
  const buildingIDs = [];
  for (let i = 1; i <= 3; i++) {
    const building = await prisma.building.create({
      data: {
        BuildingID: `B0${i}`,
        BuildingName: faker.company.name() + " Building",
        BuildingCode: faker.string.alpha({ length: 3, casing: 'upper' }),
      },
    });
    buildingIDs.push(building.BuildingID); 
  }

  // Dummy data for DEPARTMENT
  const departmentIDs = [];
  for (let i = 1; i <= 50; i++) {
    const department = await prisma.department.create({
      data: {
        DepartmentID: faker.string.alpha({ length: 4, casing: 'upper' }),
        DepartmentName: faker.person.jobTitle(),
        BuildingID: faker.helpers.arrayElement(buildingIDs), 
      },
    });
    departmentIDs.push(department.DepartmentID); 
  }

  // Dummy data for INSTRUCTOR
  const instructorIDs = [];
  for (let i = 1; i <= 50; i++) {
    const instructor = await prisma.instructor.create({
      data: {
        InstructorID: `I${faker.string.uuid().slice(0, 8)}`, 
        InstructorFirstName: faker.person.firstName(),
        InstructorLastName: faker.person.lastName(),
        InstructorFullName: faker.person.fullName(),
        InstructorEmail: faker.internet.email(),
        InstructorPhoto: Buffer.from(faker.image.avatar()), 
        InstructorPersonalEmail: faker.internet.email(),
        DepartmentID: faker.helpers.arrayElement(departmentIDs),
        WebsiteLink: faker.internet.url(),
        InstructorLocation: `Room ${faker.number.int({ min: 100, max: 500 })}`,
        InstructorPhoneNum: faker.phone.number('###########').substring(0, 15),
      },
    });
    instructorIDs.push(instructor.InstructorID);
  }

  // Dummy data for COURSE
  const courseCodes = [];
  for (let i = 1; i <= 5; i++) {
    const course = await prisma.course.create({
      data: {
        CourseCode: `C00${i}`,
        CourseTitle: faker.lorem.words(3),
        DepartmentID: faker.helpers.arrayElement(departmentIDs),
        Credits: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
        CourseDescription: faker.lorem.sentence(),
      },
    });
    courseCodes.push(course.CourseCode);
  }

  // Dummy data for COURSE_SCHEDULES
  const courseScheduleCRNs = [];
  for (let i = 1; i <= 5; i++) {
    const courseSchedule = await prisma.course_schedules.create({
      data: {
        CRN: `CRN00${i}`,
        CourseCode: faker.helpers.arrayElement(courseCodes),
        Day: faker.helpers.arrayElement([
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ]),
        ClassStartTime: faker.date.soon(),
        ClassEndTime: faker.date.soon(),
        InstructorID: faker.helpers.arrayElement(instructorIDs),
        Term: faker.helpers.arrayElement(["Fall", "Spring", "Summer"]),
        Year: 2024,
        TeachingMethod: faker.helpers.arrayElement([
          "Online",
          "InPerson",
          "Hybrid",
        ]),
        Capacity: faker.number.int({ min: 10, max: 50 }),
        Enrolled: faker.number.int({ min: 0, max: 50 }),
      },
    });
    courseScheduleCRNs.push(courseSchedule.CRN);
  }

  // Dummy data for STUDENT
  const studentIDs = [];
  for (let i = 1; i <= 10; i++) {
    const student = await prisma.student.create({
      data: {
        StudentID: `S00${i}`,
        StudentFirstName: faker.person.firstName(),
        StudentLastName: faker.person.lastName(),
        StudentFullName: faker.person.fullName(),
        StudentEmail: faker.internet.email(),
        StudentPersonalEmail: faker.internet.email(),
        DepartmentID: faker.helpers.arrayElement(departmentIDs),
        TotalCredits: faker.number.float({ min: 0, max: 20, precision: 0.1 }),
        GPA: faker.number.float({ min: 0, max: 4, precision: 0.01 }),
        StudentPhoto: Buffer.from(faker.image.avatar()),
        StudentPhoneNumber: faker.phone.number('###########').substring(0, 15),
        Advisor: faker.helpers.arrayElement(instructorIDs),
      },
    });
    studentIDs.push(student.StudentID);
  }

  // Dummy data for ENROLLMENT
  const usedEnrollmentCombinations = new Set();
  for (let i = 0; i < 10; i++) {
    let uniqueCombination = false;

    while (!uniqueCombination) {
      const studentID = faker.helpers.arrayElement(studentIDs);
      const crn = faker.helpers.arrayElement(courseScheduleCRNs);
      const combinationKey = `${studentID}-${crn}`;

      if (!usedEnrollmentCombinations.has(combinationKey)) {
        await prisma.enrollment.create({
          data: {
            StudentID: studentID,
            CRN: crn,
            EnrollmentDate: faker.date.past(),
            EnrollmentApprovalDate: faker.date.recent(),
          },
        });
        usedEnrollmentCombinations.add(combinationKey);
        uniqueCombination = true;
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });