
import styles from './LoadingDots.module.css';
import React from 'react';

const LoadingDots = ({ children, className }) => {
  return (
    <span className={styles.loading}>
      {children && <div className={styles.child}>{children}</div>}
      <span />
      <span />
      <span />
    </span>
  );
};

export default LoadingDots;
