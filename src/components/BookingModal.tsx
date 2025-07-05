
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { showPopup } from "./PopupService";
import AppointmentCalendar from "./AppointmentCalendar";
import leftImage from "../assets/images/123.png";
import logo from "../assets/images/logo.png"; // 🔄 Adjust if needed
import gridBg from "../assets/images/grid-bg.png";

const baseAPIUrl = import.meta.env.VITE_API_URL;

export default function BookingModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availability, setAvailability] = useState<{ time: string; isBooked: boolean }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
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

 const resetState = () => {
    setSelectedDate(null);
    setAvailability([]);
    setSelectedTime(null);
    setShowForm(false);
    setFormData({ clientName: "", email: "", phone: "", address: "", company: "", notes: "" });
    };
    
  useEffect(() => {
    if (selectedDate) {
      fetch(`${baseAPIUrl}/showTimeAvailability?date=${selectedDate}`)
        .then((res) => res.json())
        .then((data) => setAvailability(data.availability))
        .catch(() => setAvailability([]));
    }
  }, [selectedDate]);

  const isPastTime = (time: string) => {
    if (!selectedDate) return false;

    const now = new Date();
    const selected = new Date(selectedDate);
    if (selected.toDateString() !== now.toDateString()) return false;

    const [hours, minutes] = time.split(":").map(Number);
    const timeDate = new Date(selected);
    timeDate.setHours(hours, minutes, 0, 0);

    return timeDate < now;
  };

  const handleBookingSubmit = async () => {
  if (!selectedDate || !selectedTime) return;
  setLoading(true);

  try {
    const datetimeStr = `${selectedDate}T${selectedTime}:00`;
    const localDate = new Date(datetimeStr);
    if (isNaN(localDate.getTime())) {
      showPopup({
        icon: 'error',
        title: 'Invalid Date or Time',
        message: 'Please select a valid date and time.',
        confirmText: 'OK'
      });
      setLoading(false);
      return;
    }

    const utcDateStr = localDate.toISOString();

    const payload = {
      clientName: formData.clientName,
      email: formData.email,
      phone: formData.phone,
      datetime: utcDateStr,
      notes: `Company: ${formData.company} | Address: ${formData.address} | Notes: ${formData.notes}`,
    };

    const res = await fetch(`${baseAPIUrl}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Booking failed");

    // 🎉 Success Popup
    showPopup({
      icon: 'success',
      title: 'Booked!',
      message: 'Thank you! Your appointment has been scheduled successfully.',
      confirmText: 'Go to Home',
      onConfirm: () => {
        onClose();
        resetState();
      }
    });

  } catch (error) {
    showPopup({
      icon: 'error',
      title: 'Booking Failed',
      message: 'Something went wrong. Please try again later.',
      confirmText: 'Go to Home'
    });
  } finally {
    setLoading(false);
  }
};

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl h-[90vh] rounded-2xl shadow-lg overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            resetState();
          }}
          className="absolute top-3 right-3 text-gray-600 hover:text-black z-10"
        >
          <X size={24} />
        </button>

        <div className="grid h-full grid-cols-1 md:grid-cols-2">
          {/* Left Image */}
          {/* Left Panel: Image or Form */}
          <div className="relative overflow-hidden rounded-l-2xl px-3 py-3 bg-white hidden md:block">
            {!showForm ? (
              <img
                src={leftImage}
                alt="Book Meeting"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="p-2 overflow-auto h-full">
                <h4 className="text-lg font-semibold text-cyberred mb-3">Fill out the Details</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border p-2 rounded"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Contact Number"
                    className="w-full border p-2 rounded"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full border p-2 rounded"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    className="w-full border p-2 rounded"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                  <textarea
                    placeholder="Notes (Optional)"
                    className="w-full border p-2 rounded"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>


          {/* Right Side */}
          <div
            className="p-5 overflow-auto bg-gray-50 bg-cover bg-center"
            style={{ backgroundImage: `url(${gridBg})` }}
            >
            {!selectedDate ? (
              <>
                <div className="text-center space-y-2 mb-4">
                  <img src={logo} alt="Logo" className="w-25 mx-auto" />
                  <h3 className="text-2xl font-bold text-cyberred">Book a free meeting!</h3>
                  <p className="text-xs text-gray-600">
                    Book your free session now—let’s talk about what you need!
                  </p>
                </div>
                <AppointmentCalendar onDateClick={setSelectedDate} />
              </>
            ) : !showForm ? (
              <>
                <h3 className="text-lg font-semibold mb-2">
                  Available Times on <span className="text-cyberred">{selectedDate}</span>
                </h3>
                {availability.length === 0 ? (
                  <p className="text-sm text-gray-500">Loading or no availability.</p>
                ) : (
                  <ul className="space-y-2">
                    {availability.map((slot, i) => {
                      const disabled = slot.isBooked || isPastTime(slot.time);
                      return (
                        <li
                          key={i}
                          className={`px-4 py-2 rounded-lg border flex justify-between items-center ${
                            slot.isBooked
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : isPastTime(slot.time)
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-cyberred text-white hover:opacity-90 cursor-pointer"
                          }`}
                          onClick={() => !disabled && setSelectedTime(slot.time)}
                        >
                          <span>{slot.time}</span>
                          {slot.isBooked && (
                            <span className="ml-2 text-xs font-semibold">Booked</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {selectedTime && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-cyberred text-white py-2 px-6 rounded-full mt-4 hover:opacity-90 transition"
                  >
                    Continue
                  </button>
                )}
              </>
            ) : (
              <div className="mt-2">
     
                {/* Booking Receipt */}
                <div className="bg-white border border-cyberred rounded-lg p-4 text-sm">
                  <h4 className="text-lg font-bold text-center text-cyberred mb-2">Appointment Details</h4>
                  <p className="text-center text-gray-600 mb-2">
                    Let’s talk about what you need for Free!
                  </p>
                  <div className="bg-cyberred text-white rounded-md py-2 text-center font-semibold mb-4">
                    <div>
                      {new Date(selectedDate).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div>{selectedTime}</div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold text-cyberred">Personal Details</h5>
                    <p>{formData.clientName || ""}</p>
                    <p>{formData.phone || ""}</p>
                    <p>{formData.address || ""}</p>
                    <p>{formData.email || ""}</p>
                    <p>{formData.company || ""}</p>
                    <p className="p-2 bg-cyberlightred" style={{borderRadius:"10px"}}>{formData.notes || "No additional notes"}</p>
                  </div>
                  <button
                    onClick={handleBookingSubmit}
                    disabled={loading}
                    className={`w-full mt-4 bg-cyberred text-white py-2 rounded-full transition ${
                      loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                    }`}
                  >
                    {loading ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
