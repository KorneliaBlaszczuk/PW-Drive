'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

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

    const [car, setCar] = useState<Car | null>(null);
    const [visits, setVisits] = useState<Visit[]>([]);

    const [visibleUpcoming, setVisibleUpcoming] = useState(5);
    const [visibleCurrent, setVisibleCurrent] = useState(5);
    const [visibleHistory, setVisibleHistory] = useState(5);

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

    const renderVisits = (data: Visit[], visible: number) =>
        data.slice(0, visible).map(visit => (
            <div
                key={visit.id}
                className="flex justify-between items-center p-3 bg-blue-100 rounded-lg mb-2"
            >
                <span>
                    {visit.date} {visit.time} — Komentarz: {visit.comment || '—'}
                </span>
                <Button variant="link" className="text-primary">Pobierz raport →</Button>
            </div>
        ));

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Informacje o samochodzie</h1>

            {car ? (
                <div className="mb-6">
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

            <h2 className="text-xl font-semibold mt-8 mb-4">Wizyty</h2>
            {visits.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                    {/* Upcoming */}
                    <AccordionItem value="upcoming">
                        <AccordionTrigger className="text-lg">Nadchodzące</AccordionTrigger>
                        <AccordionContent>
                            {renderVisits(upcomingVisits, visibleUpcoming)}

                            <div className="flex justify-center mt-2 space-x-2">
                                {visibleUpcoming < upcomingVisits.length && (
                                    <Button variant="ghost" onClick={() => setVisibleUpcoming(v => v + 5)}>
                                        Pokaż więcej
                                    </Button>
                                )}
                                {visibleUpcoming > 5 && (
                                    <Button variant="ghost" onClick={() => setVisibleUpcoming(5)}>
                                        Pokaż mniej
                                    </Button>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Current */}
                    <AccordionItem value="current">
                        <AccordionTrigger className="text-lg">Aktualne</AccordionTrigger>
                        <AccordionContent>
                            {renderVisits(currentVisits, visibleCurrent)}

                            <div className="flex justify-center mt-2 space-x-2">
                                {visibleCurrent < currentVisits.length && (
                                    <Button variant="ghost" onClick={() => setVisibleCurrent(v => v + 5)}>
                                        Pokaż więcej
                                    </Button>
                                )}
                                {visibleCurrent > 5 && (
                                    <Button variant="ghost" onClick={() => setVisibleCurrent(5)}>
                                        Pokaż mniej
                                    </Button>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* History */}
                    <AccordionItem value="history">
                        <AccordionTrigger className="text-lg">Historia</AccordionTrigger>
                        <AccordionContent>
                            {renderVisits(historyVisits, visibleHistory)}

                            <div className="flex justify-center mt-2 space-x-2">
                                {visibleHistory < historyVisits.length && (
                                    <Button variant="ghost" onClick={() => setVisibleHistory(v => v + 5)}>
                                        Pokaż więcej
                                    </Button>
                                )}
                                {visibleHistory > 5 && (
                                    <Button variant="ghost" onClick={() => setVisibleHistory(5)}>
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
    );
}
