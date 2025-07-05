import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./calendar.css"; // Your custom styles

    const baseAPIUrl = import.meta.env.VITE_API_URL;

export default function AppointmentCalendar({ onDateClick }: { onDateClick: (dateStr: string) => void }) {
  const today = new Date();
  const [fullyBookedDates, setFullyBookedDates] = useState<Date[]>([]);

  useEffect(() => {
    const currentMonth = today.toISOString().slice(0, 7); // "YYYY-MM"

    fetch(`${baseAPIUrl}/calendarStatus?month=${currentMonth}`)
      .then((res) => res.json())
      .then((data) => {
        const booked: Date[] = [];
        data.forEach((day: any) => {
          const allBooked = day.slots.every((slot: any) => slot.status === "booked");
          if (allBooked) {
            booked.push(new Date(day.date));
          }
        });
        setFullyBookedDates(booked);
      })
      .catch(() => setFullyBookedDates([]));
  }, []);

  return (
    <DayPicker
      mode="single"
      onDayClick={(date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        const isFullyBooked = fullyBookedDates.some(d => d.toDateString() === date.toDateString());

        if (isFullyBooked) {
          alert("⚠️ This date is fully booked. You may view the schedule, but no slots are available.");
        }

        onDateClick(dateStr);
      }}
      disabled={{ before: today }} // Only disable past days
      modifiers={{
        fullyBooked: fullyBookedDates,
      }}
      modifiersClassNames={{
        selected: "my-selected",
        today: "my-today",
        disabled: "my-disabled",
        fullyBooked: "my-fully-booked",
      }}
      className="rounded-xl shadow-md p-2"
    />
  );
}
