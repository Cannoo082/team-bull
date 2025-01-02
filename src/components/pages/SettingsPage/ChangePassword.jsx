import styles from "@/styles/components/ChangePassword.module.css";
import { forwardRef, useContext, useEffect, useState } from "react";
import Button from "@/components/UI/Button";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { sendRequestChangePassword } from "@/helpers/functions/http";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { AuthContext } from "@/context/AuthContext";
import { error as errMsg } from "@/helpers/constants/messages";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ChangePassword() {
  const authCtx = useContext(AuthContext);
  const [passwordObject, setPasswordObject] = useState({
    password: {
      label: "Password",
      value: "",
      showPassword: false,
    },
    newPassword: {
      label: "New Password",
      value: "",
      showPassword: false,
    },
    confirmPassword: {
      label: "Confirm Password",
      value: "",
      showPassword: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  function handleChange(event) {
    const updatedObject = structuredClone(passwordObject); 
    updatedObject[event.target.name].value = event.target.value;
    setPasswordObject(updatedObject);
  }

  async function handleSubmit(event) {
    if (loading) {
      return;
    }

    // make sure not to execute below
    // if enter is pressed to change visibility
    if (
      event.type === "keydown" &&
      event.key === "Enter" &&
      !Object.keys(passwordObject).includes(event.target.name)
    ) {
      return;
    }
    const {
      password: { value: password },
      newPassword: { value: newPassword },
      confirmPassword: { value: confirmPassword },
    } = passwordObject;

    if (password.length === 0) {
      return alert("password is empty");
    }

    if (newPassword.length === 0) {
      return alert("new password is empty");
    }

    if (confirmPassword.length === 0) {
      return alert("confirm password is empty");
    }

    if (newPassword !== confirmPassword) {
      return alert("new password and confirm password should match");
    }

    setLoading(true);
    const response = await sendRequestChangePassword(
      authCtx.userState.userId,
      password,
      newPassword
    );
    setLoading(false);
    if (response === undefined) {
      return alert(errMsg.default);
    }

    if (response.error) {
      return alert(response.message);
    }
    setSuccess(true);
  }

  function handleVisibilityChange(name) {
    const updatedObject = structuredClone(passwordObject); 

    updatedObject[name].showPassword = !passwordObject[name].showPassword;

    setPasswordObject(updatedObject);
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
          Password has been changed successfully!
        </Alert>
      </Snackbar>

      {Object.keys(passwordObject).map((passwordName) => {
        return (
          <div key={passwordName} className={styles["password-container"]}>
            <TextField
              name={passwordName}
              sx={{ width: "500px" }}
              label={passwordObject[passwordName].label}
              variant="outlined"
              type={
                passwordObject[passwordName].showPassword ? "text" : "password"
              }
              value={passwordObject[passwordName].value}
              onChange={handleChange}
              onKeyDown={(event) =>
                event.key === "Enter" && handleSubmit(event)
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleVisibilityChange(passwordName)}
                      >
                        {passwordObject[passwordName].showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
        );
      })}
      <Button
        title="Change Password"
        onClick={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
