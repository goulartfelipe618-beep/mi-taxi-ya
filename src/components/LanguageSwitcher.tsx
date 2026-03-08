import { useState } from "react";
import { Language, translations } from "@/lib/i18n";
import { Globe } from "lucide-react";

const flags: Record<Language, { flag: string; label: string }> = {
  pt: { flag: "🇧🇷", label: "Português" },
  es: { flag: "🇪🇸", label: "Español" },
  en: { flag: "🇺🇸", label: "English" },
};

interface Props {
  lang: Language;
  onChange: (lang: Language) => void;
}

const LanguageSwitcher = ({ lang, onChange }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-2 rounded-xl bg-card border border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          {(Object.keys(flags) as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => { onChange(l); setOpen(false); }}
              className={`flex items-center gap-3 w-full px-5 py-3 text-sm transition-colors hover:bg-accent ${l === lang ? "bg-accent font-semibold" : ""}`}
            >
              <span className="text-xl">{flags[l].flag}</span>
              <span className="text-card-foreground">{flags[l].label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-taxi px-5 py-3 text-taxi-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 font-medium"
      >
        <Globe className="h-5 w-5" />
        <span className="text-xl">{flags[lang].flag}</span>
        <span className="text-sm">{translations[lang].langSelect}</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
