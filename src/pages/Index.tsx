import { useState } from "react";
import { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";
import BookingForm from "@/components/BookingForm";
import Confirmation from "@/components/Confirmation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import bcBg from "@/assets/bc-bg.jpg";

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
        style={{ backgroundImage: `url(${bcBg})` }}
      >
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-4 text-center">{t.title} — {t.subtitle}</h1>
        <div className="w-full max-w-md bg-card/95 border border-border rounded-md p-5">
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

      <LanguageSwitcher lang={lang} onChange={setLang} />
    </div>
  );
};

export default Index;
