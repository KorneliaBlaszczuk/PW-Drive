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

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordMatch(e.target.value === confirmPassword);
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

    const handleRegister = async () => {
        setError(null);

        if (!name || !surname || !username || !password || !confirmPassword) {
            setError('Wszystkie pola są wymagane.');
            return;
        }

        if (!passwordMatch) {
            setError('Hasła muszą być takie same!');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    name,
                    surname
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();

                if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                    throw new Error(errorData.errors[0].message);  // Bierz pierwszy błąd
                }

                throw new Error(errorData.message || 'Rejestracja nie powiodła się.');
            }


            alert('Rejestracja udana! Zaloguj się.');
            router.push('/logIn');
        } catch (err: any) {
            setError(err.message || 'Coś poszło nie tak.');
        }
    };

    return (
        <div className={styles.RegisterContainer}>
            <motion.div
                className={styles.RightBox}
                animate={isAnimating ? {
                    x: "-60vw",
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                    borderTopRightRadius: "200px",
                    borderBottomRightRadius: "200px",
                } : {
                    x: 0,
                    borderTopLeftRadius: "200px",
                    borderBottomLeftRadius: "200px",
                    borderTopRightRadius: "0px",
                    borderBottomRightRadius: "0px",
                }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            />

            <motion.div className={styles.RegisterLeft} animate={isAnimating ? { opacity: 0, filter: "blur(10px)" } : { opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8 }}>
                <Input
                    className={styles.Input}
                    placeholder="imię"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    className={styles.Input}
                    placeholder="nazwisko"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
                <Input
                    className={styles.Input}
                    placeholder="e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    className={styles.Input}
                    placeholder="login"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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

                {error && <p className={styles.ErrorText}>{error}</p>}

                <Button className={styles.LeftButton} disabled={!passwordMatch} onClick={handleRegister}>
                    Zarejestruj
                </Button>
                <Link href="/" passHref>
                    <Button className={styles.HomeButton} variant="outline">
                        Powrót na stronę główną
                    </Button>
                </Link>
            </motion.div>

            <motion.div className={styles.RegisterRight} animate={isAnimating ? { opacity: 0, filter: "blur(10px)" } : { opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8 }}>
                <h1>Witaj z powrotem!</h1>
                <p>Masz już konto?</p>
                <Button
                    className={styles.RightButton}
                    variant="outline"
                    onClick={handleGoToLogin}
                >
                    Zaloguj się!
                </Button>
            </motion.div>
        </div>
    );
}
