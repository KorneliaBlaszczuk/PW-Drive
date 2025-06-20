import { parseISO, getHours, getDate, getMonth, getYear, getDaysInMonth } from "date-fns";
import { Visit } from "@/types/visit";

export interface ChartPoint {
    time: string;
    value: number;
}

export interface ChartData {
    day: ChartPoint[];
    month: ChartPoint[];
    year: ChartPoint[];
}

interface FilterOptions {
    year?: number;
    month?: number; // 0–11
    day?: number;
}

const MONTHS_ORDER = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Uzupełnia dane zerami na podstawie kluczy
function fillData(keys: string[], map: Map<string, number>): ChartPoint[] {
    return keys.map((key) => ({
        time: key,
        value: map.get(key) ?? 0,
    }));
}

export function transformVisitsToChartData(visits: Visit[], filters?: FilterOptions): ChartData {
    const dayMap = new Map<string, number>();
    const monthMap = new Map<string, number>();
    const yearMap = new Map<string, number>();

    visits.forEach((visit) => {
        const date = parseISO(visit.createdAt);

        const y = getYear(date);
        const m = getMonth(date); // 0–11
        const d = getDate(date);
        const h = getHours(date);

        // Filtrowanie wg parametrów
        if (filters?.year && y !== filters.year) return;
        if (filters?.month !== undefined && m !== filters.month) return;
        if (filters?.day !== undefined && d !== filters.day) return;

        // Tworzenie map
        const hourKey = h.toString().padStart(2, "0") + ":00";
        const dayKey = d.toString(); // 1–31
        const monthKey = MONTHS_ORDER[m];

        dayMap.set(hourKey, (dayMap.get(hourKey) ?? 0) + 1);
        monthMap.set(dayKey, (monthMap.get(dayKey) ?? 0) + 1);
        yearMap.set(monthKey, (yearMap.get(monthKey) ?? 0) + 1);
    });

    // Zakresy
    const dayHours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0") + ":00");

    const totalDays = filters?.year !== undefined && filters?.month !== undefined
        ? getDaysInMonth(new Date(filters.year, filters.month))
        : 31;
    const daysInMonth = Array.from({ length: totalDays }, (_, i) => (i + 1).toString());

    return {
        day: fillData(dayHours, dayMap),
        month: fillData(daysInMonth, monthMap),
        year: fillData(MONTHS_ORDER, yearMap),
    };
}
