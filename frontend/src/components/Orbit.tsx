import styles from "./Orbit.module.css";

export default function Orbit () {
  return(
<div id={styles["circle-orbit-container"]}>

  {/* Circles closest to the central point */}
  <div id={styles["inner-orbit"]}>
    <div className={styles["inner-orbit-cirlces"]}></div>
  </div>

  {/* Circles second closest to the central point */}
  <div id={styles["middle-orbit"]}>
    <div className={styles["middle-orbit-cirlces"]}></div>
  </div>

  {/* Circles furthest away to the central point */}
  <div id={styles["outer-orbit"]}>
    <div className={styles["outer-orbit-cirlces"]}></div>
  </div>

</div>)};

