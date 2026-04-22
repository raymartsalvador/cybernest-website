import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";
import { PRIVACY_NOTICE_VERSION } from "../pages/Privacy";

const STORAGE_KEY = "cns_consent_v1";
const GA_MEASUREMENT_ID = "G-Z6PMNMXP7W";

type AnalyticsDecision = "granted" | "denied";

interface ConsentRecord {
  analytics: AnalyticsDecision;
  decidedAt: string;
  noticeVersion: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    cybernestOpenConsent?: () => void;
  }
}

function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (
      parsed &&
      (parsed.analytics === "granted" || parsed.analytics === "denied") &&
      typeof parsed.decidedAt === "string" &&
      typeof parsed.noticeVersion === "string"
    ) {
      return parsed as ConsentRecord;
    }
    return null;
  } catch {
    return null;
  }
}

function writeConsent(analytics: AnalyticsDecision): ConsentRecord {
  const record: ConsentRecord = {
    analytics,
    decidedAt: new Date().toISOString(),
    noticeVersion: PRIVACY_NOTICE_VERSION,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // storage blocked — we still apply the decision in-memory for the session
  }
  return record;
}

function applyConsent(analytics: AnalyticsDecision) {
  const gtag = window.gtag;
  if (typeof gtag !== "function") return;
  gtag("consent", "update", {
    analytics_storage: analytics,
  });
  if (analytics === "granted") {
    gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
    });
  }
}

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const existing = readConsent();
    if (existing && existing.noticeVersion === PRIVACY_NOTICE_VERSION) {
      applyConsent(existing.analytics);
      return;
    }
    // No prior decision OR notice version changed — re-prompt.
    setOpen(true);
  }, []);

  useEffect(() => {
    window.cybernestOpenConsent = () => setOpen(true);
    return () => {
      if (window.cybernestOpenConsent) {
        delete window.cybernestOpenConsent;
      }
    };
  }, []);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => acceptRef.current?.focus(), 120);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const handleAccept = useCallback(() => {
    writeConsent("granted");
    applyConsent("granted");
    setOpen(false);
  }, []);

  const handleReject = useCallback(() => {
    writeConsent("denied");
    applyConsent("denied");
    setOpen(false);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cns-consent-title"
          aria-describedby="cns-consent-desc"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-x-3 bottom-3 z-[70] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md font-montserrat"
        >
          <div className="relative rounded-2xl bg-white shadow-xl border border-cyberred/20 p-5 sm:p-6">
            <button
              type="button"
              onClick={handleReject}
              aria-label="Reject non-essential cookies and close"
              className="absolute right-3 top-3 rounded-full p-1 text-cyberviolet/60 hover:bg-cyberlightred hover:text-cyberred transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-3 pr-6">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-cyberlightred text-cyberred">
                <Cookie size={18} />
              </div>
              <div>
                <h2
                  id="cns-consent-title"
                  className="text-base sm:text-lg font-bold text-cyberviolet"
                >
                  We use cookies
                </h2>
                <p
                  id="cns-consent-desc"
                  className="mt-1 text-sm leading-relaxed text-cyberviolet/80"
                >
                  We use Google Analytics to understand how the site is used.
                  No analytics cookies are set until you accept. Essential
                  cookies for site functionality remain on.{" "}
                  <Link
                    to="/cookies"
                    className="text-cyberred underline hover:no-underline"
                  >
                    Cookie details
                  </Link>{" "}
                  ·{" "}
                  <Link
                    to="/privacy"
                    className="text-cyberred underline hover:no-underline"
                  >
                    Privacy Notice
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex h-10 items-center justify-center rounded-full border border-cyberred/30 px-5 text-sm font-semibold text-cyberviolet hover:bg-cyberlightred transition"
              >
                Reject non-essential
              </button>
              <button
                ref={acceptRef}
                type="button"
                onClick={handleAccept}
                className="inline-flex h-10 items-center justify-center rounded-full bg-cyberred px-5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition"
              >
                Accept all
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
