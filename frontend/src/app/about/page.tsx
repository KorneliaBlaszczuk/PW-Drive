'use client'

import styles from './page.module.scss';
import { useEffect, useState } from 'react';

export default function About() {
    const [description, setDescription] = useState('');

    useEffect(() => {
        async function fetchCompanyInfo() {
            try {
                const response = await fetch('http://localhost:8080/api/metadata/info', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch company info');
                }

                const data = await response.json();

                if (data?.description) {
                    setDescription(data.description);
                }

            } catch (error) {
                console.error('Error fetching company info:', error);
            }
        }

        fetchCompanyInfo();
    }, []);

    return (
        <div className={styles.aboutContainer}>
            <div className={styles.aboutText}>
                <h2>O nas</h2>
                {description
                    ? description
                        .split(/\n{1,}/)
                        .map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))
                    : <p>Ładowanie opisu...</p>}
            </div>
            <div>
                <img className={styles.appLogo} src='/logo_black.png' alt='App logo black' />
            </div>
        </div>
    )
}