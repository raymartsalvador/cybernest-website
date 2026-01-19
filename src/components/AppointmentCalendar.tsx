import { useState, useEffect, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./calendar.css";
import { getCalendarStatus, CalendarDayStatus, DEFAULT_COMPANY } from "../services/bookingService";

interface AppointmentCalendarProps {
  onDateClick: (dateStr: string) => void;
  company?: string;
  onFullyBookedSelect?: (dateStr: string) => void;
}

export default function AppointmentCalendar({
  onDateClick,
  company = DEFAULT_COMPANY,
  onFullyBookedSelect
}: AppointmentCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [fullyBookedDates, setFullyBookedDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const fetchCalendarStatus = useCallback(async (monthDate: Date, signal?: AbortSignal) => {
    const month = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;
    setLoading(true);

    try {
      const status = await getCalendarStatus(month, company, signal);
      const booked = status
        .filter((day: CalendarDayStatus) => day.isFullyBooked)
        .map((day: CalendarDayStatus) => new Date(day.date + "T00:00:00"));
      setFullyBookedDates(booked);
    } catch {
      setFullyBookedDates([]);
    } finally {
      setLoading(false);
    }
  }, [company]);

  useEffect(() => {
    const controller = new AbortController();
    fetchCalendarStatus(currentMonth, controller.signal);
    return () => controller.abort();
  }, [currentMonth, fetchCalendarStatus]);

  const handleDayClick = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const isFullyBooked = fullyBookedDates.some(d => d.toDateString() === date.toDateString());

    if (isFullyBooked && onFullyBookedSelect) {
      onFullyBookedSelect(dateStr);
    }

    onDateClick(dateStr);
  };

  return (
    <div className="p-2 rounded-2xl text-sm mx-auto w-full max-w-md bg-white relative">
      {loading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl z-10">
          <div className="w-6 h-6 border-2 border-cyberred border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <DayPicker
        mode="single"
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        onDayClick={handleDayClick}
        disabled={{ before: today }}
        modifiers={{
          fullyBooked: fullyBookedDates,
        }}
        className="w-full max-w-full box-border"
        classNames={{
          today: "my-today",
          selected: "my-selected",
          months: "flex flex-wrap justify-center w-full",
          month: "w-full max-w-full",
          caption_label: "text-center text-cyberred font-bold",
        }}
      />
    </div>
  );
}
