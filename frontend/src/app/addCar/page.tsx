'use client';

import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import styles from './page.module.scss';

export default function AddAuto() {
    const [date, setDate] = useState<Date>();
    const [nazwa, setNazwa] = useState("");
    const [marka, setMarka] = useState("");
    const [model, setModel] = useState("");
    const [rocznik, setRocznik] = useState("");
    const [przebieg, setPrzebieg] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleAddCar = async () => {
        if (nazwa && marka && model && rocznik && przebieg && date) {
            try {
                const token = sessionStorage.getItem("token");
                const userId = sessionStorage.getItem("id");

                if (!token || !userId) {
                    setSuccessMessage("Brak autoryzacji.");
                    return;
                }

                const response = await fetch(`http://localhost:8080/api/users/${userId}/cars`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: nazwa,
                        brand: marka,
                        nextInspection: date.toISOString().split('T')[0],
                        model: model,
                        year: parseInt(rocznik),
                        mileage: parseInt(przebieg),
                    }),
                });

                if (response.ok) {
                    setSuccessMessage("Auto dodane!");
                    setNazwa("");
                    setMarka("");
                    setModel("");
                    setRocznik("");
                    setPrzebieg("");
                    setDate(undefined);
                } else if (response.status === 403) {
                    setSuccessMessage("Brak uprawnień do dodania samochodu.");
                } else {
                    const error = await response.text();
                    setSuccessMessage(`Błąd: ${error}`);
                }
            } catch (error) {
                setSuccessMessage(`Wystąpił błąd: ${error}`);
            }
        } else {
            setSuccessMessage("Proszę wypełnić wszystkie pola.");
        }
    }


    return (
        <div className={styles.addCarContainer}>
            <div className={styles.addCarLeft}>
                <Input
                    className={styles.Input}
                    placeholder="nazwa"
                    value={nazwa}
                    onChange={(e) => setNazwa(e.target.value)}
                />
                <Input
                    className={styles.Input}
                    placeholder="marka"
                    value={marka}
                    onChange={(e) => setMarka(e.target.value)}
                />
                <Input
                    className={styles.Input}
                    placeholder="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                />
                <Input
                    className={styles.Input}
                    placeholder="rocznik"
                    value={rocznik}
                    onChange={(e) => setRocznik(e.target.value)}
                />
                <Input
                    className={styles.Input}
                    placeholder="przebieg"
                    value={przebieg}
                    onChange={(e) => setPrzebieg(e.target.value)}
                />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(styles.calendarInput)}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span className={styles.calendarPlaceholder}>data następnego przebiegu</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <Button onClick={handleAddCar} className={styles.addCarButton}>
                    Dodaj auto
                </Button>
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            </div>
            <div className={styles.addCarRight}>
                <img className={styles.pageImg} src='/car_add_car.jpg' alt='App logo black' />
            </div>
        </div>
    );
}
