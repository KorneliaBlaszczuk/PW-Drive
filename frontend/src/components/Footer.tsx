'use client'

import styles from '../styles/Footer.module.scss';
import { useEffect, useState } from 'react';

export default function Footer() {
    const [companyName, setCompanyName] = useState('');

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

                if (data?.companyName) {
                    setCompanyName(data.companyName);
                }

            } catch (error) {
                console.error('Error fetching company info:', error);
            }
        }

        fetchCompanyInfo();
    }, []);

    return (
        <footer className={styles.appFooter}>
            <p>&copy; 2025 {companyName}</p>
            <p className={styles.appIcons}>Icons by&nbsp;<a href='https://icons8.com/'>icons8</a></p>
        </footer>
    );
}
