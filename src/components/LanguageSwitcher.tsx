import { useState } from "react";
import { Language, translations } from "@/lib/i18n";
import { Globe } from "lucide-react";

const flags: Record<Language, { flag: string; label: string }> = {
  pt: { flag: "🇧🇷", label: "PT" },
  es: { flag: "🇪🇸", label: "ES" },
  en: { flag: "🇺🇸", label: "EN" },
};

interface Props {
  lang: Language;
  onChange: (lang: Language) => void;
}

const LanguageSwitcher = ({ lang, onChange }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-2 border border-border bg-card rounded shadow-md overflow-hidden">
          {(Object.keys(flags) as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => { onChange(l); setOpen(false); }}
              className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-accent ${l === lang ? "bg-accent font-semibold" : ""}`}
            >
              <span>{flags[l].flag}</span>
              <span className="text-foreground">{flags[l].label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-taxi px-4 py-2.5 text-taxi-foreground text-sm font-medium rounded shadow-md"
      >
        <Globe className="h-4 w-4" />
        {flags[lang].flag} {translations[lang].langSelect}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
