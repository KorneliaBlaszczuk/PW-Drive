"use client";

import WeekCalendar from "@/components/WeekCalendar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

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

type Service = {
  id: number;
  name: string;
  price: number;
  time: string;
};

type Slot = {
  date: string;
  startTime: string;
  endTime: string;
};

type WidgetSlot = {
  date: string;
  times: string[];
};

const exampleSlots = [
  { date: "2025-05-19", times: ["09:00", "11:00", "13:00"] },
  { date: "2025-05-21", times: ["10:00", "14:00"] },
  { date: "2025-05-23", times: ["08:00", "12:00", "16:00"] },
];

function transformSlots(slots: Slot[]): WidgetSlot[] {
  const grouped: Record<string, string[]> = {};

  for (const slot of slots) {
    if (!grouped[slot.date]) {
      grouped[slot.date] = [];
    }
    grouped[slot.date].push(slot.startTime);
  }

  return Object.entries(grouped).map(([date, times]) => ({
    date,
    times,
  }));
}

export default function Book() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service>();
  const [repair, setRepair] = useState<boolean | undefined>();
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const [reservationConfirmed, setReservationConfirmed] = useState<
    string | null
  >(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    async function getServices() {
      try {
        const response = await fetch("http://localhost:8080/api/services", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    }
    getServices();
  }, []);

  useEffect(() => {
    async function getSlots() {
      if (repair || services.length != 0)
        try {
          const date = new Date();
          const endDate = addDays(date, 7);
          const startDateISO = encodeURIComponent(date.toISOString());
          const endDateISO = encodeURIComponent(endDate.toISOString());
          let url = `http://localhost:8080/api/visits/available?startDate=${startDateISO}&endDate=${endDateISO}`;
          if (!repair && selectedService) {
            url += `&serviceId=${selectedService}`;
            console.log(selectedService);
          }
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch slots");
          }
          const data = await response.json();
          setSlots(data);
        } catch (error) {
          console.error("Error fetching slots:", error);
        }
    }
    getSlots();
    console.log(selectedService);
  }, [repair, selectedService]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/logIn");
    }
  }, []);

  useEffect(() => {
    if (userId) {
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
      alert(
        `Zarezerwowano ${selectedService} na ${selectedSlot.date} ${selectedSlot.time}`
      );
      // fetch POST
    }
  };

  const selectedCar = cars.find((car) => car.id.toString() === selectedCarId);

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
      <Select onValueChange={(value) => setSelectedService(JSON.parse(value))}>
        <SelectTrigger className={styles.Select}>
          <SelectValue placeholder="Wybierz usługę" />
        </SelectTrigger>
        <SelectContent>
          {services.map((service) => (
            <SelectItem key={service.id} value={service.id.toString()}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="repair"
          checked={repair}
          onCheckedChange={(checked) => {
            setRepair(checked === true);
          }}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Naprawa?
        </label>
      </div>
      <h1>Najblisze dostępne wizyty:</h1>
      <WeekCalendar
        slots={transformSlots(slots)}
        onSelectSlot={handleSelectSlot}
      />

      {selectedCar && selectedService && selectedSlot && (
        <div className={styles.Summary}>
          <p>
            {selectedService} {selectedSlot.date} {selectedSlot.time}{" "}
            {selectedCar.name}
          </p>
          <Button onClick={handleReservation} className={styles.BookButton}>
            Zarezerwuj
          </Button>
        </div>
      )}
    </div>
  );
}
