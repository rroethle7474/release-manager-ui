'use client';
import styles from './GlobalSpinner.module.css';

const GlobalSpinner = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default GlobalSpinner;