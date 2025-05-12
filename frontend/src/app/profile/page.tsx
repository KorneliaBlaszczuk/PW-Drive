'use client'

import { useState, useEffect } from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import styles from './page.module.scss';

type Visit = {
    created_at: string
    date: string
    is_reserved: boolean
    time: string
    id_car: number
    id_service: number
    id_visit: number
    comment: string
    status: string
}

type Car = {
    mileage: number
    next_inspection: string
    year: number
    id_car: number
    id_user: number
    brand: string
    model: string
    name: string
}

export default function Profile() {
    const [visits, setVisits] = useState<Visit[]>([])
    const [cars, setCars] = useState<Car[]>([])
    const [userId, setUserId] = useState<string | null>(null);

    const [visibleUpcoming, setVisibleUpcoming] = useState(5)
    const [visibleCurrent, setVisibleCurrent] = useState(5)
    const [visibleHistory, setVisibleHistory] = useState(5)

    const [visibleCars, setVisibleCars] = useState(3) // Set the max number of cars to show

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('id');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            async function fetchVisits() {
                try {
                    const response = await fetch(`http://localhost:8080/api/users/${userId}/visits`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch visits');
                    }

                    const data = await response.json();
                    setVisits(data);
                } catch (error) {
                    console.error('Error fetching visits:', error);
                }
            }

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

            fetchVisits();
            fetchCars();
        } else {
            console.log("Brak userId, zapytanie nie zostało wysłane");
        }
    }, [userId]);

    // Filter visits based on status
    const upcomingVisits = visits.filter(v => v.status === "upcoming");
    const currentVisits = visits.filter(v => v.status === "current");
    const historyVisits = visits.filter(v => v.status === "history");

    // Handle the "Show More" / "Show Less" actions for visits
    const handleShowMoreUpcoming = () => setVisibleUpcoming(prev => prev + 5);
    const handleShowLessUpcoming = () => setVisibleUpcoming(5);

    const handleShowMoreCurrent = () => setVisibleCurrent(prev => prev + 5);
    const handleShowLessCurrent = () => setVisibleCurrent(5);

    const handleShowMoreHistory = () => setVisibleHistory(prev => prev + 5);
    const handleShowLessHistory = () => setVisibleHistory(5);

    // Handle the "Show More" / "Show Less" actions for cars
    const handleShowMoreCars = () => setVisibleCars(prev => prev + 3);
    const handleShowLessCars = () => setVisibleCars(3);

    return (
        <div className={styles.profilePage}>
            <div className={styles.leftSection}>
                <h2 className={styles.visitsHeader}>Twoje wizyty:</h2>
                <Accordion type="multiple" className="w-full">

                    {/* Nadchodzące */}
                    <AccordionItem value="upcoming">
                        <AccordionTrigger>Nadchodzące</AccordionTrigger>
                        <AccordionContent>
                            {upcomingVisits.slice(0, visibleUpcoming).map(visit => (
                                <div key={visit.id_visit} className="flex justify-between items-center p-3 bg-blue-100 rounded-lg mb-2">
                                    <span>
                                        {visit.service_name} {visit.date} {visit.time} — {visit.car_brand} {visit.car_model}
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
                        <AccordionTrigger>Aktualne</AccordionTrigger>
                        <AccordionContent>
                            {currentVisits.slice(0, visibleCurrent).map(visit => (
                                <div key={visit.id_visit} className="flex justify-between items-center p-3 bg-blue-100 rounded-lg mb-2">
                                    <span>
                                        {visit.service_name} {visit.date} {visit.time} — {visit.car_brand} {visit.car_model}
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
                        <AccordionTrigger>Historia</AccordionTrigger>
                        <AccordionContent>
                            {historyVisits.slice(0, visibleHistory).map(visit => (
                                <div key={visit.id_visit} className="flex justify-between items-center p-3 bg-blue-100 rounded-lg mb-2">
                                    <span>
                                        {visit.service_name} {visit.date} {visit.time} — {visit.car_brand} {visit.car_model}
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
            </div>

            {/* Right section for cars and user name */}
            <div className={styles.rightSection}>
                <div className={styles.userName}>Witaj, użytkowniku</div>
                <h2 className={styles.carsHeader}>Twoje samochody</h2>
                <div className="space-y-4">
                    {cars.slice(0, visibleCars).map(car => (
                        <div key={car.id_car}
                             className="flex justify-between items-center p-3 bg-gray-100 rounded-lg mb-2">
                            <span>
                                {car.brand} {car.model} ({car.year})
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-2 space-x-2">
                    {visibleCars < cars.length && (
                        <Button variant="ghost" onClick={handleShowMoreCars}>
                            Pokaż więcej
                        </Button>
                    )}
                    {visibleCars > 3 && (
                        <Button variant="ghost" onClick={handleShowLessCars}>
                            Pokaż mniej
                        </Button>
                    )}
                </div>

                <div className="flex justify-center mt-4">
                    <Button>
                        Dodaj samochód
                    </Button>
                </div>
            </div>
        </div>
    )
}
