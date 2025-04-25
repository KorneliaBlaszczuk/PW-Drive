'use client';

import { Button } from "@/components/ui/button"
import Link from 'next/link';
import styles from '../styles/Header.module.scss';
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    return (
        <header className={styles.appHeader}>
            <Link href="/" className="logoLink">
                <img className={styles.appLogo} src='/logo_white.png' alt='App logo' />
            </Link>
            <div className={styles.headerCenter}>
                <Link href="/about" passHref>
                    <Button
                        size="lg"
                        className={isActive("/about") ? styles.navActive : styles.navInactive}
                    >
                        O nas
                    </Button>
                </Link>
                <Link href="/book" passHref>
                    <Button
                        size="sm"
                        className={isActive("/book") ? styles.navActive : styles.navInactive}
                    >
                        Umów wizytę
                    </Button>
                </Link>

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
                <Button className={styles.logIn} variant="outline">Zaloguj</Button>
                <Button className={styles.register} variant="outline">Zarejestruj</Button>
            </div>
        </header>
    );
};