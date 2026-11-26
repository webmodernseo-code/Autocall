"use client";

import type {
  CompanyRecord,
  ContactRecord,
  OfferRecord,
} from "./acquisition-data";
import { SolarIcon } from "../workspace-navigation";

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Fermer la fiche"
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] cursor-pointer"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
    </button>
  );
}

export function CompanyDetailDrawer({
  company,
  onClose,
  onFindDeciders,
  onAddToCrm,
  addedToCrm,
}: {
  company: CompanyRecord;
  onClose: () => void;
  onFindDeciders: (companyId: string) => void;
  onAddToCrm: (id: string) => void;
  addedToCrm: boolean;
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-[#171717]/25 backdrop-blur-[1px]"
      />
      <aside
        aria-label={`Fiche ${company.name}`}
        className="relative z-10 flex h-dvh w-full max-w-lg flex-col overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: company.tintBg, color: company.tintFg }}
            >
              <SolarIcon name="crm" className="size-5" />
            </span>
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--foreground)]">
                {company.name}
              </h3>
              <p className="text-[13.5px] text-[var(--text-secondary)]">
                {company.sectorDetail}
              </p>
              <p className="text-[14px] text-[var(--text-muted)]">
                {company.city}, {company.country}
              </p>
            </div>
          </div>
          <CloseButton onClose={onClose} />
        </div>

        {/* 3 cartes KPI double surface */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-[var(--surface-inset)] p-3">
            <p className="text-[13px] text-[var(--text-muted)]">Pertinence</p>
            <p className="mt-1 text-[20px] font-semibold text-[var(--foreground)] tabular-nums">
              {company.score}/100
            </p>
          </div>
          <div className="rounded-xl bg-[var(--surface-inset)] p-3">
            <p className="text-[13px] text-[var(--text-muted)]">
              Offres actives
            </p>
            <p className="mt-1 text-[20px] font-semibold text-[var(--foreground)] tabular-nums">
              {company.signalCount}
            </p>
          </div>
          <div className="rounded-xl bg-[var(--surface-inset)] p-3">
            <p className="text-[13px] text-[var(--text-muted)]">Décideurs</p>
            <p className="mt-1 text-[20px] font-semibold text-[var(--foreground)] tabular-nums">
              {company.decidersCount}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onAddToCrm(company.id)}
            className={`inline-flex h-9 items-center rounded-lg px-3.5 text-[14px] font-medium transition-colors cursor-pointer ${
              addedToCrm
                ? "bg-[var(--brand-soft)] text-[var(--brand-text)]"
                : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
            }`}
          >
            {addedToCrm ? "Ajout simulé au CRM" : "+ Ajouter au CRM (démo)"}
          </button>
          <button
            type="button"
            onClick={() => onFindDeciders(company.id)}
            className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 text-[14px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-hover)] cursor-pointer"
          >
            Trouver les décideurs
          </button>
        </div>

        {/* Informations générales */}
        <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
          <h4 className="text-[13.5px] font-semibold text-[var(--foreground)]">
            Informations générales
          </h4>
          <dl className="mt-3 divide-y divide-[var(--border-subtle)] text-[14px]">
            <div className="flex justify-between py-2.5">
              <dt className="text-[var(--text-muted)]">Effectif</dt>
              <dd className="font-medium text-[var(--foreground)]">
                {company.size} salariés
              </dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-[var(--text-muted)]">Chiffre d’affaires</dt>
              <dd className="text-[var(--text-secondary)]">Non disponible</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-[var(--text-muted)]">
                SIREN / identifiant légal
              </dt>
              <dd className="text-[var(--text-secondary)]">Non renseigné</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-[var(--text-muted)]">Date de création</dt>
              <dd className="text-[var(--text-secondary)]">Non renseignée</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-[var(--text-muted)]">Site internet</dt>
              <dd className="text-[var(--text-secondary)]">Non renseigné</dd>
            </div>
          </dl>
        </div>

        {/* Signaux commerciaux */}
        {company.offers.length > 0 && (
          <div className="mt-5 border-t border-[var(--border-subtle)] pt-5">
            <div className="flex items-center justify-between">
              <h4 className="text-[13.5px] font-semibold text-[var(--foreground)]">
                Signaux commerciaux
              </h4>
              <span className="text-[13.5px] text-[var(--text-muted)]">
                {company.signalCount} offres
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {company.offers.map((off) => (
                <li
                  key={off.title}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] p-3"
                >
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF0D6] text-[#B7791F]">
                    <SolarIcon name="acquisition" className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-[var(--foreground)]">
                      {off.title}
                    </p>
                    <p className="text-[13px] text-[var(--text-muted)]">
                      {off.location}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Analyse de pertinence */}
        <div className="mt-5 border-t border-[var(--border-subtle)] pt-5">
          <h4 className="text-[13.5px] font-semibold text-[var(--foreground)]">
            Analyse de pertinence
          </h4>
          <p className="mt-2 text-[14px] leading-5 text-[var(--text-secondary)]">
            {company.relevanceNote}
          </p>
          <p className="mt-3 text-[13px] text-[var(--text-muted)]">
            Fiche fictive. Les identifiants et les coordonnées manquants ne sont
            volontairement pas inventés.
          </p>
        </div>
      </aside>
    </div>
  );
}

export function ContactDetailDrawer({
  contact,
  onClose,
  onAddToCrm,
  addedToCrm,
  onEnrich,
}: {
  contact: ContactRecord;
  onClose: () => void;
  onAddToCrm: (id: string) => void;
  addedToCrm: boolean;
  onEnrich: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-[#171717]/25 backdrop-blur-[1px]"
      />
      <aside
        aria-label={`Fiche ${contact.name}`}
        className="relative z-10 flex h-dvh w-full max-w-lg flex-col overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold"
              style={{ backgroundColor: contact.avatarBg, color: contact.avatarFg }}
            >
              {contact.initials}
            </span>
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--foreground)]">
                {contact.name}
              </h3>
              <p className="text-[13.5px] text-[var(--text-secondary)]">
                {contact.role}
              </p>
              <p className="text-[14px] text-[var(--text-muted)]">
                {contact.companyName} · {contact.city}, France
              </p>
            </div>
          </div>
          <CloseButton onClose={onClose} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onAddToCrm(contact.id)}
            className={`inline-flex h-9 items-center rounded-lg px-3.5 text-[14px] font-medium transition-colors cursor-pointer ${
              addedToCrm
                ? "bg-[var(--brand-soft)] text-[var(--brand-text)]"
                : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
            }`}
          >
            {addedToCrm ? "Ajout simulé au CRM" : "Ajouter au CRM (démo)"}
          </button>
          <button
            type="button"
            disabled={contact.emailStatus === "verified"}
            onClick={() => onEnrich(contact.id)}
            className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 text-[14px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-hover)] cursor-pointer"
          >
            {contact.emailStatus === "verified" ? "Email vérifié (démo)" : "Enrichir l’email"}
          </button>
        </div>

        {/* Pertinence commerciale */}
        <div className="mt-5 rounded-xl bg-[var(--surface-inset)] p-4">
          <div className="flex items-center justify-between text-[13.5px]">
            <span className="font-medium text-[var(--foreground)]">
              Pertinence commerciale
            </span>
            <span className="font-semibold text-[var(--foreground)] tabular-nums">
              {contact.score}/100
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#D4D4D4]">
            <div
              className="h-full rounded-full bg-[var(--brand-primary)]"
              style={{ width: `${contact.score}%` }}
            />
          </div>
          <p className="mt-2 text-[13px] text-[var(--text-muted)]">
            Fonction, entreprise, secteur et localisation compatibles avec votre
            cible.
          </p>
        </div>

        {/* Coordonnées professionnelles */}
        <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
          <h4 className="text-[13.5px] font-semibold text-[var(--foreground)]">
            Coordonnées professionnelles
          </h4>
          <ul className="mt-3 divide-y divide-[var(--border-subtle)] text-[14px]">
            <li className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[#FCE7EB] text-[#CE5C70]">
                  <SolarIcon name="mail" className="size-4" />
                </span>
                <div>
                  <p className="text-[13px] text-[var(--text-muted)]">
                    Email professionnel
                  </p>
                  <p className="font-medium text-[var(--foreground)]">
                    {contact.emailSample ?? "Non enrichi"}
                  </p>
                </div>
              </div>
              <span
                className={`text-[13px] font-medium ${
                  contact.emailStatus === "verified"
                    ? "text-[var(--brand-text)]"
                    : contact.emailStatus === "verify"
                      ? "text-[var(--warning)]"
                      : "text-[var(--text-muted)]"
                }`}
              >
                {contact.emailStatus === "verified"
                  ? "Vérifié"
                  : contact.emailStatus === "verify"
                    ? "À vérifier"
                    : "À enrichir"}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[#DEF5EC] text-[#008064]">
                  <SolarIcon name="phone" className="size-4" />
                </span>
                <div>
                  <p className="text-[13px] text-[var(--text-muted)]">
                    Téléphone professionnel
                  </p>
                  <p className="font-medium text-[var(--foreground)]">
                    {contact.phoneEnriched ? "+33 4 72 00 00 00" : "Non enrichi"}
                  </p>
                </div>
              </div>
              <span className="text-[13px] text-[var(--text-muted)]">
                {contact.phoneEnriched ? "Enrichi" : "À enrichir"}
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-5 border-t border-[var(--border-subtle)] pt-5">
          <h4 className="text-[13.5px] font-semibold text-[var(--foreground)]">
            Provenance des données
          </h4>
          <p className="mt-1.5 text-[13.5px] text-[var(--text-secondary)]">
            Éligibilité à la prospection non évaluée. Les sources, méthodes et dates de vérification sont accessibles pour
            chaque information.
          </p>
          <p className="mt-2 text-[13px] text-[var(--text-muted)]">
            Fiche et coordonnées entièrement fictives.
          </p>
        </div>
      </aside>
    </div>
  );
}

export function OfferDetailDrawer({
  offer,
  onClose,
  onFindDeciders,
  onOpenCompany,
}: {
  offer: OfferRecord;
  onClose: () => void;
  onFindDeciders: (companyId: string) => void;
  onOpenCompany: (companyId: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-[#171717]/25 backdrop-blur-[1px]"
      />
      <aside
        aria-label={`Offre ${offer.title}`}
        className="relative z-10 flex h-dvh w-full max-w-lg flex-col overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0D6] text-[#B7791F]">
              <SolarIcon name="acquisition" className="size-5" />
            </span>
            <div>
              <h3 className="text-[18px] font-semibold text-[var(--foreground)]">
                {offer.title}
              </h3>
              <p className="text-[13.5px] text-[var(--text-secondary)]">
                {offer.companyName}
              </p>
              <p className="text-[14px] text-[var(--text-muted)]">
                {offer.city} · {offer.contract} · {offer.publishedAgo}
              </p>
            </div>
          </div>
          <CloseButton onClose={onClose} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[var(--surface-inset)] p-3.5">
            <p className="text-[13px] text-[var(--text-muted)]">
              Pertinence commerciale
            </p>
            <p className="mt-1 text-[20px] font-semibold text-[var(--foreground)] tabular-nums">
              {offer.score}/100
            </p>
          </div>
          <div className="rounded-xl bg-[var(--surface-inset)] p-3.5">
            <p className="text-[13px] text-[var(--text-muted)]">
              Offres dans l’entreprise
            </p>
            <p className="mt-1 text-[20px] font-semibold text-[var(--foreground)] tabular-nums">
              {offer.companyOffersCount}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <h4 className="text-[13.5px] font-semibold text-[var(--foreground)]">
            Description de l’annonce
          </h4>
          <p className="mt-1.5 text-[14px] leading-5 text-[var(--text-secondary)]">
            {offer.description}
          </p>
        </div>

        <div className="mt-5">
          <h4 className="text-[13.5px] font-semibold text-[var(--foreground)]">
            Compétences détectées
          </h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {offer.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 py-1 text-[13px] font-medium text-[var(--text-secondary)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h4 className="text-[13.5px] font-semibold text-[var(--foreground)]">
              Analyse commerciale
            </h4>
            <span className="text-[13px] font-medium text-[var(--ai)]">
              Générée par IA
            </span>
          </div>
          <div className="mt-2 divide-y divide-[var(--border-subtle)] rounded-xl bg-[var(--surface-inset)] p-3.5 text-[14px]">
            <div className="pb-2.5">
              <p className="text-[12.5px] font-medium text-[var(--text-muted)]">
                Signal observé
              </p>
              <p className="mt-0.5 text-[var(--foreground)]">
                {offer.signalObserved}
              </p>
            </div>
            <div className="py-2.5">
              <p className="text-[12.5px] font-medium text-[var(--text-muted)]">
                Opportunité potentielle
              </p>
              <p className="mt-0.5 text-[var(--foreground)]">
                {offer.potentialOpportunity}
              </p>
            </div>
            <div className="pt-2.5">
              <p className="text-[12.5px] font-medium text-[var(--text-muted)]">
                Informations non confirmées
              </p>
              <p className="mt-0.5 text-[var(--foreground)]">
                {offer.unconfirmedInfo}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h4 className="text-[13.5px] font-semibold text-[var(--foreground)]">
            Interlocuteurs recommandés
          </h4>
          <ul className="mt-2 space-y-2">
            {offer.recommendedRoles.map((role) => (
              <li
                key={role}
                className="flex items-center gap-2.5 text-[14px] text-[var(--foreground)]"
              >
                <span className="inline-flex size-7 items-center justify-center rounded-lg bg-[#E4EEFE] text-[#4073C5]">
                  <SolarIcon name="crm" className="size-3.5" />
                </span>
                <span>{role}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-4">
          <button
            type="button"
            onClick={() => onFindDeciders(offer.companyId)}
            className="inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-4 text-[14px] font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] cursor-pointer"
          >
            Trouver les décideurs
          </button>
          <button
            type="button"
            onClick={() => onOpenCompany(offer.companyId)}
            className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 text-[14px] font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
          >
            Voir l’entreprise
          </button>
        </div>
      </aside>
    </div>
  );
}

