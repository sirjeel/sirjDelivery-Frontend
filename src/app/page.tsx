
import styles from "./page.module.css";
import Search from "../components/AdminDashboard/search/Search";
import List from "../components/AdminDashboard/list/List";


const page = () => {


  return (
    <div className={styles.gridContainer}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1>Dashboard</h1>
          <p>Scriptdel</p>
        </div>
      </div>

      <div className={styles.top1}></div>
      <div className={styles.menu}></div>
      <div className={styles.main}>
        <div className={`${styles["table-responsive"]} ${styles.records}`}> 
        <Search/>
         <div className={styles.dashgridA}>
             <div className={styles.serial}>#</div>
                <div>DATE</div>
                <div>NAME</div>
                <div>ADDRESS</div>
                <div className={styles.clientC}>TIME</div>
                <div className={styles.clientC}>STATUS</div>
              </div>
         <List />
         </div>
         </div>
      <div className={styles.right}></div>
    </div>
  );
};

export default page;
