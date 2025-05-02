'use client'; // Mark this as a Client Component

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import GlobalSpinner from '@/components/common/GlobalSpinner';
import Header from '@/components/layout/header'; // Assuming header is okay as client or doesn't use server-only features
import Footer from '@/components/layout/footer';

// This component now lives here and can use client-side hooks
const AppClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useAuth();

  return (
    <>
      {isLoading && <GlobalSpinner />}
      <Header />
      <div>
        <main>
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AppClientLayout;
