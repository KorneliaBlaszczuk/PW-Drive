'use client';

import ChartWithToggle, { ChartData } from "@/components/ChartWithToggle";
import { useEffect, useState } from "react";
import { getDaysInMonth } from "date-fns";
import { Service } from "@/types/service";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const MONTHS_ORDER = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function StatisticsPage() {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAdmin, setAdmin] = useState(false);
    const [options, setOptions] = useState<string[]>([]);
    const [chosen, setChosen] = useState<string[]>([]);

    const [range, setRange] = useState<"day" | "month" | "year">("year");
    const [category, setCategory] = useState<"all" | "service" | "repair">("all");
    const [choice, setChoice] = useState<"category" | "names">();
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
        async function getOptions() {
            try {
                const response = await fetch("http://localhost:8080/api/admin/stats/services-repairs/names", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch services");
                }
                const data = await response.json();
                setOptions(data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        }
        getOptions();
    }, []);

    useEffect(() => {
        async function fetchStats() {
            const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

            try {
                let url;
                if (choice === 'category' && category !== 'all') {
                    url = `http://localhost:8080/api/admin/stats/services-repairs-stats?period=${range}&startDate=${formattedDate}&category=${category}`;
                } else if (choice === 'names') {
                    const joinedServices = chosen.join(",");
                    url = `http://localhost:8080/api/admin/stats/services-repairs-stats?period=${range}&startDate=${formattedDate}&services=${encodeURIComponent(joinedServices)}`;
                } else {
                    url = `http://localhost:8080/api/admin/stats/services-repairs-stats?period=${range}&startDate=${formattedDate}`;
                }

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch stats");
                }

                const raw: Array<{
                    month?: number;
                    date?: string;
                    hour?: number;
                    quantity: number;
                    revenue: number;
                }> = await response.json();

                const parsedData: ChartData = { year: [], month: [], day: [] };

                if (range === "year") {
                    const quantityMap: Record<string, number> = {};
                    const revenueMap: Record<string, number> = {};

                    MONTHS_ORDER.forEach(month => {
                        quantityMap[month] = 0;
                        revenueMap[month] = 0;
                    });

                    raw.forEach(entry => {
                        if (entry.month) {
                            const monthLabel = MONTHS_ORDER[entry.month - 1];
                            quantityMap[monthLabel] += entry.quantity;
                            revenueMap[monthLabel] += entry.revenue;
                        }
                    });

                    parsedData.year = MONTHS_ORDER.map(month => ({
                        label: month,
                        value: quantityMap[month] || 0,
                        value2: revenueMap[month] || 0,
                        time: month,
                    }));

                } else if (range === "month") {
                    const daysInMonth = getDaysInMonth(new Date(selectedYear, selectedMonth));
                    const quantityMap: Record<number, number> = {};
                    const revenueMap: Record<number, number> = {};

                    for (let i = 1; i <= daysInMonth; i++) {
                        quantityMap[i] = 0;
                        revenueMap[i] = 0;
                    }

                    raw.forEach(entry => {
                        if (entry.date) {
                            const day = new Date(entry.date).getDate();
                            quantityMap[day] += entry.quantity;
                            revenueMap[day] += entry.revenue;
                        }
                    });

                    parsedData.month = Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        return {
                            label: day.toString(),
                            value: quantityMap[day] || 0,
                            value2: revenueMap[day] || 0,
                            time: day.toString(),
                        };
                    });

                } else if (range === "day") {
                    const quantityMap: Record<number, number> = {};
                    const revenueMap: Record<number, number> = {};

                    for (let h = 0; h < 24; h++) {
                        quantityMap[h] = 0;
                        revenueMap[h] = 0;
                    }

                    raw.forEach(entry => {
                        if (entry.hour !== undefined) {
                            quantityMap[entry.hour] += entry.quantity;
                            revenueMap[entry.hour] += entry.revenue;
                        }
                    });

                    parsedData.day = Array.from({ length: 24 }, (_, h) => ({
                        label: `${h}:00`,
                        value: quantityMap[h] || 0,
                        value2: revenueMap[h] || 0,
                        time: h.toString(),
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
    }, [userId, isAdmin, range, selectedYear, selectedMonth, selectedDay, choice, chosen, category]);

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

            {/* Wybór */}
            <div className="mb-4">
                <label>
                    Wykresy dla:
                    <select
                        value={choice}
                        onChange={e => setChoice(e.target.value as "category" | "names")}
                        className="ml-2 border p-1"
                    >
                        <option value=""></option>
                        <option value="category">Kategorii</option>
                        <option value="names">Usług i Napraw</option>
                    </select>
                </label>
            </div>

            {/* Kategoria */}
            {choice == 'category' &&
                <div className="mb-4">
                    <label>
                        Kategoria:
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value as "all" | "service" | "repair")}
                            className="ml-2 border p-1"
                        >
                            <option value="all">Wszystko</option>
                            <option value="service">Usługi</option>
                            <option value="repair">Naprawy</option>
                        </select>
                    </label>
                </div>
            }

            {/* Usługi i naprawy */}
            {choice === 'names' && (
                <div className="mb-4">
                    <label className="block font-medium mb-1">Usługi i naprawy:</label>
                    <ToggleGroup
                        type="multiple"
                        value={chosen}
                        onValueChange={(ids: string[]) => {
                            setChosen(ids);
                        }}
                        className="flex flex-wrap gap-2"
                    >
                        {options.map((option) => (
                            <ToggleGroupItem
                                key={option}
                                value={option}
                                className="border px-3 py-1 rounded-md inline-flex items-center justify-center text-center break-words whitespace-normal text-sm leading-snug data-[state=on]:bg-blue-600 data-[state=on]:text-white"
                            >
                                {option}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>
            )}


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
                <>
                    <h2 className="text-xl font-semibold mb-4">Wykres wizyt</h2>
                    <ChartWithToggle
                        dataByRange={chartData}
                        currentRange={range}
                        onRangeChange={handleRangeChange}
                        disableRangeToggle={true}
                        valueKey="value"
                    />
                    <h2 className="text-xl font-semibold mb-4 mt-4">Wykres zarobków</h2>
                    <ChartWithToggle
                        dataByRange={chartData}
                        currentRange={range}
                        onRangeChange={handleRangeChange}
                        disableRangeToggle={true}
                        valueKey="value2"
                    />
                </>
            ) : (
                <p className="text-gray-500">Brak danych do wykresów.</p>
            )}
        </div>
    );
}
