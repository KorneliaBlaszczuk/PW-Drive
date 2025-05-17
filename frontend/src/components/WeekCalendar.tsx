'use client';

import { useState } from "react";
import { addDays, startOfWeek, format, isBefore } from "date-fns";
import { pl } from "date-fns/locale";

type Slot = {
    date: string;   // format 'YYYY-MM-DD'
    times: string[]; // np. ["09:00", "11:00"]
};

type Props = {
    slots: Slot[];
    onSelectSlot?: (date: string, time: string) => void;
};

export default function WeekCalendar({ slots = [], onSelectSlot }: Props) {
    const [offset, setOffset] = useState(0);

    const getWeekDates = () => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
        return Array.from({ length: 7 }, (_, i) => addDays(start, i + offset * 7));
    };

    const weekDates = getWeekDates();
    const today = new Date();

    return (
        <div className="rounded-xl shadow-md w-full max-w-7xl mx-auto">
            {/* Górna sekcja: przyciski + dni */}
            <div className="grid grid-cols-[48px_repeat(7,_1fr)_48px] items-center p-4 bg-[#749BFF]/50 rounded-t-xl text-white font-bold">
                {/* Lewy przycisk */}
                <button
                    onClick={() => setOffset(offset - 1)}
                    className="cursor-pointer justify-self-center w-12"
                    aria-label="Poprzedni tydzień"
                >
                    <img
                        width="40"
                        height="40"
                        src="https://img.icons8.com/ios/50/circled-chevron-left.png"
                        alt="Poprzedni tydzień"
                    />
                </button>

                {/* Dni tygodnia */}
                {weekDates.map((date) => (
                    <div
                        key={date.toISOString()}
                        className={`p-2 rounded-md text-center ${date.toDateString() === today.toDateString()
                            ? "bg-[#5f7fe0]"
                            : "bg-[#6f8fff]"
                            }`}
                    >
                        <div className="text-sm">{format(date, "EEEE", { locale: pl })}</div>
                        <div className="text-lg">{format(date, "dd.MM")}</div>
                    </div>
                ))}

                {/* Prawy przycisk */}
                <button
                    onClick={() => setOffset(offset + 1)}
                    className="cursor-pointer justify-self-center w-12"
                    aria-label="Następny tydzień"
                >
                    <img
                        width="40"
                        height="40"
                        src="https://img.icons8.com/ios/50/circled-chevron-right--v1.png"
                        alt="Następny tydzień"
                    />
                </button>
            </div>

            {/* Sloty pod spodem */}
            <div className="grid grid-cols-[48px_repeat(7,_1fr)_48px] gap-4 bg-white p-4 rounded-b-xl">
                <div></div> {/* pusta kolumna po lewej */}

                {weekDates.map((date) => {
                    const daySlots = slots.find(
                        (slot) => slot.date === format(date, "yyyy-MM-dd")
                    );

                    const isPast =
                        isBefore(date, today) && date.toDateString() !== today.toDateString();

                    return (
                        <div
                            key={date.toISOString()}
                            className="flex flex-col items-center min-h-[70px]"
                        >
                            {!isPast && daySlots ? (
                                daySlots.times.map((time) => (
                                    <button
                                        key={time}
                                        className="mb-2 px-3 py-1 rounded bg-[#749BFF] text-white font-semibold hover:bg-[#5f7fe0] w-full max-w-[100px]"
                                        onClick={() =>
                                            onSelectSlot && onSelectSlot(format(date, "yyyy-MM-dd"), time)
                                        }
                                        type="button"
                                    >
                                        {time}
                                    </button>
                                ))
                            ) : (
                                <span className="text-gray-400 text-sm mt-2">Brak terminów</span>
                            )}
                        </div>
                    );
                })}

                <div></div> {/* pusta kolumna po prawej */}
            </div>
        </div>
    );
}
