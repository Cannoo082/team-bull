CREATE TABLE `building` (
    `BuildingID` INT NOT NULL AUTO_INCREMENT,
    `BuildingCode` VARCHAR(10) NOT NULL UNIQUE,
    `BuildingName` VARCHAR(50) NULL,
    PRIMARY KEY (`BuildingID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `department` (
    `DepartmentID` INT NOT NULL AUTO_INCREMENT,
    `DepartmentCode` VARCHAR(50) NOT NULL UNIQUE,
    `DepartmentName` VARCHAR(50) NULL,
    `BuildingID` INT NULL,
    `Abbreviation` VARCHAR(10) NULL,
    INDEX `DEPARTMENT_BuildingID_fkey`(`BuildingID`),
    PRIMARY KEY (`DepartmentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `instructor` (
    `InstructorID` INT NOT NULL AUTO_INCREMENT,
    `InstructorFirstName` VARCHAR(20) NULL,
    `InstructorLastName` VARCHAR(20) NULL,
    `InstructorFullName` VARCHAR(60) NULL,
    `InstructorEmail` VARCHAR(50) NOT NULL UNIQUE,
    `InstructorPersonalEmail` VARCHAR(50) NULL,
    `InstructorPhoto` LONGBLOB NULL,
    `WebsiteLink` VARCHAR(100) NULL,
    `InstructorLocation` VARCHAR(50) NULL,
    `InstructorPhoneNum` VARCHAR(15) NULL,
    `DepartmentID` INT NULL,
    INDEX `INSTRUCTOR_DepartmentID_fkey`(`DepartmentID`),
    PRIMARY KEY (`InstructorID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `semester` (
    `SemesterID` VARCHAR(5) NOT NULL,
    `Year` INT NOT NULL,
    `Term` ENUM('Fall', 'Spring', 'Summer') NOT NULL,
    `TermStartDate` DATE NULL,
    `EnrollmentStartDate` DATETIME(3) NULL,
    `EnrollmentEndDate` DATETIME(3) NULL,
    `EnrollmentApprovalDate` DATETIME(3) NULL,
    `Active` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`SemesterID`),
    UNIQUE KEY `UniqueYearTerm` (`Year`, `Term`),
    CHECK (`EnrollmentStartDate` < `EnrollmentEndDate` AND `EnrollmentEndDate` < `EnrollmentApprovalDate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `course` (
    `CourseID` INT NOT NULL AUTO_INCREMENT,
    `CourseCode` VARCHAR(10) NOT NULL UNIQUE,
    `CourseTitle` VARCHAR(50) NULL,
    `DepartmentID` INT NULL,
    `Credits` DECIMAL(2, 1) NULL,
    `YearOfCourse` ENUM('1', '2', '3', '4') NULL,
    `CourseDescription` VARCHAR(191) NULL,
    INDEX `COURSE_DepartmentID_fkey`(`DepartmentID`),
    PRIMARY KEY (`CourseID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `course_schedules` (
    `CRN` VARCHAR(10) NOT NULL,
    `CourseID` INT NULL,
    `Day` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NULL,
    `ClassStartTime` TIME NULL,
    `ClassEndTime` TIME NULL,
    `InstructorID` INT NULL,
    `SemesterID` VARCHAR(5) NULL,
    `TeachingMethod` ENUM('Online', 'InPerson', 'Hybrid') NULL,
    `Capacity` INTEGER NULL,
    `Enrolled` INTEGER NULL,
    `Location` VARCHAR(50) NULL,
    UNIQUE (`CourseID`, `InstructorID`, `SemesterID`),
    UNIQUE (`InstructorID`, `SemesterID`, `Day`, `ClassStartTime`),
    INDEX `COURSE_SCHEDULES_CourseID_fkey`(`CourseID`),
    INDEX `COURSE_SCHEDULES_InstructorID_fkey`(`InstructorID`),
    INDEX `COURSE_SCHEDULES_SemesterID_fkey`(`SemesterID`),
    PRIMARY KEY (`CRN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `student` (
    `StudentID` INT NOT NULL AUTO_INCREMENT,
    `StudentFirstName` VARCHAR(20) NULL,
    `StudentLastName` VARCHAR(20) NULL,
    `StudentFullName` VARCHAR(60) NULL,
    `StudentEmail` VARCHAR(50) NOT NULL UNIQUE,
    `StudentPersonalEmail` VARCHAR(50) NULL,
    `DepartmentID` INT NULL,
    `Grade` ENUM('1', '2', '3', '4') DEFAULT '1',
    `TotalCredits` DECIMAL(4, 1) DEFAULT 0.0,
    `GPA` DECIMAL(3, 2) DEFAULT 0.0,
    `StudentPhoto` LONGBLOB NULL,
    `StudentPhoneNumber` VARCHAR(15) NULL,
    `Advisor` INT NULL,
    INDEX `STUDENT_DepartmentID_fkey`(`DepartmentID`),
    INDEX `STUDENT_Advisor_fkey`(`Advisor`),
    PRIMARY KEY (`StudentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `admin` (
    `AdminID` INT NOT NULL AUTO_INCREMENT,
    `AdminFirstName` VARCHAR(20) NOT NULL,
    `AdminLastName` VARCHAR(20) NOT NULL,
    `AdminFullName` VARCHAR(60) NOT NULL,
    `AdminEmail` VARCHAR(50) NOT NULL UNIQUE,
    `AdminPhoneNumber` VARCHAR(15) NULL,
    `AdminPhoto` LONGBLOB NULL,
    PRIMARY KEY (`AdminID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `user` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(191) NOT NULL UNIQUE,
    `Password` VARCHAR(191) NOT NULL,
    `Role` ENUM('STUDENT', 'INSTRUCTOR', 'ADMIN') NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `StudentID` INT NULL,
    `InstructorID` INT NULL,
    `AdminID` INT NULL,
    UNIQUE INDEX `USER_Email_key`(`Email`),
    UNIQUE INDEX `USER_StudentID_fkey`(`StudentID`),
    UNIQUE INDEX `USER_InstructorID_fkey`(`InstructorID`),
    UNIQUE INDEX `USER_AdminID_fkey`(`AdminID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `enrollment` (
    `StudentID` INT NOT NULL,
    `CRN` VARCHAR(10) NOT NULL,
    `EnrollmentDate` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `EnrollmentApprovalDate` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `ENROLLMENT_CRN_fkey`(`CRN`),
    PRIMARY KEY (`StudentID`, `CRN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `attendance` (
    `StudentID` INT NOT NULL,
    `CRN` VARCHAR(10) NOT NULL,
    `Week` INT NOT NULL,
    `Status` ENUM('Present', 'Absent', 'Late') NULL,
    INDEX `ATTENDANCE_CRN_fkey`(`CRN`),
    PRIMARY KEY (`StudentID`, `CRN`, `Week`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `exams` (
    `ExamID` INT NOT NULL AUTO_INCREMENT,
    `CRN` VARCHAR(10) NULL,
    `ExamName` VARCHAR(50) NULL,
    `ExamDate` DATE NULL,
    `ExamStartTime` TIME NOT NULL DEFAULT '18:00:00',
    `ExamEndTime` TIME NOT NULL DEFAULT '20:00:00',
    `ExamLocation` VARCHAR(50) NULL,
    INDEX `EXAMS_CRN_fkey`(`CRN`),
    PRIMARY KEY (`ExamID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `in_term_grades` (
    `StudentID` INT NOT NULL,
    `CRN` VARCHAR(10) NOT NULL,
    `GradeName` VARCHAR(50) NOT NULL,
    `GradeValue` DECIMAL(4, 1) NULL,
    `GradePercentage` DECIMAL(5, 2) NULL,
    `GradeDescription` VARCHAR(191) NULL,
    INDEX `IN_TERM_GRADES_CRN_fkey`(`CRN`),
    PRIMARY KEY (`StudentID`, `CRN`, `GradeName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `end_of_term_grades` (
    `StudentID` INT NOT NULL,
    `CRN` VARCHAR(10) NOT NULL,
    `LetterGrade` VARCHAR(10) NULL,
    `GradeOutOf100` DECIMAL(5, 2) NULL,
    INDEX `END_OF_TERM_GRADES_CRN_fkey`(`CRN`),
    PRIMARY KEY (`StudentID`, `CRN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE notification (
    `NotificationID` INT AUTO_INCREMENT,
    `Title` VARCHAR(100) NOT NULL,
    `Message` TEXT NOT NULL,
    `CreatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `Type` ENUM('GRADE', 'ANNOUNCEMENT', 'EVENT', 'EXAM') NOT NULL,
    `Priority` ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    PRIMARY KEY (`NotificationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE user_notification (
    `UserNotificationID` INT AUTO_INCREMENT,
    `NotificationID` INT NOT NULL,
    `UserID` INT NOT NULL,
    `IsRead` TINYINT(1) DEFAULT 0,
    `ReadAt` DATETIME NULL,
    INDEX `USER_NOTIFICATION_NotificationID_fkey` (`NotificationID`),
    INDEX `USER_NOTIFICATION_UserID_fkey` (`UserID`),
    PRIMARY KEY (`UserNotificationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `department` 
    ADD CONSTRAINT `DEPARTMENT_BuildingID_fkey` 
    FOREIGN KEY (`BuildingID`) REFERENCES `building`(`BuildingID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `instructor` AUTO_INCREMENT = 200001;

ALTER TABLE `instructor` 
    ADD CONSTRAINT `INSTRUCTOR_DepartmentID_fkey` 
    FOREIGN KEY (`DepartmentID`) REFERENCES `department`(`DepartmentID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `course` 
    ADD CONSTRAINT `COURSE_DepartmentID_fkey` 
    FOREIGN KEY (`DepartmentID`) REFERENCES `department`(`DepartmentID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `course_schedules` 
    ADD CONSTRAINT `COURSE_SCHEDULES_CourseID_fkey` 
    FOREIGN KEY (`CourseID`) REFERENCES `course`(`CourseID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `course_schedules` 
    ADD CONSTRAINT `COURSE_SCHEDULES_InstructorID_fkey` 
    FOREIGN KEY (`InstructorID`) REFERENCES `instructor`(`InstructorID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `course_schedules` 
    ADD CONSTRAINT `COURSE_SCHEDULES_SemesterID_fkey` 
    FOREIGN KEY (`SemesterID`) REFERENCES `semester`(`SemesterID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `student` AUTO_INCREMENT = 100001;

ALTER TABLE `student`
    ADD CONSTRAINT GPA_CHECK CHECK (GPA <= 4.0),
    ADD CONSTRAINT Credits_CHECK CHECK (TotalCredits >= 0);

ALTER TABLE `student`
    ADD CONSTRAINT `STUDENT_DepartmentID_fkey` 
    FOREIGN KEY (`DepartmentID`) REFERENCES `department`(`DepartmentID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `student`
    ADD CONSTRAINT `STUDENT_Advisor_fkey`
    FOREIGN KEY (`Advisor`) REFERENCES `instructor`(`InstructorID`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `admin` AUTO_INCREMENT = 300001;

ALTER TABLE `user` AUTO_INCREMENT = 400001;

ALTER TABLE `user` 
    ADD CONSTRAINT `USER_StudentID_fkey` 
    FOREIGN KEY (`StudentID`) REFERENCES `student`(`StudentID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `user` 
    ADD CONSTRAINT `USER_InstructorID_fkey` 
    FOREIGN KEY (`InstructorID`) REFERENCES `instructor`(`InstructorID`) 
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `user`
    ADD CONSTRAINT `USER_AdminID_fkey`
    FOREIGN KEY (`AdminID`) REFERENCES `admin`(`AdminID`)
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

ALTER TABLE `user_notification`
    ADD CONSTRAINT `USER_NOTIFICATION_NotificationID_fkey`
    FOREIGN KEY (`NotificationID`) REFERENCES `notification`(`NotificationID`) 
    ON DELETE CASCADE;

ALTER TABLE `user_notification`
    ADD CONSTRAINT `USER_NOTIFICATION_UserID_fkey`
    FOREIGN KEY (`UserID`) REFERENCES `user`(`ID`) 
    ON DELETE CASCADE;
