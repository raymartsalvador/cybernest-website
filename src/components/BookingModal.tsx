import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
  company?: string; // ✅ Optional, defaults to .env slug if not provided
}

export default function BookingModal({ show, onClose, company }: BookingModalProps) {
  const defaultCompany = import.meta.env.VITE_COMPANY_SLUG as string;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    notes: "",
  });

  const handleClose = () => {
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
    onClose();
  };

  useEffect(() => {
    if (selectedDate) {
      getAvailability(company || defaultCompany, selectedDate).then(setAvailability);
    }
  }, [selectedDate, company, defaultCompany]);
  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedSlot) return;
    setLoading(true);

    try {
      // ✅ Step 1: Book the slot
      await submitBooking(company || defaultCompany, {
        date: selectedDate,
        slot: selectedSlot,
      });

      // ✅ Step 2: Create appointment record
      const [startTime] = selectedSlot.split("-");
      const appointmentDate = new Date(`${selectedDate}T${startTime}:00`).toISOString();
      await createAppointment(company || defaultCompany, {
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        clientCompany: formData.company,
        appointmentDate,
        notes: formData.notes,
        slot: selectedSlot // ✅ Pass slot here!
      });



      showPopup({
        icon: "success",
        title: "Booked!",
        message: "Your appointment has been successfully scheduled.",
        confirmText: "Go to Home",
        onConfirm: handleClose,
      });
    } catch {
      showPopup({
        icon: "error",
        title: "Booking Failed",
        message:
          "The slot may already be booked or unavailable. Please try another one.",
        confirmText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 bg-white flex flex-col p-0 overflow-y-auto overflow-x-hidden md:bg-black/80 md:items-center md:justify-center"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
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
              className="absolute top-3 right-3 text-gray-600 hover:text-black z-10"
            >
              <X size={24} />
            </button>

            {!showForm ? (
              <>
                {/* ✅ CALENDAR SECTION */}
                <motion.div
                  className="hidden md:block w-full h-full md:w-[40%] relative overflow-hidden rounded-l-2xl"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <img
                    src={leftImage}
                    alt="Meeting"
                    className="h-full w-full object-cover"
                  />
                </motion.div>

                <div className="flex flex-col items-center justify-start px-6 py-6 w-full md:w-[60%]">
                  <img src={logo} alt="Cybernest Logo" className="w-36 mb-4" />
                  <h2 className="text-2xl font-extrabold text-cyberred mb-1 text-center">
                    Book a Free Meeting!
                  </h2>
                  <p className="text-sm text-center text-gray-600 mb-6">
                    Book your free session now—let’s talk about what you need!
                  </p>

                  <div
                    className={`rounded-2xl shadow-md flex flex-col gap-4 transition-all duration-300 bg-cyberlightred p-3 ${
                      selectedDate
                        ? "bg-cyberlightred border border-cyberred w-full max-w-full sm:flex-row"
                        : "inline-block bg-cyberlightred border border-cyberred items-center"
                    }`}
                  >
                    <motion.div
                      className={`${
                        !selectedDate ? "flex justify-center" : "flex-1"
                      } w-full max-w-full box-border`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div className="w-full max-w-full overflow-x-hidden px-1">
                        <AppointmentCalendar onDateClick={setSelectedDate} />
                      </div>
                    </motion.div>

                    {selectedDate && (
                      <div className="flex-1 bg-white rounded-2xl p-4">
                        <h4 className="text-md font-extrabold text-cyberred mb-2 text-center">
                          Select your Schedule!
                        </h4>
                        <p className="text-xs text-gray-500 mb-3">
                          Pick a time that works for you—you’ll be there!
                        </p>
                        <div className="space-y-2 max-h-52 overflow-y-auto pr-2">
                          {availability.map((slotData, i) => {
                            const disabled =
                              slotData.isBooked ||
                              isPastTime(selectedDate, slotData.slot);
                            const isSelected = selectedSlot === slotData.slot;
                            return (
                              <button
                                key={i}
                                disabled={disabled}
                                onClick={() =>
                                  !disabled && setSelectedSlot(slotData.slot)
                                }
                                className={`cursor-pointer w-full py-4 rounded-xl text-sm font-bold border transition-all duration-200 ${
                                  disabled
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-cyberred text-white"
                                    : "bg-cyberlightred hover:bg-gray-100 text-cyberred"
                                }`}
                              >
                                {formatTimeRange(slotData.slot)}
                                {disabled && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    (Fully Booked)
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
                      disabled={!selectedSlot || loading}
                      className={`mt-6 py-2 px-8 text-sm font-semibold rounded-full transition-all duration-200 ${
                        selectedSlot && !loading
                          ? "bg-cyberred text-white hover:opacity-90"
                          : "bg-gray-300 text-white cursor-not-allowed"
                      }`}
                    >
                      {loading ? "Loading..." : "Continue"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* ✅ FULL FORM SECTION */}
                <div className="flex flex-col w-full max-w-full md:flex-row md:h-auto md:w-full bg-white opacity-90 p-4 sm:p-5 z-20">
                  <div className="w-full md:w-[60%] px-3 sm:px-6 py-3 sm:py-6 space-y-2 sm:space-y-4">
                    <img src={logo} alt="Cybernest Logo" className="w-28 sm:w-40 mb-3 sm:mb-6" />
                    <h1 className="text-xl sm:text-3xl font-extrabold text-cyberred">
                      Fill out the Details
                    </h1>
                    <p className="text-sm sm:text-md font-normal text-gray-600 mb-2 sm:mb-4">
                      Book your free session now—let's talk about what you need!
                    </p>

                    {[
                      { label: "Fullname", key: "clientName", placeholder: "Enter your full name" },
                      { label: "Contact No.", key: "phone", placeholder: "09XXXXXXXXX" },
                      { label: "Address", key: "address", placeholder: "Enter your address" },
                      { label: "Email", key: "email", placeholder: "you@example.com" },
                      { label: "Company", key: "company", placeholder: "Company name" }
                    ].map(({ label, key, placeholder }) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <label className="text-sm sm:text-md font-normal sm:w-32">{label}</label>
                        <input
                          type="text"
                          placeholder={placeholder}
                          className="flex-1 rounded-lg bg-cyberlightred px-3 sm:px-4 py-1.5 sm:py-2 text-cyberdark placeholder-cyberred/50 focus:outline-none focus:ring-2 focus:ring-cyberred text-sm"
                          value={formData[key as keyof typeof formData]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        />
                      </div>
                    ))}

                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                      <label className="text-sm sm:text-md sm:w-32 sm:pt-2">Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Anything else we should know?"
                        className="flex-1 rounded-lg bg-cyberlightred px-3 sm:px-4 py-1.5 sm:py-2 text-cyberdark placeholder-cyberred/50 focus:outline-none focus:ring-2 focus:ring-cyberred text-sm"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* ✅ Summary + Confirm */}
                  <div className="w-full md:w-[40%] px-4 sm:px-10 py-4 sm:py-10 border-t md:border-t-0 md:border-l border-cyberred md:mt-14 flex flex-col rounded-xl sm:rounded-3xl">
                    <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                      <h4 className="text-center text-lg font-extrabold text-cyberred mb-1">
                        Appointment Details
                      </h4>
                      <div className="bg-cyberred text-white text-center rounded-lg py-2 mb-4">
                        <div className="font-extrabold text-3xl">
                          {selectedDate
                            ? new Date(selectedDate).toLocaleDateString(undefined, {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Select a Date"}
                        </div>
                        <div className="text-sm">
                          {selectedSlot ? formatTimeRange(selectedSlot) : "Select a Time"}
                        </div>
                      </div>

                      <h5 className="text-center font-bold text-cyberred text-sm mb-2">
                        Personal Details
                      </h5>
                      <div className="text-center text-sm space-y-1 mb-3">
                        <p>{formData.clientName}</p>
                        <p>{formData.phone}</p>
                        <p>{formData.address}</p>
                        <p className="underline">{formData.email}</p>
                        <p>{formData.company}</p>
                      </div>

                      <div
                        className={`bg-cyberlightred/50 text-xs text-start ${
                          formData.notes ? "bg-cyberlightred" : ""
                        } text-gray-600 p-3 rounded mb-3`}
                      >
                        {formData.notes && <>Notes: {formData.notes}</>}
                      </div>
                    </div>

                    <div className="pt-4 mt-auto flex justify-between gap-4">
                      <button
                        onClick={handleClose}
                        className="w-1/2 border border-cyberred text-cyberred font-semibold py-2 rounded-full hover:bg-gray-300"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleBookingSubmit}
                        disabled={loading}
                        className={`w-1/2 bg-cyberred text-white py-2 rounded-full transition ${
                          loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
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
