import Link from "next/link";
import solar from "@iconify-json/solar/icons.json";

type SolarName = keyof typeof solar.icons;

const categories = {
  telephony: { label: "Téléphonie", icon: "phone-calling-bold-duotone", bg: "#DEF5EC", fg: "#008064" },
  email: { label: "Email", icon: "letter-bold-duotone", bg: "#FCE7EB", fg: "#CE5C70" },
  acquisition: { label: "Acquisition", icon: "magnifer-bold-duotone", bg: "#FFF0D6", fg: "#B7791F" },
  crm: { label: "CRM", icon: "users-group-rounded-bold-duotone", bg: "#E4EEFE", fg: "#4073C5" },
  automation: { label: "Automatisations", icon: "bolt-bold-duotone", bg: "#F0E8FC", fg: "#8760C4" },
  booking: { label: "Rendez-vous", icon: "calendar-bold-duotone", bg: "#DFF4F8", fg: "#25859A" },
  social: { label: "Réseaux sociaux", icon: "share-bold-duotone", bg: "#FBE6F3", fg: "#AD508D" },
  agents: { label: "Agents IA", icon: "headphones-round-bold-duotone", bg: "#EEEEEE", fg: "#525252" },
} satisfies Record<string, {label: string; icon: SolarName; bg: string; fg: string}>;

export type Category = keyof typeof categories;

export function CategoryIcon({ category }: { category: Category }) {
  const { icon, bg, fg } = categories[category];

  return (
    <span className="icon-tile" style={{ backgroundColor: bg, color: fg }}>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        dangerouslySetInnerHTML={{ __html: solar.icons[icon].body }}
      />
    </span>
  );
}

export function CategoryList() {
  return (
    <ul className="category-list">
      {(Object.keys(categories) as Category[]).map((category) => (
        <li key={category}>
          <CategoryIcon category={category} />
          <span>{categories[category].label}</span>
        </li>
      ))}
    </ul>
  );
}

export function PreviewHeader({ board = false }: { board?: boolean }) {
  return (
    <header className="preview-header">
      <div className="preview">
        <Link className="brand" href="/">AutoCall</Link>
        <nav aria-label="Aperçus">
          <Link className="nav-link" href="/" aria-current={board ? undefined : "page"}>Vue d’ensemble</Link>
          <Link className="nav-link" href="/direction-visuelle" aria-current={board ? "page" : undefined}>Composants</Link>
        </nav>
      </div>
    </header>
  );
}

