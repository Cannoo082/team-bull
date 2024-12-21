CREATE TABLE `building` (
    `BuildingID` VARCHAR(10) NOT NULL,
    `BuildingName` VARCHAR(50) NULL,
    `BuildingCode` VARCHAR(10) NULL,
    PRIMARY KEY (`BuildingID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `department` (
    `DepartmentID` VARCHAR(10) NOT NULL,
    `DepartmentName` VARCHAR(50) NULL,
    `BuildingID` VARCHAR(10) NULL,
    INDEX `DEPARTMENT_BuildingID_fkey`(`BuildingID`),
    PRIMARY KEY (`DepartmentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `instructor` (
    `InstructorID` VARCHAR(10) NOT NULL,
    `InstructorFirstName` VARCHAR(20) NULL,
    `InstructorLastName` VARCHAR(20) NULL,
    `InstructorFullName` VARCHAR(60) NULL,
    `InstructorEmail` VARCHAR(50) NULL,
    `InstructorPersonalEmail` VARCHAR(50) NULL,
    `InstructorPhoto` LONGBLOB NULL,
    `WebsiteLink` VARCHAR(100) NULL,
    `InstructorLocation` VARCHAR(50) NULL,
    `InstructorPhoneNum` VARCHAR(15) NULL,
    `DepartmentID` VARCHAR(10) NULL,
    INDEX `INSTRUCTOR_DepartmentID_fkey`(`DepartmentID`),
    PRIMARY KEY (`InstructorID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `course` (
    `CourseCode` VARCHAR(10) NOT NULL,
    `CourseTitle` VARCHAR(50) NULL,
    `DepartmentID` VARCHAR(10) NULL,
    `Credits` DECIMAL(2, 1) NULL,
    `CourseDescription` VARCHAR(191) NULL,
    INDEX `COURSE_DepartmentID_fkey`(`DepartmentID`),
    PRIMARY KEY (`CourseCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `course_schedules` (
    `CRN` VARCHAR(10) NOT NULL,
    `CourseCode` VARCHAR(10) NULL,
    `Day` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NULL,
    `ClassStartTime` DATETIME(3) NULL,
    `ClassEndTime` DATETIME(3) NULL,
    `InstructorID` VARCHAR(10) NULL,
    `Term` VARCHAR(10) NULL,
    `Year` INTEGER NULL,
    `TeachingMethod` ENUM('Online', 'InPerson', 'Hybrid') NULL,
    `Capacity` INTEGER NULL,
    `Enrolled` INTEGER NULL,
    INDEX `COURSE_SCHEDULES_CourseCode_fkey`(`CourseCode`),
    INDEX `COURSE_SCHEDULES_InstructorID_fkey`(`InstructorID`),
    PRIMARY KEY (`CRN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `student` (
    `StudentID` VARCHAR(10) NOT NULL,
    `StudentFirstName` VARCHAR(20) NULL,
    `StudentLastName` VARCHAR(20) NULL,
    `StudentFullName` VARCHAR(60) NULL,
    `StudentEmail` VARCHAR(50) NULL,
    `StudentPersonalEmail` VARCHAR(50) NULL,
    `DepartmentID` VARCHAR(10) NULL,
    `TotalCredits` DECIMAL(4, 1) NULL,
    `GPA` DECIMAL(3, 2) NULL,
    `StudentPhoto` LONGBLOB NULL,
    `StudentPhoneNumber` VARCHAR(15) NULL,
    `Advisor` VARCHAR(10) NULL,
    INDEX `STUDENT_DepartmentID_fkey`(`DepartmentID`),
    PRIMARY KEY (`StudentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('STUDENT', 'INSTRUCTOR') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `studentId` VARCHAR(10) NULL,
    `instructorId` VARCHAR(10) NULL,
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_studentId_key`(`studentId`),
    UNIQUE INDEX `User_instructorId_key`(`instructorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `enrollment` (
    `StudentID` VARCHAR(10) NOT NULL,
    `CRN` VARCHAR(10) NOT NULL,
    `EnrollmentDate` DATETIME(3) NULL,
    `EnrollmentApprovalDate` DATETIME(3) NULL,
    INDEX `ENROLLMENT_CRN_fkey`(`CRN`),
    PRIMARY KEY (`StudentID`, `CRN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `attendance` (
    `StudentID` VARCHAR(10) NOT NULL,
    `CRN` VARCHAR(10) NOT NULL,
    `Date` DATETIME(3) NOT NULL,
    `Status` ENUM('Present', 'Absent', 'Late') NULL,
    INDEX `ATTENDANCE_CRN_fkey`(`CRN`),
    PRIMARY KEY (`StudentID`, `CRN`, `Date`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `exams` (
    `ExamID` INTEGER NOT NULL AUTO_INCREMENT,
    `CRN` VARCHAR(10) NULL,
    `ExamStartTime` DATETIME(3) NULL,
    `ExamEndTime` DATETIME(3) NULL,
    `ExamLocation` VARCHAR(50) NULL,
    INDEX `EXAMS_CRN_fkey`(`CRN`),
    PRIMARY KEY (`ExamID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `in_term_grades` (
    `StudentID` VARCHAR(10) NOT NULL,
    `CRN` VARCHAR(10) NOT NULL,
    `GradeName` VARCHAR(50) NULL,
    `GradePercentage` DECIMAL(5, 2) NULL,
    `GradeDescription` VARCHAR(191) NULL,
    INDEX `IN_TERM_GRADES_CRN_fkey`(`CRN`),
    PRIMARY KEY (`StudentID`, `CRN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `end_of_term_grades` (
    `StudentID` VARCHAR(10) NOT NULL,
    `CRN` VARCHAR(10) NOT NULL,
    `LetterGrade` VARCHAR(10) NULL,
    `GradeOutOf100` DECIMAL(5, 2) NULL,
    INDEX `END_OF_TERM_GRADES_CRN_fkey`(`CRN`),
    PRIMARY KEY (`StudentID`, `CRN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE notifications (
    NotificationID INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each notification
    UserID INT NOT NULL,                           -- Foreign key to the user receiving the notification
    Title VARCHAR(100) NOT NULL,                  -- Title of the notification (e.g., "New Grade Released")
    Message TEXT NOT NULL,                        -- Detailed message
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP, -- When the notification was created
    IsRead BOOLEAN DEFAULT FALSE,                 -- Whether the notification has been read
    RelatedEntityID INT NULL,                     -- Optional: ID of the related event (e.g., grade or course)
    Type ENUM('GRADE', 'ANNOUNCEMENT', 'EVENT', 'EXAM') NOT NULL, -- Type of notification
    FOREIGN KEY (UserID) REFERENCES User(id) ON DELETE CASCADE
);


ALTER TABLE `department` 
    ADD CONSTRAINT `DEPARTMENT_BuildingID_fkey` 
    FOREIGN KEY (`BuildingID`) REFERENCES `building`(`BuildingID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `instructor` 
    ADD CONSTRAINT `INSTRUCTOR_DepartmentID_fkey` 
    FOREIGN KEY (`DepartmentID`) REFERENCES `department`(`DepartmentID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `course` 
    ADD CONSTRAINT `COURSE_DepartmentID_fkey` 
    FOREIGN KEY (`DepartmentID`) REFERENCES `department`(`DepartmentID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `course_schedules` 
    ADD CONSTRAINT `COURSE_SCHEDULES_CourseCode_fkey` 
    FOREIGN KEY (`CourseCode`) REFERENCES `course`(`CourseCode`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `course_schedules` 
    ADD CONSTRAINT `COURSE_SCHEDULES_InstructorID_fkey` 
    FOREIGN KEY (`InstructorID`) REFERENCES `instructor`(`InstructorID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `student` 
    ADD CONSTRAINT `STUDENT_DepartmentID_fkey` 
    FOREIGN KEY (`DepartmentID`) REFERENCES `department`(`DepartmentID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `User` 
    ADD CONSTRAINT `User_studentId_fkey` 
    FOREIGN KEY (`studentId`) REFERENCES `student`(`StudentID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `User` 
    ADD CONSTRAINT `User_instructorId_fkey` 
    FOREIGN KEY (`instructorId`) REFERENCES `instructor`(`InstructorID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `enrollment` 
    ADD CONSTRAINT `ENROLLMENT_CRN_fkey` 
    FOREIGN KEY (`CRN`) REFERENCES `course_schedules`(`CRN`) 
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `enrollment` 
    ADD CONSTRAINT `ENROLLMENT_StudentID_fkey` 
    FOREIGN KEY (`StudentID`) REFERENCES `student`(`StudentID`) 
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `attendance` 
    ADD CONSTRAINT `ATTENDANCE_CRN_fkey` 
    FOREIGN KEY (`CRN`) REFERENCES `course_schedules`(`CRN`) 
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `attendance` 
    ADD CONSTRAINT `ATTENDANCE_StudentID_fkey` 
    FOREIGN KEY (`StudentID`) REFERENCES `student`(`StudentID`) 
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `exams` 
    ADD CONSTRAINT `EXAMS_CRN_fkey` 
    FOREIGN KEY (`CRN`) REFERENCES `course_schedules`(`CRN`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `in_term_grades` 
    ADD CONSTRAINT `IN_TERM_GRADES_CRN_fkey` 
    FOREIGN KEY (`CRN`) REFERENCES `course_schedules`(`CRN`) 
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `in_term_grades` 
    ADD CONSTRAINT `IN_TERM_GRADES_StudentID_fkey` 
    FOREIGN KEY (`StudentID`) REFERENCES `student`(`StudentID`) 
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `end_of_term_grades` 
    ADD CONSTRAINT `END_OF_TERM_GRADES_CRN_fkey` 
    FOREIGN KEY (`CRN`) REFERENCES `course_schedules`(`CRN`) 
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `end_of_term_grades` 
    ADD CONSTRAINT `END_OF_TERM_GRADES_StudentID_fkey` 
    FOREIGN KEY (`StudentID`) REFERENCES `student`(`StudentID`) 
    ON DELETE RESTRICT ON UPDATE CASCADE;
