import { useState, useEffect, useRef } from "react";
import { Language, translations } from "@/lib/i18n";
import { MapPin, Clock, Users, Car, Calendar, Navigation } from "lucide-react";
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

  const canSubmit = pickup.trim() && dropoff.trim() && needNow !== null && (needNow || (date && time));

  // Get user location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Close suggestions on outside click
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

        // Reverse geocode
        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=${lang}`
          );
          const data = await res.json();
          if (data.features?.length) {
            setPickup(data.features[0].place_name);
          }
        } catch {
          setPickup(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
        setLocatingUser(false);
      },
      () => setLocatingUser(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Geocode dropoff with debounce
  useEffect(() => {
    if (dropoff.length < 3) {
      setDropoffSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(dropoff)}.json?access_token=${MAPBOX_TOKEN}&proximity=-48.6356,-26.9908&language=${lang}&limit=5`
        );
        const data = await res.json();
        setDropoffSuggestions(data.features || []);
        setShowDropoffSuggestions(true);
      } catch {
        setDropoffSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [dropoff, lang]);

  const selectDropoff = (result: GeocodingResult) => {
    setDropoff(result.place_name);
    setDropoffCoords(result.center);
    setShowDropoffSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) onSubmit(pickup);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Map */}
      {(pickupCoords || dropoffCoords) && (
        <MapboxRoute pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
      )}

      {/* Pickup */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-taxi" />
          {t.pickupLabel}
        </label>
        <div className="relative">
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder={t.pickupPlaceholder}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-taxi/50 transition-all text-sm"
            maxLength={200}
            required
          />
          <button
            type="button"
            onClick={getUserLocation}
            disabled={locatingUser}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-taxi hover:bg-taxi/10 transition-colors disabled:opacity-50"
            title={t.useMyLocation}
          >
            <Navigation className={`h-4 w-4 ${locatingUser ? "animate-pulse" : ""}`} />
          </button>
        </div>
      </div>

      {/* Dropoff */}
      <div className="space-y-2" ref={dropoffRef}>
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-destructive" />
          {t.dropoffLabel}
        </label>
        <input
          type="text"
          value={dropoff}
          onChange={(e) => {
            setDropoff(e.target.value);
            setDropoffCoords(null);
          }}
          onFocus={() => dropoffSuggestions.length > 0 && setShowDropoffSuggestions(true)}
          placeholder={t.dropoffPlaceholder}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-taxi/50 transition-all text-sm"
          maxLength={200}
          required
        />
        {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
          <ul className="absolute z-50 w-[calc(100%-3rem)] mt-1 rounded-xl border border-border bg-card shadow-lg overflow-hidden">
            {dropoffSuggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => selectDropoff(s)}
                className="px-4 py-3 text-sm text-foreground hover:bg-accent cursor-pointer border-b border-border last:border-0 flex items-start gap-2"
              >
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span>{s.place_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Need now? */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Clock className="h-4 w-4 text-taxi" />
          {t.needNow}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setNeedNow(true)}
            className={`rounded-xl border-2 px-4 py-3 font-semibold transition-all ${
              needNow === true
                ? "border-taxi bg-taxi/10 text-taxi"
                : "border-border text-muted-foreground hover:border-taxi/50"
            }`}
          >
            {t.yes}
          </button>
          <button
            type="button"
            onClick={() => setNeedNow(false)}
            className={`rounded-xl border-2 px-4 py-3 font-semibold transition-all ${
              needNow === false
                ? "border-taxi bg-taxi/10 text-taxi"
                : "border-border text-muted-foreground hover:border-taxi/50"
            }`}
          >
            {t.no}
          </button>
        </div>
        {needNow === true && (
          <p className="text-sm text-taxi font-medium animate-in fade-in slide-in-from-top-1">
            ⚡ {t.nowDesc}
          </p>
        )}
      </div>

      {/* Schedule */}
      {needNow === false && (
        <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="h-4 w-4 text-taxi" />
              {t.dateLabel}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-taxi/50 transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="h-4 w-4 text-taxi" />
              {t.timeLabel}
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-taxi/50 transition-all"
              required
            />
          </div>
        </div>
      )}

      {/* Passengers */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Users className="h-4 w-4 text-taxi" />
          {t.passengersLabel}
        </label>
        <select
          value={passengers}
          onChange={(e) => setPassengers(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-taxi/50 transition-all"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-xl bg-taxi py-4 text-taxi-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        <Car className="h-5 w-5" />
        {t.sendButton}
      </button>
    </form>
  );
};

export default BookingForm;
