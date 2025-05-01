'use client';

import styles from "./header.module.css";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 767px)');
    const { user, isAuthenticated, logout } = useAuth();
    
    // Close mobile menu when switching to desktop view
    useEffect(() => {
        if (!isMobile && isMenuOpen) {
            setIsMenuOpen(false);
        }
    }, [isMobile, isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const handleLogout = async () => {
        await logout();
    }

    return (
        <header className={styles.header}>
            <nav className={styles.headerNav}>
                {/* Hamburger menu for mobile */}
                {isMobile && (
                    <button 
                        className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`} 
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                )}
                
                {/* Title - centered */}
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>Release Manager</h1>
                </div>
                
                {/* Right side - Home button and user info */}
                <div className={styles.rightNavSection}>
                    <Link href="/" className={styles.homeButton}>
                        Home
                    </Link>
                    
                    {isAuthenticated ? (
                        <div className={styles.userInfo}>
                            <span className={styles.userGreeting}>
                                Hello, {user?.firstName || user?.email}!
                            </span>
                            <button 
                                onClick={handleLogout}
                                className={styles.logoutButton}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className={styles.loginButton}>
                            Login
                        </Link>
                    )}
                </div>
            </nav>
            
            {/* Mobile sidebar overlay */}
            {isMobile && (
                <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                    <div className={styles.mobileMenuContent}>
                        <div className={styles.mobileNavLinks}>
                            {isAuthenticated && (
                                <>
                                    <Link href="/dashboard" className={styles.mobileNavLink} onClick={toggleMenu}>
                                        Dashboard
                                    </Link>
                                    <Link href="/releases" className={styles.mobileNavLink} onClick={toggleMenu}>
                                        Releases
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}