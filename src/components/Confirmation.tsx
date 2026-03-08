import { Language, translations } from "@/lib/i18n";
import { CheckCircle, MapPin, RotateCcw } from "lucide-react";

interface Props {
  lang: Language;
  onReset: () => void;
}

const Confirmation = ({ lang, onReset }: Props) => {
  const t = translations[lang];

  return (
    <div className="space-y-6 text-center animate-in fade-in zoom-in-95">
      <div className="flex justify-center">
        <div className="rounded-full bg-taxi/20 p-4">
          <CheckCircle className="h-12 w-12 text-taxi" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t.confirmTitle}</h2>
        <p className="text-lg text-muted-foreground">{t.confirmMsg}</p>
      </div>

      <div className="rounded-xl bg-accent/50 border border-border p-5 space-y-3">
        <p className="text-foreground font-medium">{t.waitMsg}</p>
        <a
          href="https://www.google.com/search?q=atrações+balneário+camboriú"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-primary-foreground font-semibold hover:opacity-90 transition-all"
        >
          <MapPin className="h-4 w-4" />
          {t.exploreButton}
        </a>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
        {t.newRide}
      </button>
    </div>
  );
};

export default Confirmation;
