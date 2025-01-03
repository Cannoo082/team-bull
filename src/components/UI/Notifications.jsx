import styles from "@/styles/components/Notifications.module.css";

const NOTIF_COLOR = {
  event: "yellow",
  grade: "skyblue",
  announcement: "lightgreen",
  exam: "orange",
  default: "red",
};

export default function Notifications({ notifs }) {
  console.log(notifs);
  if (notifs === null) {
    return null;
  }
  return (
    <div className={styles.container}>
      <h3>Notifications</h3>
      <div className={styles.notifs}>
        {notifs.map((notif) => {
          return (
            <div
              key={notif.NotificationID}
              className={styles.notif}
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
    </div>
  );
}
