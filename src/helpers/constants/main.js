import HomeIcon from "@mui/icons-material/Home";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import GradeIcon from "@mui/icons-material/Grade";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import BorderColorIcon from "@mui/icons-material/BorderColor";
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
    attendance: {
      name: "Attendance",
      path: "/attendance",
      icon: <BeenhereIcon />,
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
    attendance: {
      name: "Enter Attendance",
      path: "/attendance",
      icon: <BeenhereIcon />,
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
