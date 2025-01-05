import HomeIcon from "@mui/icons-material/Home";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import GradeIcon from "@mui/icons-material/Grade";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
const homeIcon = <HomeIcon />;
export const routeOptions = {
  student: {
    home: {
      name: "Home",
      path: "/",
      icon: homeIcon,
    },
    grades: {
      name: "Grades",
      path: "/grades-student",
      icon: <GradeIcon />,
    },
    exams: {
      name: "Exams",
      path: "/exams-student",
      icon: <BorderColorIcon />,
    },
    enrollment: {
      name: "Enroll",
      path: "/enrollment",
      icon: <AddCircleIcon />,
    },
    attendance: {
      name: "Attendance",
      path: "/attendance-student",
      icon: <BeenhereIcon />,
    },
    calendar: {
      name: "Calendar",
      path: "/calendar-student",
      icon: <CalendarMonthOutlinedIcon />,
    },
  },
  academic: {
    home: {
      name: "Home",
      path: "/",
      icon: homeIcon,
    },
    grades: {
      name: "Enter Grades",
      path: "/grades-academic",
      icon: <GradeIcon />,
    },
    exams: {
      name: "Schedule Exam",
      path: "/exams-academic",
      icon: <BorderColorIcon />,
    },
  },
  admin: {
    admin: {
      name: "Admin",
      path: "/admin",
      divider: true,
      icon: <SupervisorAccountIcon />,
    },
    home: {
      name: "Home",
      path: "/",
      icon: homeIcon,
    },
  },
};
