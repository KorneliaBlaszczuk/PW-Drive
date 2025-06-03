"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jsPDF } from "jspdf";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function Profile() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setAdmin] = useState(false);

  const [visibleUpcoming, setVisibleUpcoming] = useState(5);
  const [visibleCurrent, setVisibleCurrent] = useState(5);
  const [visibleHistory, setVisibleHistory] = useState(5);

  const [visitsCount, setVisitsCount] = useState(5);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const [currentCarsPage, setCurrentCarsPage] = useState(1);
  const carsPerPage = 3;
  const router = useRouter();

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role == "WORKSHOP") {
      setAdmin(true);
    }
  }, []);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("id");
    const storedUsername = sessionStorage.getItem("username");
    if (storedUserId) {
      setUserId(storedUserId);
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/logIn"); // przekierowanie jeśli nie ma tokena
    }
  }, []);

  useEffect(() => {
    if (userId) {
      async function fetchVisits() {
        try {
          if (!isAdmin) {
            const response = await fetch(
              `http://localhost:8080/api/users/${userId}/visits`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error("Failed to fetch visits");
            }

            const data = await response.json();
            console.log(data);
            setVisits(data);
          } else {
            const response = await fetch(
              `http://localhost:8080/api/admin/visits`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error("Failed to fetch all visits for admin");
            }

            const data = await response.json();
            console.log("Admin visits:", data);
            setVisits(data);
          }
        } catch (error) {
          console.error("Error fetching visits:", error);
        }
      }

      async function fetchCars() {
        try {
          const response = await fetch(
            `http://localhost:8080/api/users/${userId}/cars`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch cars");
          }

          const data = await response.json();
          setCars(data);
        } catch (error) {
          console.error("Error fetching cars:", error);
        }
      }

      fetchVisits();
      if (!isAdmin) {
        fetchCars();
      }
    } else {
      console.log("Brak userId, zapytanie nie zostało wysłane");
    }
  }, [userId]);

  const deleteCar = async (carId: number) => {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć ten samochód?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8080/api/cars/${carId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Błąd podczas usuwania samochodu");
      }

      // Usuń auto z lokalnego stanu po usunięciu z serwera
      setCars((prev) => prev.filter((car) => car.id !== carId));
    } catch (error) {
      console.error("Błąd przy usuwaniu auta:", error);
    }
  };

  const generateVisitReport = (visit: Visit) => {
    const doc = new jsPDF();

    // Nagłówek
    doc.setFontSize(24);
    doc.text("Raport wizyty", 20, 20);
    doc.text(`z ${visit.date} ${visit.time}`, 20, 30);

    doc.setFontSize(18);
    doc.text("Informacje o samochodzie: ", 12, 50);

    doc.setFontSize(12);
    if (visit.car) {
      doc.text(`nazwa: ${visit.car.name}`, 12, 60);
      doc.text(`marka: ${visit.car.brand}`, 12, 70);
      doc.text(`model: ${visit.car.model}`, 12, 80);
      doc.text(`rocznik: ${visit.car.year}`, 12, 90);
      doc.text(`przebieg: ${visit.car.mileage}`, 12, 100);
      doc.text(`nastepny przeglad: ${visit.car.nextInspection}`, 12, 110);

      doc.setFontSize(18);
      doc.text(`Typ uslugi: ${visit.service?.name || "Naprawa"}`, 12, 120);

      doc.text(
        `Wycena: ${visit.service?.name || "Naprawa"} - ${visit.service?.price || "-"
        } PLN`,
        12,
        130
      );
      if (visit.comment) {
        doc.text(`Komentarz: ${visit.comment}`, 12, 150);
      }
    } else {
      doc.text("Brak danych o samochodzie", 12, 60);
    }

    doc.save(`raport_wizyty_${visit.id}.pdf`);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
  };

  const handleVisitsCountChange = (value: string) => {
    setVisitsCount(Number(value));
  };

  // Filter visits based on status
  const upcomingVisits = visits.filter((v) => v.status === "upcoming");
  const currentVisits = visits.filter((v) => v.status === "current");
  const historyVisits = visits.filter((v) => v.status === "history");

  // Handle the "Show More" / "Show Less" actions for visits
  const handleShowMoreUpcoming = () => setVisibleUpcoming((prev) => prev + 5);
  const handleShowLessUpcoming = () => setVisibleUpcoming(5);

  const handleShowMoreCurrent = () => setVisibleCurrent((prev) => prev + 5);
  const handleShowLessCurrent = () => setVisibleCurrent(5);

  const handleShowMoreHistory = () => setVisibleHistory((prev) => prev + 5);
  const handleShowLessHistory = () => setVisibleHistory(5);

  const totalCarsPages = Math.ceil(cars.length / carsPerPage);
  const paginatedCars = cars.slice(
    (currentCarsPage - 1) * carsPerPage,
    currentCarsPage * carsPerPage
  );

  return (
    <div className={styles.profilePage}>
      <div className={styles.leftSection}>
        <h2 className={styles.visitsHeader}>Twoje wizyty:</h2>
        <Accordion type="multiple" className="w-full">
          {/* Nadchodzące */}
          <AccordionItem value="upcoming">
            <AccordionTrigger className="text-xl mt-4">
              Nadchodzące
            </AccordionTrigger>
            <AccordionContent>
              {upcomingVisits.length === 0 ? (
                <p className="text-center text-gray-500 italic">
                  Brak nadchodzących wizyt.
                </p>
              ) : (
                <>
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
                </>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Aktualne */}
          <AccordionItem value="current">
            <AccordionTrigger className="text-xl mt-4">
              Aktualne
            </AccordionTrigger>
            <AccordionContent>
              {currentVisits.length === 0 ? (
                <p className="text-center text-gray-500 italic">
                  Brak aktualnych wizyt.
                </p>
              ) : (
                <>
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
                </>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Historia */}
          <AccordionItem value="history">
            <AccordionTrigger className="text-xl mt-4">
              Historia
            </AccordionTrigger>
            <AccordionContent>
              {historyVisits.length === 0 ? (
                <p className="text-center text-gray-500 italic">
                  Brak zakończonych wizyt.
                </p>
              ) : (
                <>
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
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Right section for cars and user name */}
      <div className={styles.rightSection}>
        <Image
          src="https://img.icons8.com/ios-filled/50/FFFFFF/user.png"
          alt="Użytkownik"
          width={24}
          height={24}
          className={styles.icon}
        />
        <div className={styles.userName}>Witaj, {username}</div>
        {!isAdmin ? (
          <>
            <h2 className={styles.carsHeader}>Twoje samochody</h2>
            <div className={styles.cars}>
              {paginatedCars.map((car) => (
                <div key={car.id} className="flex items-center justify-between gap-4 mb-2 p-2 rounded">
                  <Link href={`/carInfo?carId=${car.id}`} passHref>
                    <Button className="flex-1 text-left">
                      {car.name} ({car.model} {car.year})
                    </Button>
                  </Link>

                  <img
                    onClick={() => deleteCar(car.id)}
                    style={{ cursor: "pointer" }}
                    width="20"
                    height="20"
                    src="https://img.icons8.com/material-outlined/24/filled-trash.png"
                    alt="Usuń"
                    title="Usuń samochód"
                  />
                </div>
              ))}
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentCarsPage((prev) => Math.max(prev - 1, 1));
                    }}
                    size={"lg"}
                  />
                </PaginationItem>

                {[...Array(totalCarsPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      className="text-lg font-medium"
                      isActive={currentCarsPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentCarsPage(i + 1);
                      }}
                      size={"lg"}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {totalCarsPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentCarsPage((prev) =>
                        Math.min(prev + 1, totalCarsPages)
                      );
                    }}
                    size={"lg"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className={styles.addCarButton}>
              <Link href="/addCar" passHref>
                <Button>Dodaj samochód</Button>
              </Link>
            </div>
          </>
        ) : (
          <div className={styles.workshop}>
            <div>
              <p>Godziny pracy:</p>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm text-gray-700">
                    Godzina rozpoczęcia
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    className="border px-3 py-2 rounded-md"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm text-gray-700">
                    Godzina zakończenia
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={handleEndTimeChange}
                    className="border px-3 py-2 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div>
              <p>Liczba jednoczesnych wizyt:</p>
              <Select
                value={visitsCount.toString()}
                onValueChange={handleVisitsCountChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Wybierz liczbę" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
