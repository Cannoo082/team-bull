"use client";
import styles from "@/styles/pages/LoginPage.module.css";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { setCookie, getCookie } from "cookies-next";
import * as cookies from "@/helpers/constants/cookie_keys.js";
import { sendRequestLogin } from "@/helpers/functions/http";
import TextField from "@mui/material/TextField";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Button from "@/components/UI/Button";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import { AuthContext } from "@/context/AuthContext";
import { error as errMsg } from "@/helpers/constants/messages";
export default function LoginPage() {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  function handleChange(event) {
    setInput((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function handleLogin() {
    setLoading(true);
    const response = await sendRequestLogin(input.email, input.password);
    setLoading(false);
    if (response === undefined) {
      return alert(errMsg.default);
    }

    if (response.error) {
      return alert(response.message);
    }
    const { userId, email, role } = response;
    authCtx.handleUserSignIn(userId, email, role);
    const cookie = getCookie(cookies.user);
    if (cookie === undefined) {
      const newCookie = {
        is_signed_in: true,
        user_id: response.userId,
        email: response.email,
        role: response.role,
      };
      setCookie(cookies.user, JSON.stringify(newCookie));
    }
    router.replace("/");
  }
  return (
    <div className={styles.container}>
      <div className={styles["login-form-container"]}>
        <div className={styles["login-form"]}>
          <h2>Login</h2>
          <div className={styles["email-container"]}>
            <TextField
              sx={{ width: "500px" }}
              name="email"
              label="Email"
              variant="outlined"
              value={input.email}
              onChange={handleChange}
              autoFocus
              onKeyDown={(event) =>
                event.key === "Enter" &&
                event.target.name === "email" &&
                handleLogin()
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <div className={styles["password-container"]}>
            <TextField
              sx={{ width: "500px" }}
              name="password"
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={input.password}
              onChange={handleChange}
              onKeyDown={(event) =>
                event.key === "Enter" &&
                event.target.name === "password" &&
                handleLogin()
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <p
            className={styles["forgot-password"]}
            onClick={() => router.push("/reset-password")}
          >
            Forgot Password?
          </p>
          <Button title="Log in" onClick={handleLogin} loading={loading} />
        </div>
      </div>
    </div>
  );
}
