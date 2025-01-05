import styles from "@/styles/components/SignInAndSecurity.module.css";

import { Divider } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import ChangeEmail from "@/components/pages/SettingsPage/ChangeEmail";
import ChangePassword from "@/components/pages/SettingsPage/ChangePassword";

export default function SignInAndSecurity({ handleMainContentChange }) {
  const authCtx = useContext(AuthContext);

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.header}>Account Access</h2>
        <div className={styles.options}>
          <div
            className={styles.option}
            onClick={() => handleMainContentChange(<ChangeEmail />)}
          >
            <p className={styles.description}>Email Address</p>
            <div className={styles["value-container"]}>
              <p className={styles.value}>{authCtx.userState.email}</p>
              <ArrowForwardIcon />
            </div>
          </div>
          <Divider />
          <div
            className={styles.option}
            onClick={() => handleMainContentChange(<ChangePassword />)}
          >
            <p className={styles.description}>Change Password</p>
            <div className={styles["value-container"]}>
              <p className={styles.value}></p>
              <ArrowForwardIcon />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
