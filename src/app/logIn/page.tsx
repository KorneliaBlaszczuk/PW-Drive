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
                    x: "60vw",
                    borderTopRightRadius: "0px",
                    borderBottomRightRadius: "0px",
                    borderTopLeftRadius: "200px",
                    borderBottomLeftRadius: "200px",
                } : {
                    x: 0,
                    borderTopRightRadius: "200px",
                    borderBottomRightRadius: "200px",
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <motion.div className={styles.LogLeft} animate={isAnimating ? { opacity: 0, filter: "blur(10px)" } : { opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8 }}>
                <h1>Witaj!</h1>
                <p>Pierwszy raz w naszym serwisie?</p>
                <Button
                    className={styles.LeftButton}
                    variant="outline"
                    onClick={handleGoToRegister}
                >
                    Zarejestruj się!
                </Button>
            </motion.div>
            <motion.div className={styles.LogRight} animate={isAnimating ? { opacity: 0, filter: "blur(10px)" } : { opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8 }}>
                <img className={styles.appLogo} src='/logo_black.png' alt='App logo black' />
                <Input className={styles.Input} placeholder="login" />
                <Input className={styles.Input} placeholder="hasło" type="password" />
                <Button className={styles.RightButton}>Zaloguj</Button>
                <Link href="/" passHref>
                    <Button className={styles.HomeButton} variant="outline">
                        Powrót na stronę główną
                    </Button>
                </Link>
            </motion.div>
        </div>
    )
}