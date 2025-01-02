import styles from "@/styles/components/ChangeEmail.module.css";
import { forwardRef, useContext, useEffect, useState } from "react";
import Button from "@/components/UI/Button";
import { sendRequestChangeEmail } from "@/helpers/functions/http";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { AuthContext } from "@/context/AuthContext";
import { error as errMsg } from "@/helpers/constants/messages";
import { validateEmail } from "@/helpers/functions/util";
import { getCookie, setCookie } from "cookies-next";
import * as cookies from "@/helpers/constants/cookie_keys.js";
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ChangeEmail() {
  const authCtx = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    setEmail(event.target.value);
  }

  async function handleSubmit(event) {
    if (loading) {
      return;
    }

    const newEmail = email.trim();
    if (!newEmail.length) {
      return alert("EmptyEmpty field");
    }

    if (!validateEmail(newEmail)) {
      return alert("Invalid format for email");
    }
    setLoading(true);
    const response = await sendRequestChangeEmail(
      authCtx.userState.userId,
      newEmail
    );
    setLoading(false);
    if (response === undefined) {
      return alert(errMsg.default);
    }

    if (response.error) {
      return alert(response.message);
    }

    authCtx.handleChangeObject({ email: newEmail });
    let cookieUser = getCookie(cookies.user);
    if (cookieUser !== undefined) {
      cookieUser = JSON.parse(cookieUser);
      cookieUser.email = newEmail;
      setCookie(cookies.user, JSON.stringify(cookieUser));
    }
    setSuccess(true);
  }

  return (
    <div className={styles.container}>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess(false);
        }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Email has been changed successfully!
        </Alert>
      </Snackbar>

      <div className={styles["email-container"]}>
        <TextField
          sx={{ width: "500px" }}
          label="Email"
          variant="outlined"
          type="text"
          value={email}
          onChange={handleChange}
          onKeyDown={(event) => event.key === "Enter" && handleSubmit(event)}
        />
      </div>
      <Button title="Change Email" onClick={handleSubmit} loading={loading} />
    </div>
  );
}
