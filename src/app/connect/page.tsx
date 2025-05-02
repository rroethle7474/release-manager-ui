'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './ConnectPage.module.css'; // We'll create this CSS module next

export default function ConnectPage () {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Use organizationName if available, otherwise fallback to organizationId
  const organizationName = user?.organizationName || 'N/A'; 

  const handleConnect = () => {
    // TODO: Implement connection logic
    console.log('Connect button clicked');
  };

  return (
    <div className={styles.container}>
      <h1>Connect to DevOps Provider</h1>
      <div className={styles.userInfo}>
        <p><strong>Organization:</strong> {organizationName}</p>
        <p><strong>User:</strong> {user?.firstName || ''} {user?.lastName || ''} ({user?.email || 'N/A'})</p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="devopsProvider">DevOps Provider:</label>
        <select id="devopsProvider" className={styles.selectInput}>
          <option value="azure">Azure DevOps</option>
          {/* Add other providers later */}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="authType">Authentication Type:</label>
        <select id="authType" className={styles.selectInput}>
          <option value="oauth">Microsoft Entra (OAuth)</option>
          {/* Add other auth types later */}
        </select>
      </div>

      <button onClick={handleConnect} className={styles.connectButton}>
        Connect
      </button>
    </div>
  );
};
