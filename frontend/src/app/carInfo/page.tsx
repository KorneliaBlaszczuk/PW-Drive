"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { generateVisitReport } from "@/lib/generateVisitReport";
import {Visit} from "@/types/visit";
import {Car} from "@/types/car";
import styles from "./page.module.scss";
import Link from "next/link";

export default function CarInfo() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const router = useRouter();

  const [car, setCar] = useState<Car | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);

  const [visibleUpcoming, setVisibleUpcoming] = useState(5);
  const [visibleCurrent, setVisibleCurrent] = useState(5);
  const [visibleHistory, setVisibleHistory] = useState(5);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCar, setEditedCar] = useState<Car | null>(null);


  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/logIn");
    }
  }, []);

  useEffect(() => {
    async function fetchCarById(carId: string) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/cars/${carId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch car");

        const data: Car = await response.json();
        setCar(data);
      } catch (error) {
        console.error("Error fetching car:", error);
      }
    }

    async function fetchCarVisits(carId: string) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/cars/${carId}/visits`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch visits");

        const data: Visit[] = await response.json();
        setVisits(data);
      } catch (error) {
        console.error("Error fetching visits:", error);
      }
    }

    if (carId) {
      fetchCarById(carId);
      fetchCarVisits(carId);
    }
  }, [carId]);

  const handleInputChange = (field: keyof Car, value: string | number) => {
    if (editedCar) {
      setEditedCar({ ...editedCar, [field]: value });
    }
  };

  const saveCarChanges = async () => {
    if (!editedCar || !carId) return;

    try {
      const response = await fetch(`http://localhost:8080/api/cars/${carId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(editedCar),
      });

      if (!response.ok) throw new Error("Błąd zapisu zmian");

      const updatedCar = await response.json();
      setCar(updatedCar);
      setIsEditing(false);
    } catch (error) {
      console.error("Błąd zapisu samochodu:", error);
    }
  };

  const upcomingVisits = visits.filter((v) => v.status === "upcoming");
  const currentVisits = visits.filter((v) => v.status === "current");
  const historyVisits = visits.filter((v) => v.status === "history");

  const handleShowMoreUpcoming = () => setVisibleUpcoming((prev) => prev + 5);
  const handleShowLessUpcoming = () => setVisibleUpcoming(5);

  const handleShowMoreCurrent = () => setVisibleCurrent((prev) => prev + 5);
  const handleShowLessCurrent = () => setVisibleCurrent(5);

  const handleShowMoreHistory = () => setVisibleHistory((prev) => prev + 5);
  const handleShowLessHistory = () => setVisibleHistory(5);

  return (
    <div className={styles.carInfo}>
      <div className={styles.leftSection}>
        <h1 className={styles.infoHeader}>
          Informacje o samochodzie
          <Link href={`/carStatistics?carId=${carId}`} passHref
                style={{marginLeft: "12px", display: "inline-flex", alignItems: "center"}}>
            <img
                src="https://img.icons8.com/ios/24/bar-chart--v1.png"
                alt="Ikona wykresu"
                style={{height: "24px", verticalAlign: "middle"}}
            />
          </Link>
        </h1>

        {car ? (
            <div className={styles.carDetails}>
              {isEditing ? (
                  <>
                    <div className={styles.inlineField}>
                      <label>Nazwa:</label>
                      <Input
                          value={editedCar?.name || ""}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div className={styles.inlineField}>
                      <label>Marka:</label>
                      <Input
                          value={editedCar?.brand || ""}
                          onChange={(e) => handleInputChange("brand", e.target.value)}
                      />
                    </div>
                    <div className={styles.inlineField}>
                      <label>Model:</label>
                      <Input
                          value={editedCar?.model || ""}
                          onChange={(e) => handleInputChange("model", e.target.value)}
                      />
                    </div>
                    <div className={styles.inlineField}>
                      <label>Rocznik:</label>
                      <Input
                          type="number"
                          value={editedCar?.year || ""}
                          onChange={(e) => handleInputChange("year", Number(e.target.value))}
                      />
                    </div>
                    <div className={styles.inlineField}>
                      <label>Przebieg (km):</label>
                      <Input
                          type="number"
                          value={editedCar?.mileage || ""}
                          onChange={(e) => handleInputChange("mileage", Number(e.target.value))}
                      />
                    </div>
                    <div className={styles.inlineField}>
                      <label>Następny przegląd:</label>
                      <Input
                          type="date"
                          value={editedCar?.nextInspection || ""}
                          onChange={(e) => handleInputChange("nextInspection", e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button onClick={saveCarChanges}>Zapisz</Button>
                      <Button variant="secondary" onClick={() => setIsEditing(false)}>
                        Anuluj
                      </Button>
                    </div>
                  </>
              ) : (
                  <>
                    <p><strong>Nazwa:</strong> {car.name}</p>
                    <p><strong>Marka:</strong> {car.brand}</p>
                    <p><strong>Model:</strong> {car.model}</p>
                    <p><strong>Rocznik:</strong> {car.year}</p>
                    <p><strong>Przebieg:</strong> {car.mileage} km</p>
                    <p><strong>Następny przegląd:</strong> {car.nextInspection || "Brak informacji"}</p>
                    <Button className="mt-2 mb-3 text-lg" onClick={() => {
                      setEditedCar(car);
                      setIsEditing(true);
                    }}>
                      Edytuj
                    </Button>
                  </>
              )}
            </div>
        ) : (
            <p>Ładowanie danych samochodu...</p>
        )}
      </div>

      <div className={styles.rightSection}>
        <h2 className={styles.name}>Wizyty</h2>
        <div className={styles.visitsAccordion}>
          {visits.length > 0 ? (
              <Accordion type="single" className="w-full">
                {/* Nadchodzące */}
                <AccordionItem value="upcoming">
                  <AccordionTrigger className="text-xl mt-4">
                    Nadchodzące
                  </AccordionTrigger>
                  <AccordionContent>
                  {upcomingVisits.slice(0, visibleUpcoming).map((visit) => (
                    <div
                      key={visit.id}
                      className="flex justify-between items-center p-3 bg-blue-100 rounded-lg mb-2"
                    >
                      <span>
                        {visit.service?.name || "Naprawa"} {visit.date}{" "}
                        {visit.time} —{" "}
                        {visit.car?.name || "'Brak nazwy samochodu'"} (
                        {visit.car?.brand || "'Brak marki samochodu'"}{" "}
                        {visit.car?.year || "'Brak rocznika samochodu'"})
                      </span>
                      <Button
                        variant="link"
                        className="text-primary"
                        onClick={() => generateVisitReport(visit)}
                      >
                        Pobierz raport →
                      </Button>
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
                <AccordionTrigger className="text-xl mt-4">
                  Aktualne
                </AccordionTrigger>
                <AccordionContent>
                  {currentVisits.slice(0, visibleCurrent).map((visit) => (
                    <div
                      key={visit.id}
                      className="flex justify-between items-center p-3 bg-blue-100 rounded-lg mb-2"
                    >
                      <span>
                        {visit.service?.name || "Naprawa"} {visit.date}{" "}
                        {visit.time} —{" "}
                        {visit.car?.name || "'Brak nazwy samochodu'"} (
                        {visit.car?.brand || "'Brak marki samochodu'"}{" "}
                        {visit.car?.year || "'Brak rocznika samochodu'"})
                      </span>
                      <Button
                        variant="link"
                        className="text-primary"
                        onClick={() => generateVisitReport(visit)}
                      >
                        Pobierz raport →
                      </Button>
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
                <AccordionTrigger className="text-xl mt-4">
                  Historia
                </AccordionTrigger>
                <AccordionContent>
                  {historyVisits.slice(0, visibleHistory).map((visit) => (
                    <div
                      key={visit.id}
                      className="flex justify-between items-center p-3 bg-blue-100 rounded-lg mb-2"
                    >
                      <span>
                        {visit.service?.name || "Naprawa"} {visit.date}{" "}
                        {visit.time} —{" "}
                        {visit.car?.name || "'Brak nazwy samochodu'"} (
                        {visit.car?.brand || "'Brak marki samochodu'"}{" "}
                        {visit.car?.year || "'Brak rocznika samochodu'"})
                      </span>
                      <Button
                        variant="link"
                        className="text-primary"
                        onClick={() => generateVisitReport(visit)}
                      >
                        Pobierz raport →
                      </Button>
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
