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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleGoToRegister = () => {
        setIsAnimating(true);

        setTimeout(() => {
            router.push('/register');
        }, 1500);
    };

    const handleLogin = async () => {
        setError(null); // Clear previous errors

        try {
            const res = await fetch('http://localhost:8080/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                throw new Error('Błędny login lub hasło');
            }

            const data = await res.json();
            const token = data.accessToken;
            const role = data.roles;
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('role', role)

            // redirect to home page
            router.push('/');

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        }
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
                <Input className={styles.Input}
                    placeholder="login"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                <Input className={styles.Input}
                    placeholder="hasło"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                {error && (
                    <div className={styles.errorMessage}>
                        <p>{error}</p>
                    </div>
                )}
                <Button className={styles.RightButton} onClick={handleLogin}>Zaloguj</Button>
                <Link href="/" passHref>
                    <Button className={styles.HomeButton} variant="outline">
                        Powrót na stronę główną
                    </Button>
                </Link>
            </motion.div>
        </div>
    )
}