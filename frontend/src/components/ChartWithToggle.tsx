'use client';

import { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { Button } from "@/components/ui/button";

type TimeRange = 'day' | 'month' | 'year';

export type ChartPoint = { time: string; value: number };

export interface ChartData {
    day: ChartPoint[];
    month: ChartPoint[];
    year: ChartPoint[];
}

interface ChartWithToggleProps {
    dataByRange: ChartData;
    currentRange: TimeRange;
    onRangeChange?: (range: TimeRange) => void;
    disableRangeToggle?: boolean;  // nowy prop
}

const ChartWithToggle = ({
                             dataByRange,
                             currentRange,
                             onRangeChange,
                             disableRangeToggle = false,
                         }: ChartWithToggleProps) => {
    return (
        <div className="w-full p-4 bg-white rounded-xl shadow-md">
            <div className="flex gap-2 mb-4">
                {(['day', 'month', 'year'] as const).map((r) => (
                    <Button
                        key={r}
                        variant={currentRange === r ? 'default' : 'outline'}
                        onClick={!disableRangeToggle && onRangeChange ? () => onRangeChange(r) : undefined}
                        disabled={disableRangeToggle}
                    >
                        {r.toUpperCase()}
                    </Button>
                ))}
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataByRange[currentRange]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};


export default ChartWithToggle;
