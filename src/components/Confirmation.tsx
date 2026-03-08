import { Language, translations } from "@/lib/i18n";
import { CheckCircle, MapPin, MessageCircle, RotateCcw } from "lucide-react";

interface Props {
  lang: Language;
  pickup: string;
  onReset: () => void;
}

const WHATSAPP_NUMBER = "5547960022025";

const Confirmation = ({ lang, pickup, onReset }: Props) => {
  const t = translations[lang];

  const whatsappMessage = encodeURIComponent(`${t.whatsappMsg} ${pickup}`);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

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

      {/* Driver received + WhatsApp */}
      <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-5 space-y-3">
        <p className="text-foreground font-medium">{t.driverReceived}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-white font-semibold hover:bg-green-700 transition-all"
        >
          <MessageCircle className="h-5 w-5" />
          {t.talkNow}
        </a>
      </div>

      {/* Explore attractions */}
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
