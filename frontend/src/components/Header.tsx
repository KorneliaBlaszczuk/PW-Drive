'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import styles from '../styles/Header.module.scss';
import { usePathname } from "next/navigation";
import { jwtDecode } from 'jwt-decode';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        const role = sessionStorage.getItem('role');
        if (role == "WORKSHOP") {
            setAdmin(true);
        }
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setAdmin(false);
        sessionStorage.clear;
        // redirect to home page
        router.push('/');
    };

    return (
        <header className={styles.appHeader}>
            {!isAdmin ? (<Link href="/" className="logoLink">
                <img className={styles.appLogo} src='/logo_white.png' alt='App logo' />
            </Link>) : (<Link href="/admin_home" className="logoLink">
                <img className={styles.appLogo} src='/logo_white.png' alt='App logo' />
            </Link>)}
            <div className={styles.headerCenter}>
                <Link href="/about" passHref>
                    <Button
                        size="lg"
                        className={isActive("/about") ? styles.navActive : styles.navInactive}
                    >
                        O nas
                    </Button>
                </Link>
                {!isAdmin && isLoggedIn ? (
                    <Link href="/book" passHref>
                        <Button
                            size="sm"
                            className={isActive("/book") ? styles.navActive : styles.navInactive}
                        >
                            Umów wizytę
                        </Button>
                    </Link>) : (
                    <Link href="" passHref>
                        <Button
                            size="sm"
                            className={styles.notUser}
                        >
                            Umów wizytę
                        </Button>
                    </Link>)}

                <Link href="/contact" passHref>
                    <Button
                        size="sm"
                        className={isActive("/contact") ? styles.navActive : styles.navInactive}
                    >
                        Kontakt
                    </Button>
                </Link>

                <Link href="/pricing" passHref>
                    <Button
                        size="sm"
                        className={isActive("/pricing") ? styles.navActive : styles.navInactive}
                    >
                        Cennik
                    </Button>
                </Link>
            </div>
            <div className={styles.headerRight}>
                {isLoggedIn ? (
                    <>
                        <Link href="/profile" passHref>
                            <img src="https://img.icons8.com/ios-filled/50/FFFFFF/user.png" alt="Użytkownik" className={styles.icon} />                    </Link>
                        <Button className={styles.logIn} onClick={handleLogout}>Wyloguj</Button>
                    </>
                ) : (
                    <>
                        <Link href="/logIn" passHref>
                            <Button className={styles.logIn} variant="outline">Zaloguj</Button>
                        </Link>
                        <Link href="/register" passHref>
                            <Button className={styles.register} variant="outline">Zarejestruj</Button>
                        </Link>
                    </>)}
            </div>
        </header >
    );
};