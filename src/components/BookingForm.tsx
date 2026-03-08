import { useState, useEffect, useRef } from "react";
import { Language, translations } from "@/lib/i18n";
import { MapPin, Navigation } from "lucide-react";
import MapboxRoute from "./MapboxRoute";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZmVsaXBlZ291bGFydDIiLCJhIjoiY21qN2VzYTNlMDM3NjNkcHd3Y2k2cnoxZCJ9.7-STZWkuwiE74kLYzjhJ9g";

interface Props {
  lang: Language;
  onSubmit: (pickup: string) => void;
}

interface GeocodingResult {
  place_name: string;
  center: [number, number];
}

const BookingForm = ({ lang, onSubmit }: Props) => {
  const t = translations[lang];
  const [fullName, setFullName] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [needNow, setNeedNow] = useState<boolean | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("1");

  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<[number, number] | null>(null);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<GeocodingResult[]>([]);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);
  const dropoffRef = useRef<HTMLDivElement>(null);

  const canSubmit = fullName.trim() && pickup.trim() && dropoff.trim() && needNow !== null && (needNow || (date && time));

  const inputClass = "w-full border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-taxi rounded";

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropoffRef.current && !dropoffRef.current.contains(e.target as Node)) {
        setShowDropoffSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) return;
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;
        setPickupCoords([lng, lat]);
        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=${lang}`
          );
          const data = await res.json();
          if (data.features?.length) setPickup(data.features[0].place_name);
        } catch {
          setPickup(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
        setLocatingUser(false);
      },
      () => setLocatingUser(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (dropoff.length < 3) { setDropoffSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(dropoff)}.json?access_token=${MAPBOX_TOKEN}&proximity=-48.6356,-26.9908&language=${lang}&limit=5`
        );
        const data = await res.json();
        setDropoffSuggestions(data.features || []);
        setShowDropoffSuggestions(true);
      } catch { setDropoffSuggestions([]); }
    }, 400);
    return () => clearTimeout(timer);
  }, [dropoff, lang]);

  const selectDropoff = (result: GeocodingResult) => {
    setDropoff(result.place_name);
    setDropoffCoords(result.center);
    setShowDropoffSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      await fetch("https://n8n.e-transporte.pro/webhook-test/2010afd7-1acf-4bdf-8223-bc7e3100df56", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({
          origem: pickup,
          destino: dropoff,
          precisaAgora: needNow,
          data: needNow ? null : date,
          hora: needNow ? null : time,
          passageiros: Number(passengers),
          telefones: ["47988336609", "47996002025"],
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Webhook error:", err);
    }

    onSubmit(pickup);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Map */}
      {(pickupCoords || dropoffCoords) && (
        <MapboxRoute pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
      )}

      {/* Pickup */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">{t.pickupLabel}</label>
        <div className="relative">
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder={t.pickupPlaceholder}
            className={`${inputClass} pr-8`}
            maxLength={200}
            required
          />
          <button
            type="button"
            onClick={getUserLocation}
            disabled={locatingUser}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-taxi hover:text-taxi/80 disabled:opacity-50"
            title={t.useMyLocation}
          >
            <Navigation className={`h-4 w-4 ${locatingUser ? "animate-pulse" : ""}`} />
          </button>
        </div>
      </div>

      {/* Dropoff */}
      <div className="space-y-1 relative" ref={dropoffRef}>
        <label className="text-xs font-semibold text-foreground">{t.dropoffLabel}</label>
        <input
          type="text"
          value={dropoff}
          onChange={(e) => { setDropoff(e.target.value); setDropoffCoords(null); }}
          onFocus={() => dropoffSuggestions.length > 0 && setShowDropoffSuggestions(true)}
          placeholder={t.dropoffPlaceholder}
          className={inputClass}
          maxLength={200}
          required
        />
        {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
          <ul className="absolute z-50 left-0 right-0 mt-1 border border-border bg-card shadow-md rounded text-sm">
            {dropoffSuggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => selectDropoff(s)}
                className="px-3 py-2 hover:bg-accent cursor-pointer border-b border-border last:border-0 flex items-start gap-2"
              >
                <MapPin className="h-3 w-3 text-muted-foreground mt-1 shrink-0" />
                <span className="text-foreground">{s.place_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Need now */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">{t.needNow}</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setNeedNow(true)}
            className={`border px-3 py-2 text-sm font-medium rounded ${
              needNow === true ? "border-taxi bg-taxi/10 text-taxi" : "border-border text-muted-foreground hover:border-taxi/50"
            }`}
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => setNeedNow(false)}
            className={`border px-3 py-2 text-sm font-medium rounded ${
              needNow === false ? "border-taxi bg-taxi/10 text-taxi" : "border-border text-muted-foreground hover:border-taxi/50"
            }`}
          >
            {t.no}
          </button>
        </div>
        {needNow === true && (
          <p className="text-xs text-taxi font-medium">⚡ {t.nowDesc}</p>
        )}
      </div>

      {/* Schedule */}
      {needNow === false && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">{t.dateLabel}</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">{t.timeLabel}</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} required />
          </div>
        </div>
      )}

      {/* Passengers */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">{t.passengersLabel}</label>
        <select value={passengers} onChange={(e) => setPassengers(e.target.value)} className={inputClass}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-taxi py-2.5 text-taxi-foreground font-bold text-sm rounded disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {t.sendButton}
      </button>
    </form>
  );
};

export default BookingForm;
