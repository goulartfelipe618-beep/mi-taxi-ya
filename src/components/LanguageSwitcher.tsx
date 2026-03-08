import { Language } from "@/lib/i18n";

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
  return (
    <div className="flex items-center gap-1">
      {(Object.keys(flags) as Language[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`px-2 py-1 text-xs font-medium rounded ${
            l === lang
              ? "bg-taxi-foreground text-taxi"
              : "text-taxi-foreground/80 hover:text-taxi-foreground"
          }`}
        >
          {flags[l].flag} {flags[l].label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
