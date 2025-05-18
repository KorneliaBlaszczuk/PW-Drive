'use client'

import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

export default function About() {
    const [description, setDescription] = useState('');
    const [isAdmin, setAdmin] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [originalData, setOriginalData] = useState<any>(null);
    const [tempDescription, setTempDescription] = useState('');

    useEffect(() => {
        const role = sessionStorage.getItem('role');
        if (role == "WORKSHOP") {
            setAdmin(true);
        }
    }, []);

    useEffect(() => {
        async function fetchCompanyInfo() {
            try {
                let response;

                if (isAdmin) {
                    response = await fetch('http://localhost:8080/api/metadata/info-full', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        },
                    });
                } else {
                    response = await fetch('http://localhost:8080/api/metadata/info', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch company info');
                }

                const data = await response.json();

                if (data?.description) {
                    setDescription(data.description);
                    setOriginalData(data);
                }

            } catch (error) {
                console.error('Error fetching company info:', error);
            }
        }

        fetchCompanyInfo();
    }, []);

    const handleEdit = () => {
        setTempDescription(description);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDescription(tempDescription);
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!originalData) return;

        const body = {
            ...originalData,
            description: description,
        };

        try {
            const res = await fetch('http://localhost:8080/api/metadata/1', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error('Błąd aktualizacji');

            setIsEditing(false);
        } catch (err) {
            console.error('Nie udało się zaktualizować:', err);
        }
    };

    return (
        <div className={styles.aboutContainer}>
            <div className={styles.aboutText}>
                <h2>
                    O nas{" "}
                    {isAdmin && !isEditing && (
                        <img
                            onClick={handleEdit}
                            style={{ cursor: 'pointer' }}
                            width="20"
                            height="20"
                            src="https://img.icons8.com/ios/50/edit--v1.png"
                            alt="edit--v1"
                        />
                    )}
                </h2>
                {isEditing ? (
                    <>
                        <textarea
                            rows={12}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.textarea}
                        />
                        <div className={styles.buttonGroup}>
                            <Button onClick={handleSave} className={styles.saveButton}>Zapisz</Button>
                            <Button onClick={handleCancel} className={styles.cancelButton}>Anuluj</Button>
                        </div>
                    </>
                ) : (
                    description.split('\n').map((p, i) => <p key={i}>{p}</p>)
                )}
            </div>
            <div>
                <img className={styles.appLogo} src='/logo_black.png' alt='App logo black' />
            </div>
        </div>
    )
}