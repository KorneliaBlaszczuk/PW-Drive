'use client'

import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.scss";

type MileageRecord = {
    id: number;
    changeDate: string | null;
    mileage: { type: string; oldValue: number; newValue: number } | null;
};

export default function CarMileageChart() {
    const searchParams = useSearchParams();
    const carId = searchParams.get("carId");

    const [data, setData] = useState<{ date: string; mileage: number }[]>([]);

    useEffect(() => {
        if (!carId) return;

        async function getHistory() {
            try {
                const response = await fetch(`http://localhost:8080/api/cars/${carId}/history`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch history");

                const historyData: MileageRecord[] = await response.json();

                const pointsMap = new Map<string, number>();

                for (const record of historyData) {
                    const dateStr = record.changeDate;
                    const mileage = record.mileage;

                    if (!dateStr || !mileage) continue;
                    const dateObj = new Date(dateStr);
                    if (isNaN(dateObj.getTime())) continue;

                    const formattedDate = dateObj.toISOString();

                    const oldKey = formattedDate + "_" + mileage.oldValue;
                    if (!pointsMap.has(oldKey) && mileage.oldValue != null) {
                        pointsMap.set(oldKey, mileage.oldValue);
                    }

                    const newKey = formattedDate + "_" + mileage.newValue;
                    if (!pointsMap.has(newKey) && mileage.newValue != null) {
                        pointsMap.set(newKey, mileage.newValue);
                    }
                }

                const pointsArray = Array.from(pointsMap.entries())
                    .map(([key, mileage]) => {
                        const datePart = key.split("_")[0];
                        const dateObj = new Date(datePart);
                        return {
                            date: dateObj.toLocaleDateString(),
                            mileage,
                            sortDate: dateObj.getTime(),
                        };
                    })
                    .sort((a, b) => a.sortDate - b.sortDate);

                const chartData = pointsArray.map(({ date, mileage }) => ({ date, mileage }));

                setData(chartData);
            } catch (error) {
                console.error(error);
            }
        }

        getHistory();
    }, [carId]);

    return (
        <div className={styles.chart}>
            <h1>Historia przebiegu</h1>
            {data.length === 0 ? (
                <p style={{ padding: "1rem", color: "gray" }}>
                    Brak historii przebiegu dla tego pojazdu.
                </p>
            ) : (
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="mileage" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>   )}
        </div>
    );
}

