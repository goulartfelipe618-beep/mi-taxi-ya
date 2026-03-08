import { Language, translations } from "@/lib/i18n";
import { CheckCircle, MessageCircle, RotateCcw, MapPin } from "lucide-react";

interface Props {
  lang: Language;
  pickup: string;
  onReset: () => void;
}

const WHATSAPP_NUMBER = "5547996002025";

const Confirmation = ({ lang, pickup, onReset }: Props) => {
  const t = translations[lang];
  const whatsappMessage = encodeURIComponent(`${t.whatsappMsg} ${pickup}`);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <CheckCircle className="h-6 w-6 text-taxi shrink-0" />
        <div>
          <h2 className="text-base font-bold text-foreground">{t.confirmTitle}</h2>
          <p className="text-sm text-muted-foreground">{t.confirmMsg}</p>
        </div>
      </div>

      <div className="border border-border rounded p-3 space-y-2">
        <p className="text-sm text-foreground">{t.driverReceived}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 px-4 py-2 text-white text-sm font-medium rounded hover:bg-green-700"
        >
          <MessageCircle className="h-4 w-4" />
          {t.talkNow}
        </a>
      </div>

      <div className="border border-border rounded p-3 space-y-2">
        <p className="text-sm text-foreground">{t.waitMsg}</p>
        <a
          href="https://www.google.com/search?q=atrações+balneário+camboriú"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-primary-foreground text-sm font-medium rounded hover:opacity-90"
        >
          <MapPin className="h-3 w-3" />
          {t.exploreButton}
        </a>
      </div>

      <button
        onClick={onReset}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="h-3 w-3" />
        {t.newRide}
      </button>
    </div>
  );
};

export default Confirmation;
