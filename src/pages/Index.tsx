import { useState } from "react";
import { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";
import BookingForm from "@/components/BookingForm";
import Confirmation from "@/components/Confirmation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import heroBg from "@/assets/hero-bg.jpg";
import { Car } from "lucide-react";

const Index = () => {
  const [lang, setLang] = useState<Language>("pt");
  const [submitted, setSubmitted] = useState(false);
  const [pickup, setPickup] = useState("");
  const t = translations[lang];

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex items-center gap-3 rounded-full bg-taxi px-6 py-2 mb-4">
            <Car className="h-6 w-6 text-taxi-foreground" />
            <span className="text-taxi-foreground font-bold text-sm tracking-wider uppercase">24H</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground drop-shadow-lg">
            {t.title}
          </h1>
          <p className="text-xl text-primary-foreground/80 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-md rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl p-6 md:p-8">
          {submitted ? (
            <Confirmation lang={lang} pickup={pickup} onReset={() => setSubmitted(false)} />
          ) : (
            <BookingForm lang={lang} onSubmit={(pickupValue) => { setPickup(pickupValue); setSubmitted(true); }} />
          )}
        </div>
      </div>

      <LanguageSwitcher lang={lang} onChange={setLang} />
    </div>
  );
};

export default Index;
