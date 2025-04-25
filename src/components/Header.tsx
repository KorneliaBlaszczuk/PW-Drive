import { Button } from "@/components/ui/button"
import Link from 'next/link';
import styles from '../styles/Header.module.scss';

export default function Header() {
    return (
        <header className={styles.appHeader}>
            <Link href="/" className="logoLink">
                <img className={styles.appLogo} src='/logo_white.png' alt='App logo' />
            </Link>
            <div className={styles.headerCenter}>
                <Link href="/about" className={styles.aboutUs}>O nas</Link>
                <Link href="/book">Umów wizytę</Link>
                <Link href="contact">Kontakt</Link>
                <Link href="pricing">Cennik</Link>
            </div>
            <div className={styles.headerRight}>
                <Button className={styles.logIn} variant="outline">Zaloguj</Button>
                <Button className={styles.register} variant="outline">Zarejestruj</Button>
            </div>
        </header>
    );
};