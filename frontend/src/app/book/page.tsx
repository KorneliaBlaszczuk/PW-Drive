'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import styles from './page.module.scss';
import { router } from "next/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import WeekCalendar from "@/components/WeekCalendar";
import { Button } from "@/components/ui/button";

type Car = {
    mileage: number
    nextInspection: string
    year: number
    id: number
    id_user: number
    brand: string
    model: string
    name: string
}

const exampleSlots = [
    { date: "2025-05-19", times: ["09:00", "11:00", "13:00"] },
    { date: "2025-05-21", times: ["10:00", "14:00"] },
    { date: "2025-05-23", times: ["08:00", "12:00", "16:00"] },
];

export default function Book() {
    const router = useRouter();
    const [cars, setCars] = useState<Car[]>([])
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
    const [reservationConfirmed, setReservationConfirmed] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('id');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            router.push('/logIn');
        }
    }, []);

    useEffect(() => {
        if (userId) {
            async function fetchCars() {
                try {
                    const response = await fetch(`http://localhost:8080/api/users/${userId}/cars`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch cars');
                    }

                    const data = await response.json();
                    setCars(data);
                } catch (error) {
                    console.error('Error fetching cars:', error);
                }
            }

            fetchCars();
        } else {
            console.log("Brak userId, zapytanie nie zostało wysłane");
        }
    }, [userId]);

    const handleSelectSlot = (date: string, time: string) => {
        setSelectedSlot({ date, time });
    };

    const handleReservation = () => {
        if (selectedCarId && selectedService && selectedSlot) {
            alert(`Zarezerwowano ${selectedService} na ${selectedSlot.date} ${selectedSlot.time}`);
            // fetch POST
        }
    };

    const selectedCar = cars.find(car => car.id.toString() === selectedCarId);

    return (
        <div className={styles.BookPage}>
            <Select onValueChange={(value) => setSelectedCarId(value)}>
                <SelectTrigger className={styles.Select}>
                    <SelectValue placeholder="Wybierz swoje auto" />
                </SelectTrigger>
                <SelectContent>
                    {cars.map((car) => (
                        <SelectItem key={car.id} value={car.id.toString()}>
                            {car.brand} {car.model} ({car.year})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => setSelectedService(value)}>
                <SelectTrigger className={styles.Select}>
                    <SelectValue placeholder="Wybierz usługę" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="naprawa">Naprawa</SelectItem>
                    <SelectItem value="wymiana_opon">Wymiana opon</SelectItem>
                    <SelectItem value="przegląd">Przegląd</SelectItem>
                </SelectContent>
            </Select>
            <h1>Najblisze dostępne wizyty:</h1>
            <WeekCalendar slots={exampleSlots} onSelectSlot={handleSelectSlot} />

            {selectedCar && selectedService && selectedSlot && (
                <div className={styles.Summary}>
                    <p>{selectedService} {selectedSlot.date} {selectedSlot.time} {selectedCar.name}</p>
                    <Button
                        onClick={handleReservation}
                        className={styles.BookButton}
                    >
                        Zarezerwuj
                    </Button>
                </div>
            )}
        </div>
    )
}