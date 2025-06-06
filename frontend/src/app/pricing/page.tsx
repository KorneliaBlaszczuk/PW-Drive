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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Service = {
    id: number | null;
    name: string;
    price: number;
    time: string;
};

function formatTime(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return duration;

    const [, h, m] = match;
    const parts = [];
    if (h) parts.push(`${h} h`);
    if (m) parts.push(`${m} min`);
    return parts.join(' ');
}

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
        setTempServices([...services]);
        setIsEditing(true);
        setServices(prev => [
            ...prev,
            {
                id: null,
                name: '',
                price: 0,
                time: ''
            } as Service
        ]);
    };

    const handleCancel = () => {
        setServices(tempServices);
        setIsEditing(false);
    };

    const handleSave = async () => {
        for (const service of services) {
            if (service.id === null) continue;
            try {
                const response = await fetch(`http://localhost:8080/api/services/${service.id}`, {
                    method: 'PUT',
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
        window.location.reload();
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
                throw new Error(`Failed to delete service ${id}`);
            }

            setServices(prev => prev.filter(s => s.id !== id));
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdd = async () => {
        const lastService = services[services.length - 1];
        try {
            const response = await fetch('http://localhost:8080/api/services', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: lastService.id,
                    name: lastService.name,
                    price: lastService.price,
                    time: lastService.time
                }),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                const errorMessages = errorBody.errors?.map((e: any) => e.message).join('\n') || errorBody.message;
                alert(`Add failed: ${errorMessages}`);
                return;
            }
            const createdService = await response.json();

            // Replace the last (blank) service with the newly created one
            setServices(prev => [
                ...prev.slice(0, prev.length - 1),
                createdService,
                {
                    id: null,
                    name: '',
                    price: 0,
                    time: ''
                } as Service
            ]);
        } catch (error) {
            console.error(error);
        }
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
                            <TableHead className={styles.tableCell}>Czas</TableHead>
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
                                <TableCell className={styles.tableCell}>{isEditing ? (
                                    <Select
                                        value={service.time}
                                        onValueChange={(value) => handleChange(service.id, 'time', value)}
                                    >
                                        <SelectTrigger className={styles.Select}>
                                            <SelectValue placeholder={service.time} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PT15M">15 min</SelectItem>
                                            <SelectItem value="PT20M">20 min</SelectItem>
                                            <SelectItem value="PT30M">30 min</SelectItem>
                                            <SelectItem value="PT45M">45 min</SelectItem>
                                            <SelectItem value="PT1H">1 hour</SelectItem>
                                            <SelectItem value="PT1H30M">1.5 hours</SelectItem>
                                            <SelectItem value="PT2H">2 hours</SelectItem>
                                            <SelectItem value="PT2H30M">2.5 hours</SelectItem>
                                            <SelectItem value="PT3H">3 hours</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    `${formatTime(service.time)}`
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
                <p>Nie ma tego czego szukasz? Umów się na naprawę i uzgodnij szczegóły na miejscu.</p>
            </div>
            <div className={styles.rightContainer}>
                <img className={styles.appLogo} src='/logo_black.png' alt='App logo black' />
            </div>
        </div >
    )
}