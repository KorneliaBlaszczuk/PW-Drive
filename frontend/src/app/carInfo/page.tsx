'use client';

import { useEffect, useState } from "react";
import {useRouter, useSearchParams} from 'next/navigation';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import styles from './page.module.scss';
import {router} from "next/client";

type Visit = {
    createdAt: string;
    date: string;
    isReserved: boolean;
    time: string;
    car: Car;
    serviceId: number;
    id: number;
    comment: string;
    status: string;
};

type Car = {
    mileage: number;
    nextInspection: string;
    year: number;
    id: number;
    user: number;
    brand: string;
    model: string;
    name: string;
};

export default function CarInfo() {
    const searchParams = useSearchParams();
    const carId = searchParams.get('carId');
    const router = useRouter();

    const [car, setCar] = useState<Car | null>(null);
    const [visits, setVisits] = useState<Visit[]>([]);

    const [visibleUpcoming, setVisibleUpcoming] = useState(5);
    const [visibleCurrent, setVisibleCurrent] = useState(5);
    const [visibleHistory, setVisibleHistory] = useState(5);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            router.push('/logIn');
        }
    }, []);

    useEffect(() => {
        async function fetchCarById(carId: string) {
            try {
                const response = await fetch(`http://localhost:8080/api/cars/${carId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch car');

                const data: Car = await response.json();
                setCar(data);
            } catch (error) {
                console.error('Error fetching car:', error);
            }
        }

        async function fetchCarVisits(carId: string) {
            try {
                const response = await fetch(`http://localhost:8080/api/cars/${carId}/visits`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch visits');

                const data: Visit[] = await response.json();
                setVisits(data);
            } catch (error) {
                console.error('Error fetching visits:', error);
            }
        }

        if (carId) {
            fetchCarById(carId);
            fetchCarVisits(carId);
        }
    }, [carId]);

    const upcomingVisits = visits.filter(v => v.status === "upcoming");
    const currentVisits = visits.filter(v => v.status === "current");
    const historyVisits = visits.filter(v => v.status === "history");

    const handleShowMoreUpcoming = () => setVisibleUpcoming(prev => prev + 5);
    const handleShowLessUpcoming = () => setVisibleUpcoming(5);

    const handleShowMoreCurrent = () => setVisibleCurrent(prev => prev + 5);
    const handleShowLessCurrent = () => setVisibleCurrent(5);

    const handleShowMoreHistory = () => setVisibleHistory(prev => prev + 5);
    const handleShowLessHistory = () => setVisibleHistory(5);

    return (
        <div className={styles.carInfo}>
        <div className={styles.leftSection}>
            <h1 className={styles.infoHeader}>Informacje o samochodzie</h1>

            {car ? (
                <div className={styles.carDetails}>
                    <p><strong>Nazwa:</strong> {car.name}</p>
                    <p><strong>Marka:</strong> {car.brand}</p>
                    <p><strong>Model:</strong> {car.model}</p>
                    <p><strong>Rocznik:</strong> {car.year}</p>
                    <p><strong>Przebieg:</strong> {car.mileage} km</p>
                    <p>
                        <strong>Następny przegląd:</strong>{' '}
                        {car.nextInspection || 'Brak informacji'}
                    </p>
                </div>
            ) : (
                <p>Ładowanie danych samochodu...</p>
            )}
        </div>

            <div className={styles.rightSection}>
                <h2 className={styles.name}>Wizyty</h2>
                <div className={styles.visitsAccordion}>
                {visits.length > 0 ? (
                    <Accordion type="multiple" className="w-full">

                        {/* Nadchodzące */}
                        <AccordionItem value="upcoming">
                            <AccordionTrigger className="text-xl mt-4">Nadchodzące</AccordionTrigger>
                            <AccordionContent>
                                {upcomingVisits.slice(0, visibleUpcoming).map(visit => (
                                    <div key={visit.id} className="flex justify-between items-center p-3 bg-blue-100 rounded-lg mb-2">
                                    <span>
                                        {visit.id} {visit.date} {visit.time} — {visit.car.name}
                                    </span>
                                        <Button variant="link" className="text-primary">Pobierz raport →</Button>
                                    </div>
                                ))}

                                <div className="flex justify-center mt-2 space-x-2">
                                    {visibleUpcoming < upcomingVisits.length && (
                                        <Button variant="ghost" onClick={handleShowMoreUpcoming}>
                                            Pokaż więcej
                                        </Button>
                                    )}
                                    {visibleUpcoming > 5 && (
                                        <Button variant="ghost" onClick={handleShowLessUpcoming}>
                                            Pokaż mniej
                                        </Button>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Aktualne */}
                        <AccordionItem value="current">
                            <AccordionTrigger className="text-xl mt-4">Aktualne</AccordionTrigger>
                            <AccordionContent>
                                {currentVisits.slice(0, visibleCurrent).map(visit => (
                                    <div key={visit.id} className="flex justify-between items-center p-3 bg-blue-100 rounded-lg mb-2">
                                    <span>
                                        {visit.id} {visit.date} {visit.time} — {visit.car.name}
                                    </span>
                                        <Button variant="link" className="text-primary">Pobierz raport →</Button>
                                    </div>
                                ))}

                                <div className="flex justify-center mt-2 space-x-2">
                                    {visibleCurrent < currentVisits.length && (
                                        <Button variant="ghost" onClick={handleShowMoreCurrent}>
                                            Pokaż więcej
                                        </Button>
                                    )}
                                    {visibleCurrent > 5 && (
                                        <Button variant="ghost" onClick={handleShowLessCurrent}>
                                            Pokaż mniej
                                        </Button>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Historia */}
                        <AccordionItem value="history">
                            <AccordionTrigger className="text-xl mt-4">Historia</AccordionTrigger>
                            <AccordionContent>
                                {historyVisits.slice(0, visibleHistory).map(visit => (
                                    <div key={visit.id} className="flex justify-between items-center p-3 bg-blue-100 rounded-lg mb-2">
                                    <span>
                                        {visit.serviceId} {visit.date} {visit.time} — {visit.car.name}
                                    </span>
                                        <Button variant="link" className="text-primary">Pobierz raport →</Button>
                                    </div>
                                ))}

                                <div className="flex justify-center mt-2 space-x-2">
                                    {visibleHistory < historyVisits.length && (
                                        <Button variant="ghost" onClick={handleShowMoreHistory}>
                                            Pokaż więcej
                                        </Button>
                                    )}
                                    {visibleHistory > 5 && (
                                        <Button variant="ghost" onClick={handleShowLessHistory}>
                                            Pokaż mniej
                                        </Button>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                ) : (
                    <p>Brak zaplanowanych wizyt dla tego samochodu.</p>
                )}
                </div>
            </div>
        </div>
    );
}
