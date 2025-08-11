// src/services/bookingService.ts
// Lean client aligned to routes:
//  - GET /:company/slots?date=YYYY-MM-DD[&timezone=...]
//  - POST /:company/slots/book
//  - POST /:company/appointments   (unchanged, if you have it)

const RAW_BASE = (import.meta as any).env?.VITE_API_URL || ""; // e.g., https://.../api
const BASE = RAW_BASE.replace(/\/$/, "");
const DEFAULT_COMPANY =
  (import.meta as any).env?.VITE_COMPANY_SLUG || "default";
const DEFAULT_TZ =
  (import.meta as any).env?.VITE_DEFAULT_TZ ||
  Intl.DateTimeFormat().resolvedOptions().timeZone ||
  "Asia/Manila";

export interface AvailabilitySlot {
  slot: string; // "HH:mm-HH:mm"
  isBooked: boolean;
}

export interface BookingPayload {
  date: string; // YYYY-MM-DD
  slot: string; // "09:30-10:00"
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
  address?: string;
  clientCompany?: string;
  appointmentDate: string; // ISO string
  notes?: string;
  slot?: string;
}

// ---- helpers --------------------------------------------------------------
function joinUrl(company: string, path: string) {
  const c = encodeURIComponent(company || DEFAULT_COMPANY);
  return `${BASE}/${c}${path.startsWith("/") ? path : `/${path}`}`;
}

function normalizeSlots(raw: any): AvailabilitySlot[] {
  if (!raw) return [];
  // API returns: [{ slot: "09:30-10:00", isBooked: false }]
  if (Array.isArray(raw) && typeof raw[0]?.slot === "string") return raw;
  // tolerate string[] just in case
  if (Array.isArray(raw) && typeof raw[0] === "string") {
    return raw.map((r: string) => ({ slot: r, isBooked: false }));
  }
  // tolerate {slots:[{start,end,status}]}
  if (Array.isArray(raw?.slots)) {
    return raw.slots.map((s: any) => ({
      slot: `${s.start}-${s.end}`,
      isBooked:
        String(s.status || "").toLowerCase() === "booked" || !!s.isBooked,
    }));
  }
  return [];
}

// ---- API calls ------------------------------------------------------------
export async function getAvailability(
  selectedDate: string,
  company: string = DEFAULT_COMPANY,
  signal?: AbortSignal
): Promise<AvailabilitySlot[]> {
  const url = joinUrl(
    company,
    `/slots?date=${encodeURIComponent(
      selectedDate
    )}&timezone=${encodeURIComponent(DEFAULT_TZ)}`
  );
  try {
    const res = await fetch(url, {
      signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Failed to fetch slots: ${res.status}`);
    const json = await res.json();
    return normalizeSlots(json);
  } catch (err) {
    console.error(err);
    return [];
  }
}

/**
 * submitBooking
 * Backward-compatible signature:
 *   - old: submitBooking(company, payload)
 *   - new: submitBooking(payload, company?)
 */
export async function submitBooking(
  a: string | BookingPayload,
  b?: BookingPayload | string
): Promise<{ message?: string } | void> {
  let company = DEFAULT_COMPANY;
  let payload: BookingPayload;

  if (typeof a === "string") {
    // old style: (company, payload)
    company = a || DEFAULT_COMPANY;
    payload = (b as BookingPayload) || ({} as BookingPayload);
  } else {
    // new style: (payload, company?)
    payload = a;
    if (typeof b === "string") company = b;
  }

  const body = { timezone: DEFAULT_TZ, ...payload };
  const res = await fetch(joinUrl(company, "/slots/book"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Booking failed: ${res.status} ${msg}`);
  }

  // Your route returns { message, slot }, but we don't strictly depend on it
  return res.json().catch(() => ({}));
}

export async function createAppointment(
  payload: CreateAppointmentPayload,
  company: string = DEFAULT_COMPANY
): Promise<{ id?: string; status?: string }> {
  const res = await fetch(joinUrl(company, "/appointments"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Failed to create appointment: ${res.status} ${msg}`);
  }
  return res.json().catch(() => ({}));
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
  const [start] = slot.split("-");
  const [h, m] = start.split(":").map(Number);
  const t = new Date(sel);
  t.setHours(h, m, 0, 0);
  return t < now;
}

// Build ISO using local wall time (avoid TZ drift)
export function toLocalISO(dateYYYYMMDD: string, timeHHmm: string) {
  const [y, M, d] = dateYYYYMMDD.split("-").map(Number);
  const [h, m] = timeHHmm.split(":").map(Number);
  const dt = new Date(y, M - 1, d, h, m, 0, 0);
  return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString();
}
