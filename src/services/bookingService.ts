const baseAPIUrl = import.meta.env.VITE_API_URL; // e.g., http://localhost:5000/api
const defaultCompany = import.meta.env.VITE_COMPANY_SLUG;

// ✅ Types
export interface AvailabilitySlot {
  slot: string;
  isBooked: boolean;
}

export interface BookingPayload {
  date: string; // YYYY-MM-DD (used for slots)
  slot: string; // e.g., "09:30-10:00"
  clientName?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface AppointmentPayload {
  clientName: string;
  email: string;
  phone: string;
  appointmentDate: string;
  notes?: string;
}

/** ✅ Get available time slots */
export const getAvailability = async (
  company: string = defaultCompany,
  selectedDate: string
): Promise<AvailabilitySlot[]> => {
  try {
    const res = await fetch(
      `${baseAPIUrl}/${company}/slots?date=${selectedDate}`
    );
    if (!res.ok) throw new Error("Failed to fetch slots");
    return await res.json();
  } catch {
    return [];
  }
};

/** ✅ Book a specific appointment slot */
export const submitBooking = async (
  company: string = defaultCompany,
  payload: BookingPayload
): Promise<void> => {
  const res = await fetch(`${baseAPIUrl}/${company}/slots/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Booking failed");
};

/** ✅ Create appointment record (after booking the slot) */
export const createAppointment = async (
  company: string = defaultCompany,
  payload: {
    clientName: string;
    email: string;
    phone: string;
    address?: string;
    clientCompany?: string;
    appointmentDate: string;
    notes?: string;
    slot?: string;
  }
): Promise<void> => {
  const res = await fetch(`${baseAPIUrl}/${company}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create appointment");
};

/** ✅ Format a time slot to a readable range */
export const formatTimeRange = (slot: string): string => {
  const [start, end] = slot.split("-");
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  const startDate = new Date();
  startDate.setHours(startHour, startMin, 0);

  const endDate = new Date();
  endDate.setHours(endHour, endMin, 0);

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return `${startDate.toLocaleTimeString(
    [],
    options
  )} - ${endDate.toLocaleTimeString([], options)}`;
};

/** ✅ Check if a time slot is already past */
export const isPastTime = (
  selectedDate: string | null,
  slot: string
): boolean => {
  if (!selectedDate) return false;
  const now = new Date();
  const selected = new Date(selectedDate);

  if (selected.toDateString() !== now.toDateString()) return false;

  const [start] = slot.split("-");
  const [hours, minutes] = start.split(":").map(Number);

  const timeDate = new Date(selected);
  timeDate.setHours(hours, minutes, 0, 0);

  return timeDate < now;
};
