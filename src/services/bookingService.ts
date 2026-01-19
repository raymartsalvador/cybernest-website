// src/services/bookingService.ts
// Lean client aligned to routes:
//  - GET  /:company/slots?date=YYYY-MM-DD[&timezone=...]
//  - POST /:company/slots/book                 (optional; preflight only)
//  - POST /:company/appointments               (authoritative; books via slotId)

const RAW_BASE = (import.meta as any).env?.VITE_API_URL || ""; // e.g., https://.../api
const BASE = RAW_BASE.replace(/\/$/, "");
export const DEFAULT_COMPANY =
  (import.meta as any).env?.VITE_COMPANY_SLUG || "default";
export const DEFAULT_TZ =
  (import.meta as any).env?.VITE_DEFAULT_TZ ||
  Intl.DateTimeFormat().resolvedOptions().timeZone ||
  "Asia/Manila";

export interface AvailabilitySlot {
  id: string; // slotId from backend (_id normalized to id)
  slot: string; // "HH:mm-HH:mm"
  isBooked: boolean;
}

export interface BookingPayload {
  date: string; // YYYY-MM-DD
  slot?: string; // fallback if slotId missing
  slotId?: string; // preferred
  timezone?: string;
  clientName?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface CreateAppointmentPayload {
  clientName: string;
  email: string;
  phone: string;
  appointmentDate: string; // YYYY-MM-DD format
  slot: string; // required: "HH:mm-HH:mm" format
  address?: string;
  clientCompany?: string;
  notes?: string;
  slotId?: string; // preferred if known
}

export interface RequestHeaders {
  Authorization?: string;
  "X-Idempotency-Key"?: string;
  "X-Client-TZ"?: string;
}

export interface CalendarDayStatus {
  date: string;
  availableCount: number;
  totalCount: number;
  isFullyBooked: boolean;
}

// ---- helpers --------------------------------------------------------------
function joinUrl(company: string, path: string) {
  const c = encodeURIComponent(company || DEFAULT_COMPANY);
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}/${c}${p}`;
}

function pickId(obj: any): string | undefined {
  return obj?.id || obj?._id || obj?.slotId;
}

function normalizeSlots(raw: any): AvailabilitySlot[] {
  if (!raw) return [];

  // canonical: [{ _id, slot, isBooked }]
  if (
    Array.isArray(raw) &&
    (raw[0]?._id || raw[0]?.id) &&
    typeof raw[0]?.slot === "string"
  ) {
    return raw.map((r: any) => ({
      id: String(pickId(r)),
      slot: String(r.slot),
      isBooked: !!r.isBooked,
    }));
  }

  // tolerate string[]
  if (Array.isArray(raw) && typeof raw[0] === "string") {
    return raw.map((s: string, idx: number) => ({
      id: String(idx),
      slot: s,
      isBooked: false,
    }));
  }

  // tolerate { slots: [{ id/_id, start, end, status }] }
  if (Array.isArray(raw?.slots)) {
    return raw.slots.map((s: any, idx: number) => ({
      id: String(pickId(s) ?? idx),
      slot: `${s.start}-${s.end}`,
      isBooked:
        String(s.status || "").toLowerCase() === "booked" || !!s.isBooked,
    }));
  }

  return [];
}

// Parse "HH:mm-HH:mm" -> "HH:mm"
export function getSlotStart(slot: string): string {
  return (slot || "").split("-")[0] || "09:00";
}

// Build ISO using local wall time (avoid client TZ drift)
export function toLocalISO(dateYYYYMMDD: string, timeHHmm: string, _timezone?: string) {
  const [y, M, d] = dateYYYYMMDD.split("-").map(Number);
  const [h, m] = timeHHmm.split(":").map(Number);
  const dt = new Date(y, M - 1, d, h, m, 0, 0);
  return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString();
}

export function formatTimeRange(slot: string): string {
  const [start, end] = slot.split("-");
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const s = new Date();
  s.setHours(sh, sm, 0, 0);
  const e = new Date();
  e.setHours(eh, em, 0, 0);
  const opts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return `${s.toLocaleTimeString([], opts)} - ${e.toLocaleTimeString(
    [],
    opts
  )}`;
}

export function isPastTime(selectedDate: string | null, slot: string): boolean {
  if (!selectedDate) return false;
  const now = new Date();
  const sel = new Date(selectedDate);
  if (sel.toDateString() !== now.toDateString()) return false;
  const [h, m] = (slot.split("-")[0] || "00:00").split(":").map(Number);
  const t = new Date(sel);
  t.setHours(h, m, 0, 0);
  return t < now;
}

// ---- API calls ------------------------------------------------------------
export async function getAvailability(
  selectedDate: string,
  company: string = DEFAULT_COMPANY,
  signal?: AbortSignal,
  timezone: string = DEFAULT_TZ,
  authToken?: string
): Promise<AvailabilitySlot[]> {
  const url = joinUrl(
    company,
    `/slots?date=${encodeURIComponent(selectedDate)}&timezone=${encodeURIComponent(timezone)}`
  );
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    const res = await fetch(url, { signal, headers });
    if (!res.ok) {
      const error = new Error(`Failed to fetch slots: ${res.status}`) as any;
      error.status = res.status;
      throw error;
    }
    const json = await res.json();
    return normalizeSlots(json);
  } catch (err: any) {
    if (err?.name === "AbortError") throw err;
    console.error(err);
    throw err;
  }
}

export async function getCalendarStatus(
  month: string,
  company: string = DEFAULT_COMPANY,
  signal?: AbortSignal
): Promise<CalendarDayStatus[]> {
  // Fetch all slots for each day in the month and compute status
  // Since backend doesn't have /calendarStatus, we build it from /slots
  const [year, monthNum] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const results: CalendarDayStatus[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(monthNum).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dateObj = new Date(year, monthNum - 1, day);

    // Skip past dates
    if (dateObj < today) continue;

    try {
      const slots = await getAvailability(dateStr, company, signal);
      const availableCount = slots.filter(s => !s.isBooked).length;
      const totalCount = slots.length;
      results.push({
        date: dateStr,
        availableCount,
        totalCount,
        isFullyBooked: totalCount > 0 && availableCount === 0,
      });
    } catch {
      // Skip dates with errors
    }
  }

  return results;
}

/**
 * Optional preflight. If this fails (404/409), caller should still try /appointments;
 * the server there performs the authoritative, race-safe lock.
 */
export async function submitBooking(
  payload: BookingPayload,
  company: string = DEFAULT_COMPANY,
  headers?: RequestHeaders
): Promise<{ message?: string } | void> {
  const body = { timezone: DEFAULT_TZ, ...payload };

  const fetchHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (headers?.Authorization) {
    fetchHeaders.Authorization = headers.Authorization;
  }
  if (headers?.["X-Idempotency-Key"]) {
    fetchHeaders["X-Idempotency-Key"] = headers["X-Idempotency-Key"];
  }
  if (headers?.["X-Client-TZ"]) {
    fetchHeaders["X-Client-TZ"] = headers["X-Client-TZ"];
  }

  const res = await fetch(joinUrl(company, "/slots/book"), {
    method: "POST",
    headers: fetchHeaders,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    const error = new Error(`Booking failed: ${res.status} ${msg}`) as any;
    error.status = res.status;
    throw error;
  }
  return res.json().catch(() => ({}));
}

export async function createAppointment(
  payload: CreateAppointmentPayload,
  company: string = DEFAULT_COMPANY,
  headers?: RequestHeaders
): Promise<{ id?: string; status?: string; data?: any; message?: string }> {
  const fetchHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (headers?.Authorization) {
    fetchHeaders.Authorization = headers.Authorization;
  }
  if (headers?.["X-Idempotency-Key"]) {
    fetchHeaders["X-Idempotency-Key"] = headers["X-Idempotency-Key"];
  }
  if (headers?.["X-Client-TZ"]) {
    fetchHeaders["X-Client-TZ"] = headers["X-Client-TZ"];
  }

  const res = await fetch(joinUrl(company, "/appointments"), {
    method: "POST",
    headers: fetchHeaders,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    const error = new Error(`Failed to create appointment: ${res.status} ${msg}`) as any;
    error.status = res.status;
    throw error;
  }
  return res.json().catch(() => ({}));
}
