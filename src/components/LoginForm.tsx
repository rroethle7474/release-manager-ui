'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './LoginForm.module.css';
import Modal from './common/Modal';
import RegisterForm from './RegisterForm';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { login, isLoading, error: authError } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    setFormError(null);
    
    // Attempt login
    const response = await login(email, password);
    
    if (!response.success) {
      setFormError(response.message || 'Login failed');
    }
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleRegistrationSuccess = () => {
    closeRegisterModal();
    setFormError(null);
    // Show success message
    alert('Registration successful! Please login with your new credentials.');
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Login</h2>
        
        {(formError || authError) && (
          <div className={styles.errorMessage}>
            {formError || authError}
          </div>
        )}
        
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your email"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your password"
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <div className={styles.registerLink}>
          Aren&apos;t a user? <button type="button" onClick={openRegisterModal}>Please register here</button>
        </div>
      </form>

      <Modal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        title="Register New Account"
      >
        <RegisterForm 
          onSuccess={handleRegistrationSuccess}
          onCancel={closeRegisterModal}
        />
      </Modal>
    </div>
  );
}
