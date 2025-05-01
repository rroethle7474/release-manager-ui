import { useState, FormEvent } from 'react';
import styles from './RegisterForm.module.css';
import { registerUser } from '@/services/auth';

interface RegisterFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RegisterForm({ onSuccess, onCancel }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organizationName: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Default to browser timezone
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Organization name validation
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const response = await registerUser(formData);
      
      if (response.success) {
        onSuccess();
      } else {
        setFormError(response.message || 'Registration failed');
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.registerForm} onSubmit={handleSubmit}>
      {formError && (
        <div className={styles.errorMessage}>
          {formError}
        </div>
      )}
      
      <div className={styles.formGroup}>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Enter your email"
        />
        {errors.email && <div className={styles.fieldError}>{errors.email}</div>}
      </div>
      
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password *</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Enter password"
          />
          {errors.password && <div className={styles.fieldError}>{errors.password}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Confirm password"
          />
          {errors.confirmPassword && <div className={styles.fieldError}>{errors.confirmPassword}</div>}
        </div>
      </div>
      
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName">First Name *</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Enter first name"
          />
          {errors.firstName && <div className={styles.fieldError}>{errors.firstName}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="lastName">Last Name *</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Enter last name"
          />
          {errors.lastName && <div className={styles.fieldError}>{errors.lastName}</div>}
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="organizationName">Organization Name *</label>
        <input
          id="organizationName"
          name="organizationName"
          type="text"
          value={formData.organizationName}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Enter organization name"
        />
        {errors.organizationName && <div className={styles.fieldError}>{errors.organizationName}</div>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="timeZone">Time Zone</label>
        <input
          id="timeZone"
          name="timeZone"
          type="text"
          value={formData.timeZone}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Enter time zone"
        />
        {errors.timeZone && <div className={styles.fieldError}>{errors.timeZone}</div>}
      </div>
      
      <div className={styles.formActions}>
        <button 
          type="button" 
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
}
