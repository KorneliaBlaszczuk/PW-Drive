'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {Car} from "@/types/car";
import { useRouter, useParams } from "next/navigation";
import styles from './page.module.scss';

export default function Report() {
    const [carData, setCarData] = useState<Car | null>(null);
    const [repairs, setRepairs] = useState<any[]>([]);
    const [date, setDate] = useState<Date>();
    const [przebieg, setPrzebieg] = useState("");
    const [status, setStatus] = useState("");
    const [newService, setNewService] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [reportMeta, setReportMeta] = useState<any>(null);
    const router = useRouter();
    const params = useParams();
    const visitId = params?.visitId;
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editService, setEditService] = useState("");
    const [editPrice, setEditPrice] = useState("");

    const startEditing = (index: number) => {
        setEditIndex(index);
        setEditService(repairs[index].service);
        setEditPrice(repairs[index].price);
    };

    const saveEdit = () => {
        if (editIndex === null) return;
        if (!editService || !editPrice) return;

        const updatedRepairs = [...repairs];
        updatedRepairs[editIndex] = {
            ...updatedRepairs[editIndex],
            service: editService,
            price: editPrice.trim(),
        };
        setRepairs(updatedRepairs);
        setEditIndex(null);
        setEditService("");
        setEditPrice("");
    };

    const cancelEdit = () => {
        setEditIndex(null);
        setEditService("");
        setEditPrice("");
    };

    const deleteRow = (index: number) => {
        const updatedRepairs = repairs.filter((_, i) => i !== index);
        setRepairs(updatedRepairs);
        if (editIndex === index) cancelEdit();
    };

    useEffect(() => {
        async function fetchReport() {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/raport/${visitId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                    }
                )
                if (!response.ok) throw new Error("Błąd pobierania raportu");

                const data = await response.json();
                setCarData(data.visit.car);

                setRepairs(
                    data.repairs.map((r: any) => ({
                        id: r.id,
                        service: r.description,
                        price: r.price.toString(),
                    }))
                );
                setStatus(data.visit.status);
                setReportMeta(data);
            } catch (err) {
                console.error("Błąd:", err);
            }
        }

        fetchReport();
    }, []);

    const handleAddRow = () => {
        if (!newService || !newPrice) return;
        setRepairs([...repairs, { service: newService, price: newPrice.trim() }]);
        setNewService("");
        setNewPrice("");
    };

    const handleSave = async () => {
        if (!visitId || !reportMeta) {
            alert("Brak wymaganych danych do zapisu.");
            return;
        }

        // Stare wartości z reportMeta
        const oldMileage = reportMeta.visit.car.mileage;
        const oldInspectionDate = reportMeta.visit.car.nextInspection;

        const payload = {
            visit: {
                id: reportMeta.visit.id,
                service: reportMeta.visit.service,
                car: reportMeta.visit.car,
                createdAt: reportMeta.visit.createdAt,
                isReserved: reportMeta.visit.isReserved,
                time: reportMeta.visit.time,
                date: reportMeta.visit.date,
                status: status,
                comment: reportMeta.visit.comment,
            },
            repairs: repairs.map((r) => ({
                id: r.id || null,
                description: r.service,
                price: parseFloat(r.price) || 0,
            })),
            mileage: {
                id: reportMeta.mileage?.id || null,
                changeDate: new Date().toISOString(),
                inspectionDate: null,
                mileage: {
                    type: "mileage",
                    oldValue: oldMileage,
                    newValue: parseInt(przebieg) || oldMileage,
                },
            },
            inspectionDate: {
                id: reportMeta.inspectionDate?.id || null,
                changeDate: new Date().toISOString(),
                inspectionDate: {
                    type: "inspection",
                    oldValue: oldInspectionDate,
                    newValue: date ? date.toISOString() : oldInspectionDate,
                },
                mileage: null,
            },
        };

        try {
            const response = await fetch(`http://localhost:8080/api/raport/${visitId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Błąd zapisu raportu");

            alert("Raport zapisany pomyślnie!");
        } catch (error) {
            console.error(error);
            alert("Coś poszło nie tak przy zapisie raportu.");
        }
    };


    if (!carData) {
        return <div className="p-10 text-xl">Ładowanie raportu...</div>;
    }

    return (
        <div className={styles.reportContainer}>
            <div className={styles.leftSection}>
                <h1>Dane auta:</h1>
                <p>marka: {carData.brand}</p>
                <p>model: {carData.model}</p>
                <p>rocznik: {carData.year}</p>
                <p>przebieg: {carData.mileage} km</p>
                <p>następny przegląd: {carData.nextInspection}</p>
                <h3>Nowy przepieg / następny termin przeglądu</h3>
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

            </div>
            <div className={styles.rightSection}>
                <div className={styles.tableContainer}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30vw] text-lg font-semibold">Usługa</TableHead>
                                <TableHead className="text-right">Cena</TableHead>
                                <TableHead className="text-center">Akcje</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {repairs.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        {editIndex === index ? (
                                            <input
                                                type="text"
                                                value={editService}
                                                onChange={(e) => setEditService(e.target.value)}
                                                className="border rounded px-2 py-1 w-full"
                                            />
                                        ) : (
                                            row.service
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {editIndex === index ? (
                                            <input
                                                type="text"
                                                value={editPrice}
                                                onChange={(e) => setEditPrice(e.target.value)}
                                                className="border rounded px-2 py-1 w-20 text-right"
                                            />
                                        ) : (
                                            `${row.price} zł`
                                        )}
                                    </TableCell>
                                    <TableCell className={styles.actions}>
                                        {editIndex === index ? (
                                            <>
                                                <Button
                                                    onClick={saveEdit}
                                                    className="mr-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                                >
                                                    Zapisz
                                                </Button>
                                                <Button
                                                    onClick={cancelEdit}
                                                    className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                                                >
                                                    Anuluj
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <img
                                                    onClick={() => startEditing(index)}
                                                    style={{ cursor: 'pointer' }}
                                                    width="20"
                                                    height="20"
                                                    src="https://img.icons8.com/ios/50/edit--v1.png"
                                                    alt="edit--v1"
                                                />
                                                <img
                                                    onClick={() => deleteRow(index)}
                                                    style={{ cursor: 'pointer' }}
                                                    width="20"
                                                    height="20"
                                                    src="https://img.icons8.com/material-outlined/24/filled-trash.png"
                                                    alt="filled-trash"
                                                />
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="mb-4 mt-4 flex gap-10">
                        <input
                            type="text"
                            placeholder="Usługa"
                            value={newService}
                            onChange={(e) => setNewService(e.target.value)}
                            className="border rounded px-3 py-0.5 w-1/2"
                        />
                        <input
                            type="text"
                            placeholder="Cena"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="border rounded px-3 py-0.5 w-1/4"
                        />
                        <button
                            onClick={handleAddRow}
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                        >
                            Dodaj
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.bottomSection}>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className={styles.select}>
                        <SelectValue placeholder="Status wizyty" />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                        <SelectItem value="history">Gotowe do odbioru</SelectItem>
                        <SelectItem value="currents">W trakcie</SelectItem>
                        <SelectItem value="upcoming">Nadchodzące</SelectItem>
                    </SelectContent>
                </Select>
                <Button className={styles.button} onClick={handleSave}>Zapisz</Button>
            </div>
        </div>
    )
}