'use client'

import ChartWithToggle, { ChartData } from "@/components/ChartWithToggle";
import { Visit } from "@/types/visit";
import { useEffect, useState } from "react";
import { transformVisitsToChartData } from "@/lib/transformVisitsToChartData";
import { getDaysInMonth } from "date-fns";

const MONTHS_ORDER = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function StatisticsPage() {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAdmin, setAdmin] = useState(false);

    const [range, setRange] = useState<"day" | "month" | "year">("year");
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

    useEffect(() => {
        const role = sessionStorage.getItem("role");
        if (role === "WORKSHOP") {
            setAdmin(true);
        }
        const storedUserId = sessionStorage.getItem("id");
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        if (!userId) return;

        async function fetchVisits() {
            try {
                const url = isAdmin
                    ? `http://localhost:8080/api/admin/visits`
                    : `http://localhost:8080/api/users/${userId}/visits`;

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch visits");
                }

                const data: Visit[] = await response.json();
                setVisits(data);
            } catch (error) {
                console.error("Error fetching visits:", error);
            }
        }

        fetchVisits();
    }, [userId, isAdmin]);

    // Resetuj day i month przy zmianie zakresu, aby uniknąć błędów
    useEffect(() => {
        if (range === "year") {
            setSelectedMonth(0);
            setSelectedDay(1);
        } else if (range === "month") {
            setSelectedDay(1);
        }
    }, [range]);

    // Przygotuj dane do wykresu na podstawie filtrów i zakresu
    useEffect(() => {
        if (visits.length === 0) return;

        const filters = { year: selectedYear } as { year: number; month?: number; day?: number };
        if (range === "month") {
            filters.month = selectedMonth;
        } else if (range === "day") {
            filters.month = selectedMonth;
            filters.day = selectedDay;
        }

        setChartData(transformVisitsToChartData(visits, filters));
    }, [visits, selectedYear, selectedMonth, selectedDay, range]);

    const daysInMonth = getDaysInMonth(new Date(selectedYear, selectedMonth));

    function handleRangeChange(newRange: "day" | "month" | "year") {
        setRange(newRange);

        // Opcjonalnie resetuj filtry:
        if (newRange === "year") {
            setSelectedMonth(0);
            setSelectedDay(1);
        } else if (newRange === "month") {
            setSelectedDay(1);
        }
    }


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Statystyki</h1>

            {/* Sterowanie zakresem tylko tutaj */}
            <div className="mb-4">
                <label>
                    Zakres:
                    <select
                        value={range}
                        onChange={e => setRange(e.target.value as "day" | "month" | "year")}
                        className="ml-2 border p-1"
                    >
                        <option value="year">Rok</option>
                        <option value="month">Miesiąc</option>
                        <option value="day">Dzień</option>
                    </select>
                </label>
            </div>

            {/* Rok */}
            <div className="mb-4">
                <label>
                    Rok:
                    <input
                        type="number"
                        value={selectedYear}
                        onChange={e => setSelectedYear(Number(e.target.value))}
                        className="ml-2 border p-1 w-24"
                        min={2000}
                        max={2100}
                    />
                </label>
            </div>

            {/* Miesiąc */}
            <div className="mb-4">
                <label>
                    Miesiąc:
                    <select
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(Number(e.target.value))}
                        disabled={range === "year"}
                        className={`ml-2 border p-1 ${range === "year" ? "bg-gray-200 cursor-not-allowed" : ""}`}
                    >
                        {MONTHS_ORDER.map((m, i) => (
                            <option key={i} value={i}>
                                {m}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Dzień */}
            <div className="mb-6">
                <label>
                    Dzień:
                    <select
                        value={selectedDay}
                        onChange={e => setSelectedDay(Number(e.target.value))}
                        disabled={range !== "day"}
                        className={`ml-2 border p-1 ${range !== "day" ? "bg-gray-200 cursor-not-allowed" : ""}`}
                    >
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Wykres - przekazujemy tylko dane i zakres, bez onRangeChange */}
            {chartData && chartData.day.length > 0 ? (
                <ChartWithToggle
                    dataByRange={chartData}
                    currentRange={range}
                    onRangeChange={handleRangeChange}
                    disableRangeToggle={true}
                />

            ) : (
                <p className="text-gray-500">Brak danych do wykresu.</p>
            )}
        </div>
    );
}
