"use client"

'use client'

import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type Service = {
    id: number | null;
    name: string;
    price: number;
    time: string;
};

export default function Pricing() {
    const [services, setServices] = useState<Service[]>([]);
    const [isAdmin, setAdmin] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [tempServices, setTempServices] = useState<Service[]>([]);

    useEffect(() => {
        const role = sessionStorage.getItem('role');
        if (role == "WORKSHOP") {
            setAdmin(true);
        }
    }, []);

    useEffect(() => {
        async function fetchServices() {
            try {
                const response = await fetch('http://localhost:8080/api/services', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch company info');
                }

                const data = await response.json();

                setServices(data);

            } catch (error) {
                console.error('Error fetching company info:', error);
            }
        }

        fetchServices();
    }, []);

    const handleEdit = () => {
        setTempServices(services);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setServices(tempServices);
        setIsEditing(false);
    };

    const handleSave = async () => {
        for (const service of services) {
            const method = service.id === null ? 'POST' : 'PUT';
            const url = service.id === null
                ? 'http://localhost:8080/api/services'
                : `http://localhost:8080/api/services/${service.id}`;

            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: service.id,
                        name: service.name,
                        price: service.price,
                        time: service.time
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to update service ${service.id}`);
                }
            } catch (error) {
                console.error(error);
            }
        }
        setIsEditing(false);
    };

    const handleChange = (id: number | null, field: keyof Service, value: string) => {
        setServices(prev =>
            prev.map(s =>
                s.id === id ? { ...s, [field]: field === 'price' ? parseFloat(value) : value } : s
            )
        );
    };

    const handleDelete = async (id?: number | null) => {
        if (id === null) return;
        try {
            const response = await fetch(`http://localhost:8080/api/services/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Nie udało się usunąć usługi ${id}`);
            }

            setServices(prev => prev.filter(s => s.id !== id));
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = () => {
        setServices(prev => [
            ...prev,
            {
                id: null,
                name: '',
                price: 0,
                time: 'PT2H'
            } as Service
        ]);
    };

    return (
        <div className={styles.pricing}>
            <div className={styles.leftContainer}>
                <h1 className={styles.name}>CENNIK</h1>
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
                {isAdmin && isEditing && (
                    <div className={styles.buttonGroup}>
                        <Button onClick={handleSave} className={styles.saveButton}>Zapisz</Button>
                        <Button onClick={handleCancel} className={styles.cancelButton}>Anuluj</Button>
                    </div>
                )}
                <Table className={styles.table}>
                    <TableHeader>
                        <TableRow className={styles.tableHeaders}>
                            <TableHead className={styles.tableCell}>Usługa</TableHead>
                            <TableHead className={styles.tableCell}>Cena</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className={styles.tableBody}>
                        {services.map(service => (
                            <TableRow key={service.id}>
                                <TableCell className={styles.tableCell}>{isEditing ? (
                                    <input
                                        type="text"
                                        value={service.name}
                                        onChange={(e) => handleChange(service.id, 'name', e.target.value)}
                                    />
                                ) : (
                                    service.name
                                )}</TableCell>
                                <TableCell className={styles.tableCell}>{isEditing ? (
                                    <input
                                        type="number"
                                        value={service.price}
                                        onChange={(e) => handleChange(service.id, 'price', e.target.value)}
                                    />
                                ) : (
                                    `${service.price} PLN`
                                )}</TableCell>
                                {isEditing && (
                                    <TableCell className={styles.tableCell}>
                                        <button onClick={() => handleDelete(service.id)}>🗑</button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {isAdmin && isEditing && (
                    <Button onClick={handleAdd} className={styles.addButton}>Dodaj</Button>
                )}
            </div>
            <div className={styles.rightContainer}>
                <img className={styles.appLogo} src='/logo_black.png' alt='App logo black' />
            </div>
        </div >
    )
}