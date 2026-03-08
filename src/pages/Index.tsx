import { useState } from "react";
import { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";
import BookingForm from "@/components/BookingForm";
import Confirmation from "@/components/Confirmation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Car } from "lucide-react";

const Index = () => {
  const [lang, setLang] = useState<Language>("pt");
  const [submitted, setSubmitted] = useState(false);
  const [pickup, setPickup] = useState("");
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-taxi px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-taxi-foreground" />
          <span className="text-taxi-foreground font-bold text-sm tracking-wide uppercase">
            {t.title} — {t.subtitle}
          </span>
        </div>
        <LanguageSwitcher lang={lang} onChange={setLang} />
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-card border border-border rounded-md p-5">
          {submitted ? (
            <Confirmation lang={lang} pickup={pickup} onReset={() => setSubmitted(false)} />
          ) : (
            <BookingForm
              lang={lang}
              onSubmit={(pickupValue) => {
                setPickup(pickupValue);
                setSubmitted(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
