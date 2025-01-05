"use client";

import styles from "@/styles/pages/SettingsPage.module.css";

import LockIcon from "@mui/icons-material/Lock";
import Sidebar from "@/components/pages/SettingsPage/Sidebar";
import { useState } from "react";
import SignInAndSecurity from "@/components/pages/SettingsPage/SignInAndSecurity";
import Backdrop from "@/components/UI/Backdrop";
export default function SettingsPage() {
  const [setting, setSetting] = useState("signInAndSecurity");
  const [mainContent, setMainContent] = useState(null);

  const CONTENTS = {
    signInAndSecurity: (
      <SignInAndSecurity
        handleMainContentChange={(component) => setMainContent(component)}
      />
    ),
  };
  const SIDEBAR_OPTIONS = [
    {
      id: "signInAndSecurity",
      name: "Sign in & Security",
      icon: <LockIcon fontSize="small" />,
      onClick: function () {
        setSetting("signInAndSecurity");
      },
    },
  ];

  return (
    <div className={styles.container}>
      <Sidebar header="Settings" options={SIDEBAR_OPTIONS} />
      <div className={styles["content-container"]}>
        <div className={styles.content}>{CONTENTS[setting]}</div>
      </div>
      {mainContent && (
        <Backdrop onClose={() => setMainContent(null)}>{mainContent}</Backdrop>
      )}
    </div>
  );
}
