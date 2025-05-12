"use client"

import { useState, useEffect } from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import styles from './page.module.scss';

type Visit = {
    id_visit: number
    service_name: string
    car_brand: string
    car_model: string
    date: string
    time: string
    status: "upcoming" | "current" | "history"
}

export default function Profile() {
    const [visits, setVisits] = useState<Visit[]>([])

    const [visibleUpcoming, setVisibleUpcoming] = useState(5)
    const [visibleCurrent, setVisibleCurrent] = useState(5)
    const [visibleHistory, setVisibleHistory] = useState(5)

    useEffect(() => {
        async function fetchVisits() {
            // Tymczasowe dane, zeby bylo widac moja hard work gguys
            const data: Visit[] = [
                { id_visit: 1, service_name: "Przegląd", car_brand: "Mazda", car_model: "CX-5", date: "2024-05-26", time: "16:00", status: "upcoming" },
                { id_visit: 2, service_name: "Naprawa", car_brand: "Toyota", car_model: "Corolla", date: "2024-08-26", time: "14:00", status: "upcoming" },
                { id_visit: 3, service_name: "Przegląd", car_brand: "Ford", car_model: "Focus", date: "2024-05-01", time: "12:00", status: "current" },
                { id_visit: 4, service_name: "Naprawa", car_brand: "BMW", car_model: "X5", date: "2024-04-15", time: "09:00", status: "history" },
                { id_visit: 5, service_name: "Przegląd", car_brand: "Honda", car_model: "Civic", date: "2024-04-20", time: "11:00", status: "history" },
                { id_visit: 6, service_name: "Naprawa", car_brand: "Audi", car_model: "A4", date: "2024-03-10", time: "13:00", status: "history" },
                { id_visit: 7, service_name: "Przegląd", car_brand: "Mercedes", car_model: "GLA", date: "2024-02-18", time: "10:00", status: "history" },
                { id_visit: 8, service_name: "Naprawa", car_brand: "Opel", car_model: "Astra", date: "2024-01-12", time: "08:30", status: "history" },
                { id_visit: 9, service_name: "Naprawa", car_brand: "Opel", car_model: "A4", date: "2024-01-12", time: "08:30", status: "history" },
            ]
            setVisits(data)
        }

        fetchVisits()
    }, [])

    const upcomingVisits = visits.filter(v => v.status === "upcoming")
    const currentVisits = visits.filter(v => v.status === "current")
    const historyVisits = visits.filter(v => v.status === "history")

    const handleShowMoreUpcoming = () => setVisibleUpcoming(prev => prev + 5)
    const handleShowLessUpcoming = () => setVisibleUpcoming(5)

    const handleShowMoreCurrent = () => setVisibleCurrent(prev => prev + 5)
    const handleShowLessCurrent = () => setVisibleCurrent(5)

    const handleShowMoreHistory = () => setVisibleHistory(prev => prev + 5)
    const handleShowLessHistory = () => setVisibleHistory(5)

    return (
        <div className={styles.profilePage}>
            <div className={styles.visits}>
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
            <div className={styles.profileInfo}>
                <h1>Witaj!</h1>
                <h2>Twoje samochody</h2>
            </div>
        </div>
    )
}
