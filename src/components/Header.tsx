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
                <Link href="/about" className={isActive("/about") ? styles.navActive : styles.navInactive}>O nas</Link>
                <Link href="/book" className={isActive("/book") ? styles.navActive : styles.navInactive}>Umów wizytę</Link>
                <Link href="contact" className={isActive("/conntact") ? styles.navActive : styles.navInactive}>Kontakt</Link>
                <Link href="pricing" className={isActive("/pricing") ? styles.navActive : styles.navInactive}>Cennik</Link>
            </div>
            <div className={styles.headerRight}>
                <Button className={styles.logIn} variant="outline">Zaloguj</Button>
                <Button className={styles.register} variant="outline">Zarejestruj</Button>
            </div>
        </header>
    );
};