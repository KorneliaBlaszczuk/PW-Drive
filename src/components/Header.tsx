import { Button } from "@/components/ui/button"
import Link from 'next/link';
import styles from '../styles/Header.module.scss';

export default function Header() {
    // const navigate = useNavigate();
    return (
        <header className={styles.appHeader}>
            {/* <Link to="/" className="logoLink"> */}
            <img className={styles.appLogo} src='/logo_white.png' alt='App logo' />
            {/* </Link> */}
            <div className={styles.headerCenter}>
                <Link href="/about" className={styles.aboutUs}>O nas</Link>
                <p>Umów wizytę</p>
                <p>Kontakt</p>
                <p>Cennik</p>
            </div>
            <div className={styles.headerRight}>
                <Button className={styles.logIn} variant="outline">Zaloguj</Button>
                <Button className={styles.register} variant="outline">Zarejestruj</Button>
            </div>
        </header>
    );
};