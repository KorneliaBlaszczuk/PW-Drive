'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link';;

export default function Register() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        // Sprawdzamy czy hasła w hasło i powtórz hasło są takie same
        setPasswordMatch(e.target.value === password);
    };

    // Przełączanie widoczności
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    return (
        <div className={styles.RegisterContainer}>
            <div className={styles.RightBox}></div>
            <div className={styles.RegisterLeft}>
                <Input className={styles.Input} placeholder="imię" />
                <Input className={styles.Input} placeholder="nazwisko" />
                <Input className={styles.Input} placeholder="login" />
                <div className={styles.PasswordContainer}>
                    <Input className={styles.Input} placeholder="hasło" type={passwordVisible ? "text" : "password"} value={password} onChange={handlePasswordChange} />
                    <img
                        src={passwordVisible ? "https://img.icons8.com/fluency-systems-regular/48/visible--v1.png" : "https://img.icons8.com/fluency-systems-regular/48/hide.png"}
                        alt="toggle visibility"
                        className={styles.PasswordToggle}
                        onClick={togglePasswordVisibility}
                    />
                </div>
                <div className={styles.PasswordContainer}>
                    <Input className={styles.Input} placeholder="ponów hasło" type={confirmPasswordVisible ? "text" : "password"} value={confirmPassword} onChange={handleConfirmPasswordChange} />
                    <img
                        src={confirmPasswordVisible ? "https://img.icons8.com/fluency-systems-regular/48/visible--v1.png" : "https://img.icons8.com/fluency-systems-regular/48/hide.png"}
                        alt="toggle visibility"
                        className={styles.PasswordToggle}
                        onClick={toggleConfirmPasswordVisibility}
                    />
                </div>
                {!passwordMatch && <p className={styles.ErrorText}>Hasła muszą być takie same!</p>}
                <Button className={styles.LeftButton} disabled={!passwordMatch}>Zarejestruj</Button>
            </div>
            <div className={styles.RegisterRight}>
                <h1>Witaj z powrotem!</h1>
                <p>Masz juz konto?</p>
                <Link href="/logIn" passHref>
                    <Button className={styles.RightButton} variant="outline">Zaloguj się!</Button>
                </Link>
            </div>
        </div>
    )
}