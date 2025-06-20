'use client';

import ChartWithToggle, { ChartData } from "@/components/ChartWithToggle";
import { useEffect, useState } from "react";
import { getDaysInMonth } from "date-fns";

const MONTHS_ORDER = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function StatisticsPage() {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAdmin, setAdmin] = useState(false);

    const [range, setRange] = useState<"day" | "month" | "year">("year");
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

    const daysInMonth = getDaysInMonth(new Date(selectedYear, selectedMonth));

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
        async function fetchStats() {
            const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
            try {
                const url = `http://localhost:8080/api/admin/stats/visits-count?startDate=${formattedDate}&period=${range}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch stats");
                }

                const raw = await response.json();
                // alert(raw); // Commented out alert for better UX

                let parsedData: ChartData = { year: [], month: [], day: [] };

                if (range === "year") {
                    const monthMap: Record<string, number> = MONTHS_ORDER.reduce((acc, month) => {
                        acc[month] = 0;
                        return acc;
                    }, {} as Record<string, number>);

                    raw.forEach((entry: { month: number, count: number }) => {
                        const label = MONTHS_ORDER[entry.month - 1]; // backend month is 1-based
                        monthMap[label] = entry.count;
                    });

                    parsedData.year = MONTHS_ORDER.map((month, index) => ({
                        label: month,
                        value: monthMap[month],
                        time: MONTHS_ORDER[index],  // miesiąc
                    }));
                } else if (range === "month") {
                    const daysInMonth = getDaysInMonth(new Date(selectedYear, selectedMonth));
                    const dayMap: Record<number, number> = {};

                    for (let i = 1; i <= daysInMonth; i++) {
                        dayMap[i] = 0;
                    }

                    raw.forEach((entry: { date: string, count: number }) => {
                        const day = new Date(entry.date).getDate();
                        dayMap[day] = entry.count;
                    });

                    parsedData.month = Array.from({ length: daysInMonth }, (_, i) => ({
                        label: `${i + 1}`,
                        value: dayMap[i + 1],
                        time: (i + 1).toString(), //dzień
                    }));

                } else if (range === "day") {
                    const hourMap: Record<number, number> = {};

                    for (let h = 0; h < 24; h++) {
                        hourMap[h] = 0;
                    }

                    raw.forEach((entry: { hour: number, count: number }) => {
                        hourMap[entry.hour] = entry.count;
                    });

                    parsedData.day = Array.from({ length: 24 }, (_, h) => ({
                        label: `${h}:00`,
                        value: hourMap[h],
                        time: (h).toString(), //godzina
                    }));

                }
                setChartData(parsedData);

            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        }

        if (userId && isAdmin) {
            fetchStats();
        }
    }, [userId, isAdmin, range, selectedYear, selectedMonth, selectedDay]);

    // Resetuj day i month przy zmianie zakresu, aby uniknąć błędów
    useEffect(() => {
        if (range === "year") {
            setSelectedMonth(0);
            setSelectedDay(1);
        } else if (range === "month") {
            setSelectedDay(1);
        }
    }, [range]);

    function handleRangeChange(newRange: "day" | "month" | "year") {
        setRange(newRange);
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
            {chartData && chartData[range].length > 0 ? (
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
