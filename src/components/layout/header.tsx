'use client';

import styles from "./header.module.css";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { FaHome } from 'react-icons/fa';

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
                {/* Left side: Hamburger menu for mobile OR Home icon for desktop */}
                <div className={styles.leftNavSection}> 
                    {isMobile ? (
                        <button 
                            className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`} 
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    ) : (
                        <Link href="/" className={styles.desktopHomeButton} aria-label="Home">
                            <FaHome size={24} />
                        </Link>
                    )}
                </div>
                
                {/* Title - centered */}
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>Release Manager</h1>
                </div>
                
                {/* Right side - user info */}
                <div className={styles.rightNavSection}>
                    
                    {isAuthenticated ? (
                        <div className={styles.userInfo}>
                            <span className={styles.userGreeting}>
                                Hello, {user?.firstName || user?.email}!
                            </span>
                            <Link href="/connect" className={styles.navLink}>
                                Connect
                            </Link>
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
                                    <Link href="/connect" className={styles.mobileNavLink} onClick={toggleMenu}>
                                        Connect
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