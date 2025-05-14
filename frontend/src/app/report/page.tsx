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
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import styles from './page.module.scss';

export default function Report() {
    const [date, setDate] = useState<Date>();
    const [przebieg, setPrzebieg] = useState("");
    const [rows, setRows] = useState([
        { service: "Wymiana oleju", price: "40 zł" },
        { service: "Wymiana klocków", price: "50 zł" },
    ]);

    const [newService, setNewService] = useState("");
    const [newPrice, setNewPrice] = useState("");

    const handleAddRow = () => {
        if (!newService || !newPrice) return;
        setRows([...rows, { service: newService, price: newPrice }]);
        setNewService("");
        setNewPrice("");
    };

    return (
        <div className={styles.reportContainer}>
            <div className={styles.leftSection}>
                <h1>Dane auta:</h1>
                <p>marka:</p>
                <p>model:</p>
                <p>rocznik:</p>
                <p>przepieg:</p>
                <p>następny przegląd:</p>
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{row.service}</TableCell>
                                    <TableCell className="text-right">{row.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="mb-4 flex gap-4">
                        <input
                            type="text"
                            placeholder="Usługa"
                            value={newService}
                            onChange={(e) => setNewService(e.target.value)}
                            className="border rounded px-3 py-1 w-1/2"
                        />
                        <input
                            type="text"
                            placeholder="Cena"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="border rounded px-3 py-1 w-1/4"
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

            <div className={styles.bottomtSection}>

            </div>
        </div>
    )
}