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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });