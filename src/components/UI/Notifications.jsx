import styles from "@/styles/components/Notifications.module.css";
import Backdrop from "@/components/UI/Backdrop";
import { useState } from "react";
const NOTIF_COLOR = {
  event: "yellow",
  grade: "skyblue",
  announcement: "lightgreen",
  exam: "orange",
  default: "red",
};

const NOTIF_PRIORITY = {
  high: "red",
  medium: "orange",
  low: "green",
  default: "black",
};
export default function Notifications({ notifs }) {
  const [selectedNotif, setSelectedNotif] = useState(null);
  if (notifs === null) {
    return null;
  }

  function handleNotifSelect(notificationId) {
    const object = notifs.find((n) => n.NotificationID === notificationId);
    if (!object) {
      return;
    }
    setSelectedNotif(object);
  }
  console.log(notifs);
  return (
    <div className={styles.container}>
      <h3>Notifications{notifs.length ? ` (${notifs.length})` : ""}</h3>
      {notifs.length ? (
        <div className={styles.notifs}>
          {notifs.map((notif, index) => {
            return (
              <div
                key={index}
                className={styles.notif}
                onClick={() => handleNotifSelect(notif.NotificationID)}
                style={{
                  backgroundColor:
                    NOTIF_COLOR[notif["Type"].toLowerCase()] ||
                    NOTIF_COLOR.default,
                }}
              >
                {notif.Title.length > 100
                  ? notif.Title.slice(0, 10) + "..."
                  : notif.Title}
              </div>
            );
          })}
        </div>
      ) : (
        <p>You have no notifications</p>
      )}
      {selectedNotif && (
        <Backdrop onClose={() => setSelectedNotif(null)}>
          <div className={styles["notif-container"]}>
            <h3>{selectedNotif.Title}</h3>
            <p className={styles["notif-detail"]}>
              <b>Message: </b>
              {selectedNotif.Message}
            </p>
            <p className={styles["notif-detail"]}>
              <b>Type: </b>
              <b
                style={{
                  color:
                    NOTIF_COLOR[selectedNotif?.Type.toLowerCase()] ||
                    NOTIF_COLOR["default"],
                }}
              >
                {selectedNotif?.Type}
              </b>
            </p>
            <p className={styles["notif-detail"]}>
              <b>Priority: </b>
              <b
                style={{
                  color:
                    NOTIF_PRIORITY[selectedNotif?.Priority.toLowerCase()] ||
                    NOTIF_PRIORITY["default"],
                }}
              >
                {selectedNotif.Priority}
              </b>
            </p>
            <p className={styles["notif-detail"]}>
              <b>Sent at: </b>
              {new Date(selectedNotif.CreatedAt).toLocaleString()}
            </p>
          </div>
        </Backdrop>
      )}
    </div>
  );
}
