import { useState } from "react";
import { Language, translations } from "@/lib/i18n";
import { MapPin, Clock, Users, Car, Calendar } from "lucide-react";

interface Props {
  lang: Language;
  onSubmit: () => void;
}

const BookingForm = ({ lang, onSubmit }: Props) => {
  const t = translations[lang];
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [needNow, setNeedNow] = useState<boolean | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("1");

  const canSubmit = pickup.trim() && dropoff.trim() && needNow !== null && (needNow || (date && time));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Pickup */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-taxi" />
          {t.pickupLabel}
        </label>
        <input
          type="text"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder={t.pickupPlaceholder}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-taxi/50 transition-all"
          maxLength={200}
          required
        />
      </div>

      {/* Dropoff */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-destructive" />
          {t.dropoffLabel}
        </label>
        <input
          type="text"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          placeholder={t.dropoffPlaceholder}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-taxi/50 transition-all"
          maxLength={200}
          required
        />
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
