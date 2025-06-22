'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";

type TimeRange = 'day' | 'month' | 'year';

export type ChartPoint = { time: string; value: number; value2?: number };

export interface ChartData {
    day: ChartPoint[];
    month: ChartPoint[];
    year: ChartPoint[];
}

interface ChartWithToggleProps {
    dataByRange: ChartData;
    currentRange: TimeRange;
    onRangeChange?: (range: TimeRange) => void;
    disableRangeToggle?: boolean;
    valueKey?: "value" | "value2";
}

const ChartWithToggle = ({
    dataByRange,
    currentRange,
    onRangeChange,
    disableRangeToggle = false,
    valueKey = "value", // default to "value"
}: ChartWithToggleProps) => {
    return (
        <div className="w-full p-4 bg-white rounded-xl shadow-md">
            {!disableRangeToggle && (
                <div className="flex gap-2 mb-4">
                    {(['day', 'month', 'year'] as const).map((r) => (
                        <Button
                            key={r}
                            variant={currentRange === r ? 'default' : 'outline'}
                            onClick={() => onRangeChange?.(r)}
                        >
                            {r.toUpperCase()}
                        </Button>
                    ))}
                </div>
            )}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataByRange[currentRange]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey={valueKey}
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ChartWithToggle;
