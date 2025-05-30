'use client'

import styles from '../styles/App.module.scss';
import { useEffect, useState } from 'react';

export default function Home() {
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
    <div className={styles.App}>
      <main className={styles.AppContent}>
        <div className={styles.HomeLeft}>
          <h1>{companyName}</h1>
          <ul className={styles.Offer}>
            <li><img className={styles.Icons} src="https://img.icons8.com/ios/50/maintenance--v1.png" alt="maintenance--v1" />Naprawy</li>
            <li><img className={styles.Icons} src="https://img.icons8.com/ios/50/inspection.png" alt="inspection" />Przeglądy</li>
            <li><img className={styles.Icons} src="https://img.icons8.com/badges/48/tire.png" alt="tire" />Wymiana opon</li>
          </ul>
        </div>
        <img className={styles.HomeRight} src="/auto.png" alt="car picture" />
      </main>
    </div>
  );
}
