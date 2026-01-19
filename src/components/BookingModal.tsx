// src/components/BookingModal.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { X, Calendar, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { showPopup } from "./PopupService";
import AppointmentCalendar from "./AppointmentCalendar";
import {
  getAvailability,
  submitBooking,
  formatTimeRange,
  isPastTime,
  createAppointment,
  AvailabilitySlot,
} from "../services/bookingService";

import leftImage from "../assets/images/123.png";
import logo from "../assets/images/logo.png";
import gridBg from "../assets/images/grid-bg.png";

interface BookingModalProps {
  show: boolean;
  onClose: () => void;
  company?: string;
  authToken?: string | null;
  timezone?: string;
}

interface FormErrors {
  clientName?: string;
  email?: string;
  phone?: string;
}

// Skeleton loader for time slots
function SlotSkeleton() {
  return (
    <div className="space-y-2" aria-label="Loading available time slots">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-full py-4 rounded-xl bg-gray-200 animate-pulse"
        />
      ))}
    </div>
  );
}

// Empty state when no slots available
function EmptySlotState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Calendar className="w-12 h-12 text-gray-300 mb-3" />
      <p className="text-sm font-medium text-gray-500">No available slots</p>
      <p className="text-xs text-gray-400 mt-1">
        Try selecting a different date
      </p>
    </div>
  );
}

// Form field with inline validation
interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

function FormField({
  id,
  label,
  type,
  placeholder,
  value,
  error,
  required,
  onChange,
  onBlur,
}: FormFieldProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <label
        htmlFor={id}
        className="text-sm sm:text-md font-normal sm:w-32 sm:pt-2"
      >
        {label}
        {required && <span className="text-cyberred ml-1">*</span>}
      </label>
      <div className="flex-1">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-lg bg-cyberlightred px-3 sm:px-4 py-1.5 sm:py-2 text-cyberdark placeholder-cyberred/50 focus:outline-none focus:ring-2 text-sm transition-colors ${
            error
              ? "ring-2 ring-red-400 focus:ring-red-400"
              : "focus:ring-cyberred"
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoComplete="on"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && (
          <p
            id={`${id}-error`}
            className="mt-1 text-xs text-red-500 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default function BookingModal({
  show,
  onClose,
  company,
  authToken,
  timezone,
}: BookingModalProps) {
  const defaultCompany = (import.meta as any).env?.VITE_COMPANY_SLUG as string;
  const defaultTz =
    timezone ||
    (import.meta as any).env?.VITE_DEFAULT_TZ ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "Asia/Manila";

  const companySlug = company || defaultCompany;
  const bearer =
    authToken ?? localStorage.getItem("cybernest_jwt") ?? undefined;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Generate idempotency key per modal session
  const [idemKey] = useState<string>(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now()) + Math.random().toString(36).slice(2)
  );

  const modalRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Escape key handler
  useEffect(() => {
    if (!show) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [show]);

  // Focus trap
  useEffect(() => {
    if (!show || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => document.removeEventListener("keydown", handleTabKey);
  }, [show, showForm]);

  // Fetch availability when date changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailability([]);
      setSelectedSlot(null);
      return;
    }

    setError(null);
    setSlotsLoading(true);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const fetchSlots = async () => {
      try {
        const slots = await getAvailability(
          selectedDate,
          companySlug,
          ctrl.signal,
          defaultTz,
          bearer
        );
        setAvailability(slots);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        if (e?.status === 401) {
          setError("You need to sign in to view availability.");
        } else {
          setError("Failed to load availability. Please try again.");
        }
        setAvailability([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    const t = setTimeout(fetchSlots, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [selectedDate, companySlug, defaultTz, bearer]);

  // Validation functions
  const validateField = useCallback(
    (field: string, value: string): string | undefined => {
      switch (field) {
        case "clientName":
          if (!value.trim()) return "Full name is required";
          break;
        case "phone":
          if (!value.trim()) return "Contact number is required";
          if (!/^[0-9+\-()\s]{7,}$/.test(value))
            return "Enter a valid phone number";
          break;
        case "email":
          if (!value.trim()) return "Email is required";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return "Enter a valid email address";
          break;
      }
      return undefined;
    },
    []
  );

  const handleFieldBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field, (formData as any)[field]);
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    },
    [formData, validateField]
  );

  const handleFieldChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing (if field was touched)
      if (touched[field]) {
        const error = validateField(field, value);
        setFormErrors((prev) => ({ ...prev, [field]: error }));
      }
    },
    [touched, validateField]
  );

  const validateAllFields = useCallback((): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    ["clientName", "phone", "email"].forEach((field) => {
      const error = validateField(field, (formData as any)[field]);
      if (error) {
        errors[field as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setFormErrors(errors);
    setTouched({ clientName: true, phone: true, email: true });
    return isValid;
  }, [formData, validateField]);

  const canContinue = useMemo(() => {
    return (
      selectedDate &&
      selectedSlot &&
      !loading &&
      !isPastTime(selectedDate, selectedSlot?.slot || "")
    );
  }, [selectedDate, selectedSlot, loading]);

  const resetAll = useCallback(() => {
    setSelectedDate(null);
    setAvailability([]);
    setSelectedSlot(null);
    setShowForm(false);
    setFormData({
      clientName: "",
      email: "",
      phone: "",
      address: "",
      company: "",
      notes: "",
    });
    setFormErrors({});
    setTouched({});
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    resetAll();
    onClose();
  }, [resetAll, onClose]);

  const handleFullyBookedSelect = useCallback((dateStr: string) => {
    showPopup({
      icon: "warning",
      title: "Fully Booked",
      message:
        "This date is fully booked. You may view the schedule, but no slots are available.",
      confirmText: "OK",
    });
  }, []);

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedSlot) return;

    if (!validateAllFields()) {
      showPopup({
        icon: "warning",
        title: "Incomplete Form",
        message: "Please fill in all required fields correctly.",
        confirmText: "OK",
      });
      return;
    }

    setLoading(true);
    setError(null);

    const headers = {
      Authorization: bearer ? `Bearer ${bearer}` : undefined,
      "X-Idempotency-Key": idemKey,
      "X-Client-TZ": defaultTz,
    };

    try {
      // Optional pre-reserve (safe to continue if it fails)
      try {
        await submitBooking(
          {
            date: selectedDate,
            slotId: selectedSlot.id,
            slot: selectedSlot.slot,
            clientName: formData.clientName,
            email: formData.email,
            phone: formData.phone,
            notes: formData.notes,
          },
          companySlug,
          headers
        );
      } catch {
        // Pre-reserve failed, continue anyway
      }

      // Authoritative booking via /appointments
      await createAppointment(
        {
          clientName: formData.clientName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          clientCompany: formData.company,
          appointmentDate: selectedDate,
          slot: selectedSlot.slot,
          notes: formData.notes,
          slotId: selectedSlot.id,
        },
        companySlug,
        headers
      );

      showPopup({
        icon: "success",
        title: "Booked!",
        message: "Your appointment has been successfully scheduled.",
        confirmText: "Close",
        onConfirm: handleClose,
      });
    } catch (e: any) {
      console.error(e);
      let msg =
        "Booking failed. The slot may already be taken or unavailable.";
      if (e?.status === 401) {
        msg = "Please sign in to book this appointment.";
      } else if (e?.status === 409) {
        msg = "That slot was just taken. Please choose another time.";
      }
      setError(msg);
      showPopup({
        icon: "error",
        title: "Booking Failed",
        message: msg,
        confirmText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSlotButtonClasses = (
    slotData: AvailabilitySlot,
    isDisabled: boolean,
    isSelected: boolean
  ): string => {
    const base =
      "cursor-pointer w-full py-4 rounded-xl text-sm font-bold border transition-all duration-200";
    if (isDisabled) {
      return `${base} bg-gray-100 text-gray-400 cursor-not-allowed`;
    }
    if (isSelected) {
      return `${base} bg-cyberred text-white border-cyberred`;
    }
    return `${base} bg-cyberlightred hover:bg-gray-100 text-cyberred border-transparent`;
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          className="fixed inset-0 z-50 bg-white flex flex-col p-0 overflow-y-auto overflow-x-hidden md:bg-black/80 md:items-center md:justify-center"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="min-h-screen bg-white rounded-2xl shadow-xl w-full md:max-w-5xl 2xl:max-w-6xl p-0 md:p-4 flex flex-col md:flex-row relative md:min-h-0"
            style={{
              backgroundImage: `url(${gridBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-black z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close booking modal"
            >
              <X size={24} />
            </button>

            {!showForm ? (
              <>
                {/* Left image (md+) */}
                <motion.div
                  className="hidden md:block w-full h-full md:w-[40%] relative overflow-hidden rounded-l-2xl"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <img
                    src={leftImage}
                    alt="Meeting illustration"
                    className="h-full w-full object-cover"
                  />
                </motion.div>

                <div className="flex flex-col items-center justify-start px-6 py-6 w-full md:w-[60%]">
                  <img
                    src={logo}
                    alt="Cybernest Logo"
                    className="w-36 mb-4"
                  />
                  <h2
                    id="booking-modal-title"
                    className="text-2xl font-extrabold text-cyberred mb-1 text-center"
                  >
                    Book a Free Meeting!
                  </h2>
                  <p className="text-sm text-center text-gray-600 mb-3">
                    Book your free session now—let's talk about what you need!
                  </p>

                  {error && (
                    <div
                      className="mb-3 w-full max-w-xl text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div
                    className={`rounded-2xl shadow-md flex flex-col gap-4 transition-all duration-300 bg-cyberlightred p-3 ${
                      selectedDate
                        ? "bg-cyberlightred border border-cyberred w-full max-w-full sm:flex-row"
                        : "inline-block bg-cyberlightred border border-cyberred items-center"
                    }`}
                  >
                    <motion.div
                      className={`${
                        selectedDate ? "flex-1" : "flex justify-center"
                      } w-full max-w-full box-border`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div className="w-full max-w-full overflow-x-hidden px-1">
                        <AppointmentCalendar
                          company={companySlug}
                          onDateClick={(d) => {
                            setSelectedDate(d);
                            setSelectedSlot(null);
                          }}
                          onFullyBookedSelect={handleFullyBookedSelect}
                        />
                      </div>
                    </motion.div>

                    {selectedDate && (
                      <div className="flex-1 bg-white rounded-2xl p-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-cyberred" />
                          <h4 className="text-md font-extrabold text-cyberred">
                            Select your Schedule!
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 text-center">
                          Pick a time that works for you
                        </p>

                        <div
                          className="space-y-2 max-h-52 overflow-y-auto pr-2"
                          aria-label="Available time slots"
                        >
                          {slotsLoading && <SlotSkeleton />}
                          {!slotsLoading && availability.length === 0 && (
                            <EmptySlotState />
                          )}
                          {!slotsLoading &&
                            availability.length > 0 &&
                            availability.map((slotData) => {
                              const isDisabled =
                                slotData.isBooked ||
                                isPastTime(selectedDate, slotData.slot);
                              const isSelected =
                                selectedSlot?.id === slotData.id;

                              return (
                                <button
                                  key={slotData.id}
                                  type="button"
                                  aria-pressed={isSelected}
                                  disabled={isDisabled}
                                  onClick={() =>
                                    !isDisabled && setSelectedSlot(slotData)
                                  }
                                  className={getSlotButtonClasses(
                                    slotData,
                                    isDisabled,
                                    isSelected
                                  )}
                                >
                                  {formatTimeRange(slotData.slot)}
                                  {isDisabled && (
                                    <span className="text-xs text-gray-500 ml-2">
                                      (Unavailable)
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedDate && (
                    <button
                      onClick={() => setShowForm(true)}
                      disabled={!canContinue}
                      className={`mt-6 py-2 px-8 text-sm font-semibold rounded-full transition-all duration-200 ${
                        canContinue
                          ? "bg-cyberred text-white hover:opacity-90"
                          : "bg-gray-300 text-white cursor-not-allowed"
                      }`}
                    >
                      Continue
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Form view */}
                <div className="flex flex-col w-full max-w-full md:flex-row md:h-auto md:w-full bg-white opacity-95 p-4 sm:p-5 z-20 rounded-2xl">
                  <div className="w-full md:w-[60%] px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-4">
                    <img
                      src={logo}
                      alt="Cybernest Logo"
                      className="w-28 sm:w-40 mb-3 sm:mb-6"
                    />
                    <h1 className="text-xl sm:text-3xl font-extrabold text-cyberred">
                      Fill out the Details
                    </h1>
                    <p className="text-sm sm:text-md font-normal text-gray-600 mb-2 sm:mb-4">
                      Complete your information to confirm your booking.
                    </p>

                    <FormField
                      id="clientName"
                      label="Full Name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.clientName}
                      error={formErrors.clientName}
                      required
                      onChange={(v) => handleFieldChange("clientName", v)}
                      onBlur={() => handleFieldBlur("clientName")}
                    />

                    <FormField
                      id="phone"
                      label="Contact No."
                      type="tel"
                      placeholder="09XXXXXXXXX"
                      value={formData.phone}
                      error={formErrors.phone}
                      required
                      onChange={(v) => handleFieldChange("phone", v)}
                      onBlur={() => handleFieldBlur("phone")}
                    />

                    <FormField
                      id="email"
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      error={formErrors.email}
                      required
                      onChange={(v) => handleFieldChange("email", v)}
                      onBlur={() => handleFieldBlur("email")}
                    />

                    <FormField
                      id="address"
                      label="Address"
                      type="text"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={(v) => handleFieldChange("address", v)}
                    />

                    <FormField
                      id="company"
                      label="Company"
                      type="text"
                      placeholder="Company name"
                      value={formData.company}
                      onChange={(v) => handleFieldChange("company", v)}
                    />

                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                      <label
                        htmlFor="notes"
                        className="text-sm sm:text-md sm:w-32 sm:pt-2"
                      >
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        placeholder="Anything else we should know?"
                        className="flex-1 rounded-lg bg-cyberlightred px-3 sm:px-4 py-1.5 sm:py-2 text-cyberdark placeholder-cyberred/50 focus:outline-none focus:ring-2 focus:ring-cyberred text-sm"
                        value={formData.notes}
                        onChange={(e) =>
                          handleFieldChange("notes", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Summary + Confirm */}
                  <div className="w-full md:w-[40%] px-4 sm:px-10 py-4 sm:py-10 border-t md:border-t-0 md:border-l border-cyberred md:mt-14 flex flex-col rounded-xl sm:rounded-3xl">
                    <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                      <h4 className="text-center text-lg font-extrabold text-cyberred mb-1">
                        Appointment Details
                      </h4>
                      <div className="bg-cyberred text-white text-center rounded-lg py-3 mb-4">
                        <div className="font-extrabold text-2xl sm:text-3xl">
                          {selectedDate
                            ? new Date(selectedDate).toLocaleDateString(
                                undefined,
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "Select a Date"}
                        </div>
                        <div className="text-sm mt-1">
                          {selectedSlot
                            ? formatTimeRange(selectedSlot.slot)
                            : "Select a Time"}
                        </div>
                      </div>

                      <h5 className="text-center font-bold text-cyberred text-sm mb-2">
                        Personal Details
                      </h5>
                      <div className="text-center text-sm space-y-1 mb-3">
                        <p>{formData.clientName || "—"}</p>
                        <p>{formData.phone || "—"}</p>
                        <p>{formData.address || "—"}</p>
                        <p className="underline break-words">
                          {formData.email || "—"}
                        </p>
                        <p>{formData.company || "—"}</p>
                      </div>

                      {formData.notes && (
                        <div className="bg-cyberlightred text-xs text-start text-gray-600 p-3 rounded">
                          <span className="font-medium">Notes:</span>{" "}
                          {formData.notes}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-auto flex justify-between gap-4">
                      <button
                        onClick={() => setShowForm(false)}
                        className="w-1/2 border border-cyberred text-cyberred font-semibold py-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleBookingSubmit}
                        disabled={loading || !selectedSlot}
                        className={`w-1/2 bg-cyberred text-white py-2 rounded-full transition-colors ${
                          loading || !selectedSlot
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:opacity-90"
                        }`}
                      >
                        {loading ? "Booking..." : "Confirm"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
