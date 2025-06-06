"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jsPDF } from "jspdf";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

type Visit = {
  createdAt: string;
  date: string;
  isReserved: boolean;
  time: string;
  car: Car;
  service: Service | undefined;
  id: number;
  comment: string;
  status: string;
};

type Service = {
  id: number;
  name: string;
  price: number;
  time: string;
};

type Car = {
  mileage: number;
  nextInspection: string;
  year: number;
  id: number;
  id_user: number;
  brand: string;
  model: string;
  name: string;
};

type Repair = {
  description: string;
  price: number;
};

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

  async function loadFontBase64(url: string) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Nie udało się załadować fontu");

    const base64 = await response.text();
    return base64.trim();
  }

  const generateVisitReport = async (visit: Visit) => {
    const doc = new jsPDF();

    const robotoBase64 = await loadFontBase64("/fonts/robotoBase64.txt");

    const response = await fetch(`http://localhost:8080/api/visits/${visit.id}/repairs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    console.log(visit.id);

    const repairs: Repair[] = response.ok ? await response.json() : [];

    doc.addFileToVFS("Roboto-Regular.ttf", robotoBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    // Nagłówek
    doc.setFontSize(24);
    doc.text("Raport wizyty", 20, 20);
    const timeWithoutSeconds = visit.time.slice(0, 5);
    doc.text(`z ${visit.date} ${timeWithoutSeconds}`, 20, 30);

    doc.setFontSize(18);
    doc.text("Informacje o samochodzie: ", 20, 50);

    doc.setFontSize(12);
    if (visit.car) {
      doc.text(`nazwa: ${visit.car.name}`, 20, 60);
      doc.text(`marka: ${visit.car.brand}`, 20, 70);
      doc.text(`model: ${visit.car.model}`, 20, 80);
      doc.text(`rocznik: ${visit.car.year}`, 20, 90);
      doc.text(`przebieg: ${visit.car.mileage}`, 20, 100);
      doc.text(`nastepny przeglad: ${visit.car.nextInspection}`, 20, 110);
    } else {
      doc.text("Brak danych o samochodzie", 12, 60);
    }

    const startY = 130;
    doc.setFontSize(18);
    doc.text("Naprawy i usługa:", 20, startY);

    let y = startY + 10;

    doc.setFontSize(12);
    doc.text("Opis", 20, y);
    doc.text("Cena (PLN)", 150, y);
    doc.line(10, y + 2, 200, y + 2);
    y += 10;

    let totalCost = 0;

    if (visit.service) {
      doc.text(`[Usługa] ${visit.service.name}`, 20, y);
      doc.text(visit.service.price.toFixed(2), 150, y);
      totalCost += visit.service.price;
      y += 10;
    }

    if (repairs.length === 0) {
      doc.text("Brak napraw dla tej wizyty", 20, y);
      y += 10;
    } else {
      repairs.forEach((repair) => {
        doc.text(repair.description, 20, y);
        doc.text(repair.price.toFixed(2), 150, y);
        totalCost += repair.price;
        y += 10;
      });
    }

    doc.setFontSize(12);
    doc.setLineWidth(0.5);
    doc.line(10, y + 2, 200, y + 2);
    doc.setFontSize(14);
    doc.text("Suma:", 20, y + 12);
    doc.text(`${totalCost.toFixed(2)} PLN`, 150, y + 12);

    y += 50;

    doc.setFontSize(18);
    doc.text("Komentarz:", 20, y);

    doc.setFontSize(12);
    doc.text(visit.comment || "Brak komentarza do wizyty", 20, y + 10);

    doc.save(`raport_wizyty_${visit.id}.pdf`);
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
        <h1 className={styles.infoHeader}>Informacje o samochodzie</h1>

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
