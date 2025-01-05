import styles from "@/styles/components/Navbar.module.css";
import { useContext, useState } from "react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import * as cookies from "@/helpers/constants/cookie_keys";
import LogoutIcon from "@mui/icons-material/Logout";
import { deleteCookie } from "cookies-next";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Drawer from "@/components/UI/Drawer";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { routeOptions } from "@/helpers/constants/main";
import AccountMenu from "@/components/UI/AccountMenu";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar({ handleDatetimeOpen }) {
  const ACCOUNT_MENU_ITEMS = [
    {
      id: 1,
      name: "Profile",
      icon: <AccountCircleIcon fontSize="small" />,
      onClick: function () {
        handleCloseMenu();
        router.push("/profile");
      },
    },
    {
      id: 2,
      name: "Settings",
      icon: <SettingsIcon fontSize="small" />,
      onClick: function () {
        handleCloseMenu();
        router.push("/settings");
      },
    },
    {
      id: 3,
      name: "Logout",
      icon: <LogoutIcon fontSize="small" />,
      onClick: function () {
        handleCloseMenu();
        deleteCookie(cookies.user);
        authCtx.handleUserSignOut();
      },
    },
  ];
  const authCtx = useContext(AuthContext);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchorElement, setMenuAnchorElement] = useState(null);

  function handleOpenMenu(event) {
    setMenuAnchorElement(event.currentTarget);
    setMenuOpen(true);
  }

  function handleCloseMenu() {
    setMenuAnchorElement(null);
    setMenuOpen(false);
  }

  return (
      <div className={styles.container}>
        <div className={styles["icons-container"]}>
          <div className={styles.left}></div>
          <div className={styles.right}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{authCtx.userState?.email || "Guest"}</span>
              <span className={styles.userRole}>
            {authCtx.userState?.role === "academic" ? "Instructor" : "Student"}
          </span>
            </div>
            <IconButton
                id="account-menu"
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                aria-controls="account-menu"
                sx={{ mr: 2 }}
                onClick={handleOpenMenu}
            >
              <PersonIcon sx={{ color: "white" }} />
            </IconButton>
          </div>
        </div>
        <AccountMenu
            menuAnchorElement={menuAnchorElement}
            menuOpen={menuOpen}
            items={ACCOUNT_MENU_ITEMS}
            divider={[1]}
            handleCloseMenu={handleCloseMenu}
        />
        <Drawer options={routeOptions[authCtx.userState.role] || routeOptions["student"]} />
      </div>
  );
}