import React from 'react'
import styles from '../styles/Header.module.scss';

export default function Header() {
    return (
        <header className={styles.appHeader}>
            <img className={styles.appLogo} src='/logo_white.png' alt='App logo' />
        </header>
    );
};