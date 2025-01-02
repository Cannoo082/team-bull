import styles from "@/styles/components/Sidebar.module.css";

export default function Sidebar({ header, options }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{header}</h1>
      {options.map((option) => (
        <div
          className={styles["option-container"]}
          key={option.id}
          onClick={option.onClick}
        >
          <div className={styles.icon}>{option.icon}</div>
          <h2 className={styles.option}>{option.name} </h2>
        </div>
      ))}
    </div>
  );
}
