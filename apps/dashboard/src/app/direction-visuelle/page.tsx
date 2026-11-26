import Link from "next/link";
import { Status } from "@autocall/ui";
import { LibraryPreview } from "./library-preview";
import { CategoryList, PreviewHeader } from "./preview";

const neutrals = [
  "#FFFFFF", "#FCFCFC", "#F8F8F8", "#F2F2F2", "#EFEFEF", "#E5E5E5", "#D4D4D4",
  "#A3A3A3", "#737373", "#525252", "#404040", "#262626", "#171717", "#0A0A0A",
];

export default function DesignDirection() {
  return (
    <>
      <PreviewHeader board />
      <main className="preview">
        <div className="page-intro">
          <h1 className="page-title">Direction visuelle</h1>
          <p>Planche de composants · espace client</p>
        </div>
        <div className="board-grid">
          <section className="card">
            <h2 className="section-title group-heading">Palette neutre</h2>
            <ul className="palette">
              {neutrals.map((color) => (
                <li key={color}>
                  <div className="swatch" style={{ background: color }} aria-hidden="true" />
                  <code className="mono">{color}</code>
                </li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2 className="section-title group-heading">Typographie et surfaces</h2>
            <div className="type-samples">
              <p className="metric">8 450 €</p>
              <p className="section-title">Titre de section</p>
              <p>Geist Sans · texte courant 14 px</p>
              <p className="mono muted">Geist Mono · données 13 px</p>
            </div>
            <details className="disclosure">
              <summary>Espacements et rayons</summary>
              <p className="muted">Unité 4 px, écart 16 px, carte 12 px, champ 8 px, dialogue 16 px. Ombre neutre légère.</p>
            </details>
          </section>
          <section className="card">
            <h2 className="section-title group-heading">Icônes Solar Bold Duotone</h2>
            <CategoryList />
          </section>
          <section className="card">
            <h2 className="section-title group-heading">États et actions</h2>
            <ul className="status-list">
              <li><Status kind="success">Confirmé</Status></li>
              <li><Status kind="warning">À vérifier</Status></li>
              <li><Status kind="danger">Échec</Status></li>
              <li><Status kind="info">Planifié</Status></li>
              <li><Status kind="ai">Synthèse IA</Status></li>
            </ul>
            <div className="actions mt-4">
              <Link className="action action-primary" href="/">Voir l’écran</Link>
              <a className="action" href="#etat-vide">Voir l’état vide</a>
            </div>
          </section>
          <section className="card scroll-mt-4" id="etat-vide" tabIndex={-1}>
            <h2 className="section-title">Aucune activité</h2>
            <p className="muted mt-2">Les prochains appels et rendez-vous apparaîtront ici.</p>
          </section>
        </div>
        <LibraryPreview />
      </main>
    </>
  );
}
