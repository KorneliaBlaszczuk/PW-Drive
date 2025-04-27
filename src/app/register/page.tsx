'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.scss';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';

export default function Register() {
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setPasswordMatch(e.target.value === password);
    };

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    const handleGoToLogin = () => {
        setIsAnimating(true);

        setTimeout(() => {
            router.push('/logIn');
        }, 1500);
    };

    return (
        <div className={styles.RegisterContainer}>
            <motion.div
                className={styles.RightBox}
                animate={isAnimating ? {
                    width: "100vw",
                    height: "100vh",
                    left: 0,
                    right: "auto",
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                    zIndex: 999,
                } : {}}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <div className={styles.RegisterLeft}>
                <Input
                    className={styles.Input}
                    placeholder="imię"
                />
                <Input
                    className={styles.Input}
                    placeholder="nazwisko"
                />
                <Input
                    className={styles.Input}
                    placeholder="login"
                />
                <div className={styles.PasswordContainer}>
                    <Input
                        className={styles.Input}
                        placeholder="hasło"
                        type={passwordVisible ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <img
                        src={passwordVisible
                            ? "https://img.icons8.com/fluency-systems-regular/48/visible--v1.png"
                            : "https://img.icons8.com/fluency-systems-regular/48/hide.png"}
                        alt="toggle visibility"
                        className={styles.PasswordToggle}
                        onClick={togglePasswordVisibility}
                    />
                </div>
                <div className={styles.PasswordContainer}>
                    <Input
                        className={styles.Input}
                        placeholder="ponów hasło"
                        type={confirmPasswordVisible ? "text" : "password"}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                    <img
                        src={confirmPasswordVisible
                            ? "https://img.icons8.com/fluency-systems-regular/48/visible--v1.png"
                            : "https://img.icons8.com/fluency-systems-regular/48/hide.png"}
                        alt="toggle visibility"
                        className={styles.PasswordToggle}
                        onClick={toggleConfirmPasswordVisibility}
                    />
                </div>
                {!passwordMatch && (
                    <p className={styles.ErrorText}>Hasła muszą być takie same!</p>
                )}
                <Button className={styles.LeftButton} disabled={!passwordMatch}>
                    Zarejestruj
                </Button>
                <Link href="/" passHref>
                    <Button className={styles.HomeButton} variant="outline">
                        Powrót na stronę główną
                    </Button>
                </Link>
            </div>

            <div className={styles.RegisterRight}>
                <h1>Witaj z powrotem!</h1>
                <p>Masz już konto?</p>
                <Button
                    className={styles.RightButton}
                    variant="outline"
                    onClick={handleGoToLogin}
                >
                    Zaloguj się!
                </Button>
            </div>
        </div>
    );
}
