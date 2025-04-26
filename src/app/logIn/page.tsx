'use client';
import styles from './page.module.scss';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export default function Log() {
    return (
        <div className={styles.LogContainer}>
            <div className={styles.LeftBox}></div>
            <div className={styles.LogLeft}>
                <h1>Witaj!</h1>
                <p>Pierwszy raz w naszym serwisie?</p>
                <Link href="/register" passHref>
                    <Button className={styles.LeftButton} variant="outline">Zarejestruj się!</Button>
                </Link>
            </div>
            <div className={styles.LogRight}>
                <img className={styles.appLogo} src='/logo_black.png' alt='App logo black' />
                <Input className={styles.Input} placeholder="login" />
                <Input className={styles.Input} placeholder="hasło" type="password" />
                <Button className={styles.RightButton}>Zaloguj</Button>
            </div>
        </div>
    )
}