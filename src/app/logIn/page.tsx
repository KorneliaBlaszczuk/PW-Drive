'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.scss';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';


export default function Log() {
    const router = useRouter();
    const [isAnimating, setIsAnimating] = useState(false);

    const handleGoToRegister = () => {
        setIsAnimating(true);

        setTimeout(() => {
            router.push('/register');
        }, 1500);
    };

    return (
        <div className={styles.LogContainer}>
            <motion.div className={styles.LeftBox}
                animate={isAnimating ? {
                    width: "100vw",
                    height: "100vh",
                    right: 0,
                    left: "auto",
                    borderTopRightRadius: "0px",
                    borderBottomRightRadius: "0px",
                    zIndex: 999,
                } : {}}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <div className={styles.LogLeft}>
                <h1>Witaj!</h1>
                <p>Pierwszy raz w naszym serwisie?</p>
                <Button
                    className={styles.LeftButton}
                    variant="outline"
                    onClick={handleGoToRegister}
                >
                    Zarejestruj się!
                </Button>
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