import styles from '../styles/Footer.module.scss';

export default function Footer() {
    return (
        <footer className={styles.appFooter}>
            <p>&copy; 2025 Warsztat XXX</p>
            <p className={styles.appIcons}>Icons by&nbsp;<a href='https://icons8.com/'>icons8</a></p>
        </footer>
    );
}
