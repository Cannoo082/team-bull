import styles from "@/styles/components/Backdrop.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
export default function Backdrop({ onClose, children }) {
  useEffect(() => {
    function handleEvent(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEvent);

    return () => {
      window.removeEventListener("keydown", handleEvent);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.close} onClick={onClose}>
        <CloseIcon fontSize="large" />
      </div>
      {children}
    </div>
  );
}
