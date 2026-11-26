"use client";

import { useState } from "react";
import { PremiumSelect } from "../premium-select";
import { SolarIcon } from "../workspace-navigation";

export interface InvoiceLineItem {
  id: string;
  title: string;
  description: string;
  qty: number;
  unitPrice: number;
  taxMode: "none" | "excl" | "incl";
}

export interface InvoiceDraftPayload {
  kind: "Facture" | "Devis";
  number: string;
  client: string;
  email: string;
  issueDate: string;
  dueDate: string;
  amountTtc: number;
  status: "draft" | "sent";
  subject?: string;
}

type AccordionKey =
  | "my-details"
  | "client-details"
  | "invoice-details"
  | "payment-details"
  | "notes"
  | "signature"
  | "email-details";

type PreviewMode = "pdf" | "email" | "payment";

const SUGGESTED_CLIENTS = [
  {
    name: "Nettoyage Pro Lyon",
    contact: "Marc Vallet",
    email: "m.vallet@nettoyagepro-lyon.fr",
    phone: "+33 6 42 19 88 02",
    address: "42 rue de la République, 69003 Lyon",
    website: "nettoyagepro-lyon.fr",
    initials: "MV",
    color: "#E0F2FE",
  },
  {
    name: "Transports Blanchard SAS",
    contact: "Luc Blanchard",
    email: "l.blanchard@trans-blanchard.fr",
    phone: "+33 6 11 90 45 12",
    address: "18 avenue des Frères Lumière, 69800 Saint-Priest",
    website: "trans-blanchard.fr",
    initials: "LB",
    color: "#FEF3C7",
  },
  {
    name: "Groupe Finaxis",
    contact: "Julie Roux",
    email: "j.roux@groupe-finaxis.fr",
    phone: "+33 1 44 80 92 11",
    address: "24 rue du Faubourg Saint-Honoré, 75008 Paris",
    website: "groupe-finaxis.fr",
    initials: "JR",
    color: "#FCE7F3",
  },
  {
    name: "Cabinet Nexa Lyon",
    contact: "Sophie Martin",
    email: "s.martin@nexa-avocats.fr",
    phone: "+33 4 78 22 10 00",
    address: "10 cours Émile Zola, 69100 Villeurbanne",
    website: "nexa-avocats.fr",
    initials: "SM",
    color: "#F3E8FF",
  },
];

export function InvoiceEditor({
  initialClient,
  initialEmail,
  nextNumber,
  onBack,
  onSave,
}: {
  initialClient: string;
  initialEmail: string;
  nextNumber: string;
  onBack: () => void;
  onSave: (payload: InvoiceDraftPayload) => void;
}) {
  const [openSection, setOpenSection] = useState<AccordionKey | null>("invoice-details");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("pdf");

  // My Details
  const [senderName, setSenderName] = useState("AutoCall SAS");
  const [senderAddress, setSenderAddress] = useState("14 avenue de l’Opéra, 75001 Paris");
  const [senderSiret, setSenderSiret] = useState("SIRET 912 458 310 00024");
  const [senderEmail, setSenderEmail] = useState("facturation@autocall.ai");
  const [senderPhone, setSenderPhone] = useState("+33 1 89 45 22 10");

  // Client Details
  const [client, setClient] = useState(initialClient || "Nettoyage Pro Lyon");
  const [clientEmail, setClientEmail] = useState(
    initialEmail || "m.vallet@nettoyagepro-lyon.fr"
  );
  const [clientPhone, setClientPhone] = useState("+33 6 42 19 88 02");
  const [clientAddress, setClientAddress] = useState("42 rue de la République, 69003 Lyon");
  const [clientWebsite, setClientWebsite] = useState("nettoyagepro-lyon.fr");
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

  // Invoice Details
  const [kind, setKind] = useState<"Facture" | "Devis">("Facture");
  const [number, setNumber] = useState(nextNumber);
  const [projectName, setProjectName] = useState("Déploiement Agents Vocaux IA & CRM");
  const [issueDate, setIssueDate] = useState("2025-03-25");
  const [dueDate, setDueDate] = useState("2025-04-24");
  const [tvaRate, setTvaRate] = useState("20");

  const [lines, setLines] = useState<InvoiceLineItem[]>([
    {
      id: "l1",
      title: "Forfait Agents IA Multi-sites (Thomas & Emma)",
      description: "Qualification entrante 24/7 et prise de RDV automatisée",
      qty: 1,
      unitPrice: 1850,
      taxMode: "excl",
    },
    {
      id: "l2",
      title: "Intégration CRM & Routage SIP",
      description: "Connexion bidirectionnelle et formation équipe",
      qty: 1,
      unitPrice: 550,
      taxMode: "excl",
    },
  ]);

  // Payment, Notes, Signature, Email
  const [bankIban, setBankIban] = useState("FR76 3000 6000 0112 3456 7890 189");
  const [onlinePayEnabled, setOnlinePayEnabled] = useState(true);
  const [noteText, setNoteText] = useState(
    "Règlement à 30 jours. En cas de retard, des pénalités légales seront appliquées conformément aux CGV AutoCall."
  );
  const [signatureName, setSignatureName] = useState("Tanjim Islam");
  const [emailSubject, setEmailSubject] = useState(
    `Votre ${kind.toLowerCase()} ${nextNumber} — AutoCall SAS`
  );
  const [emailMessage, setEmailMessage] = useState(
    "Bonjour,\n\nVeuillez trouver ci-joint votre document de facturation ainsi que le lien de règlement sécurisé.\n\nBien cordialement,\nL’équipe AutoCall"
  );

  const toggleSection = (key: AccordionKey) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const updateLine = (id: string, patch: Partial<InvoiceLineItem>) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      {
        id: `l-${Date.now()}`,
        title: "Prestation complémentaire",
        description: "",
        qty: 1,
        unitPrice: 350,
        taxMode: "excl",
      },
    ]);
  };

  const removeLine = (id: string) => {
    if (lines.length === 1) return;
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const rateNum = Number(tvaRate) / 100;
  const subtotalHt = lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
  const totalTva = lines.reduce(
    (sum, l) => (l.taxMode === "none" ? sum : sum + l.qty * l.unitPrice * rateNum),
    0
  );
  const totalTtc = subtotalHt + totalTva;

  const matchedClients = SUGGESTED_CLIENTS.filter((c) => {
    const q = client.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.contact.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const submitDocument = (status: "draft" | "sent") => {
    onSave({
      kind,
      number,
      client,
      email: clientEmail,
      issueDate,
      dueDate,
      amountTtc: totalTtc,
      status,
      subject: projectName,
    });
  };

  const accordionItems: { key: AccordionKey; label: string }[] = [
    { key: "my-details", label: "Mes coordonnées" },
    { key: "client-details", label: "Coordonnées client" },
    { key: "invoice-details", label: "Détails de la facture" },
    { key: "payment-details", label: "Moyens de paiement" },
    { key: "notes", label: "Ajouter des notes" },
    { key: "signature", label: "Ajouter une signature" },
    { key: "email-details", label: "Détails de l’email" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* LEFT COLUMN: Accordion Form */}
      <div className="space-y-4 lg:col-span-5">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#525252] hover:text-[#171717] cursor-pointer"
          >
            ← Factures
          </button>
          <h2 className="mt-1.5 text-[22px] font-bold tracking-tight text-[#171717]">
            Créer une nouvelle facture
          </h2>
          <p className="mt-0.5 text-[13.5px] text-[#737373]">
            Renseignez les informations ci-dessous. Vous pouvez enregistrer un brouillon à tout moment.
          </p>
        </div>

        <div className="space-y-2.5">
          {accordionItems.map((sec) => {
            const isOpen = openSection === sec.key;
            return (
              <div
                key={sec.key}
                className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(sec.key)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-[13.5px] font-medium text-[#171717] hover:bg-[#FAFAFA] cursor-pointer"
                >
                  <span>{sec.label}</span>
                  <SolarIcon
                    name="chevronDown"
                    className={`size-4 text-[#737373] transition-transform duration-150 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-[#F0F0F0] p-4 space-y-3 text-[14px]">
                    {sec.key === "my-details" && (
                      <>
                        <div>
                          <label className="block text-[12.5px] font-medium text-[#525252]">
                            Émetteur
                          </label>
                          <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                          />
                        </div>
                        <div>
                          <label className="block text-[12.5px] font-medium text-[#525252]">
                            Adresse
                          </label>
                          <input
                            type="text"
                            value={senderAddress}
                            onChange={(e) => setSenderAddress(e.target.value)}
                            className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[12.5px] font-medium text-[#525252]">
                              SIRET
                            </label>
                            <input
                              type="text"
                              value={senderSiret}
                              onChange={(e) => setSenderSiret(e.target.value)}
                              className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                            />
                          </div>
                          <div>
                            <label className="block text-[12.5px] font-medium text-[#525252]">
                              Téléphone
                            </label>
                            <input
                              type="text"
                              value={senderPhone}
                              onChange={(e) => setSenderPhone(e.target.value)}
                              className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12.5px] font-medium text-[#525252]">
                            Email de facturation
                          </label>
                          <input
                            type="email"
                            value={senderEmail}
                            onChange={(e) => setSenderEmail(e.target.value)}
                            className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                          />
                        </div>
                      </>
                    )}

                    {sec.key === "client-details" && (
                      <>
                        <div className="relative">
                          <label className="block text-[12.5px] font-medium text-[#525252]">
                            Client / Entreprise *
                          </label>
                          <input
                            type="text"
                            value={client}
                            onFocus={() => setClientDropdownOpen(true)}
                            onChange={(e) => {
                              setClient(e.target.value);
                              setClientDropdownOpen(true);
                            }}
                            className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                          />
                          {clientDropdownOpen && matchedClients.length > 0 && (
                            <div className="absolute inset-x-0 top-full z-20 mt-1 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-1.5 shadow-lg">
                              {matchedClients.map((mc) => (
                                <button
                                  key={mc.email}
                                  type="button"
                                  onClick={() => {
                                    setClient(mc.name);
                                    setClientEmail(mc.email);
                                    setClientPhone(mc.phone);
                                    setClientAddress(mc.address);
                                    setClientWebsite(mc.website);
                                    setClientDropdownOpen(false);
                                  }}
                                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-[#F5F5F5] cursor-pointer"
                                >
                                  <span
                                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-[#171717]"
                                    style={{ backgroundColor: mc.color }}
                                  >
                                    {mc.initials}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="truncate text-[13.5px] font-medium text-[#171717]">
                                      {mc.name} · {mc.contact}
                                    </p>
                                    <p className="truncate text-[12px] text-[#737373]">
                                      {mc.email}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[12.5px] font-medium text-[#525252]">
                              Email *
                            </label>
                            <input
                              type="email"
                              value={clientEmail}
                              onChange={(e) => setClientEmail(e.target.value)}
                              className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                            />
                          </div>
                          <div>
                            <label className="block text-[12.5px] font-medium text-[#525252]">
                              Téléphone *
                            </label>
                            <input
                              type="tel"
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12.5px] font-medium text-[#525252]">
                            Adresse
                          </label>
                          <input
                            type="text"
                            value={clientAddress}
                            onChange={(e) => setClientAddress(e.target.value)}
                            className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setClientDropdownOpen(false);
                            setOpenSection("invoice-details");
                          }}
                          className="h-9 rounded-lg bg-[#008F6D] px-4 text-[13.5px] font-medium text-white hover:bg-[#00775B] cursor-pointer"
                        >
                          Valider
                        </button>
                      </>
                    )}

                    {sec.key === "invoice-details" && (
                      <>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[12.5px] font-medium text-[#525252]">
                              Type *
                            </label>
                            <PremiumSelect
                              value={kind}
                              onChange={(v) => setKind(v as "Facture" | "Devis")}
                              ariaLabel="Type de document"
                              className="mt-1"
                              options={[
                                { value: "Facture", label: "Facture" },
                                { value: "Devis", label: "Devis" },
                              ]}
                            />
                          </div>
                          <div>
                            <label className="block text-[12.5px] font-medium text-[#525252]">
                              Numéro *
                            </label>
                            <input
                              type="text"
                              value={number}
                              onChange={(e) => setNumber(e.target.value)}
                              className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[12.5px] font-medium text-[#525252]">
                            Objet / Projet *
                          </label>
                          <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[12.5px] font-medium text-[#525252]">
                              Date d’émission
                            </label>
                            <input
                              type="date"
                              value={issueDate}
                              onChange={(e) => setIssueDate(e.target.value)}
                              className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                            />
                          </div>
                          <div>
                            <label className="block text-[12.5px] font-medium text-[#525252]">
                              Échéance
                            </label>
                            <input
                              type="date"
                              value={dueDate}
                              onChange={(e) => setDueDate(e.target.value)}
                              className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[12.5px] font-medium text-[#525252]">
                            Régime TVA
                          </label>
                          <PremiumSelect
                            value={tvaRate}
                            onChange={setTvaRate}
                            ariaLabel="Régime TVA"
                            className="mt-1"
                            options={[
                              { value: "20", label: "TVA standard (20 %)" },
                              { value: "10", label: "TVA réduite (10 %)" },
                              { value: "0", label: "Exonéré (0 %)" },
                            ]}
                          />
                        </div>

                        <div className="space-y-2.5 pt-1">
                          {lines.map((line, idx) => (
                            <div
                              key={line.id}
                              className="rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3 space-y-2.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[12.5px] font-semibold text-[#525252]">
                                  Article {idx + 1}
                                </span>
                                {lines.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeLine(line.id)}
                                    className="text-[12px] text-[#737373] hover:text-[#DC2626] cursor-pointer"
                                  >
                                    Supprimer
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                value={line.title}
                                onChange={(e) =>
                                  updateLine(line.id, { title: e.target.value })
                                }
                                placeholder="Désignation"
                                className="h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-3 text-[13.5px] outline-none focus:border-[#008F6D]"
                              />
                              <div className="grid grid-cols-2 gap-2.5">
                                <div>
                                  <label className="block text-[12px] text-[#737373]">
                                    Quantité
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    value={line.qty}
                                    onChange={(e) =>
                                      updateLine(line.id, {
                                        qty: Number(e.target.value) || 1,
                                      })
                                    }
                                    className="mt-0.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-2.5 text-[13.5px] outline-none focus:border-[#008F6D]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[12px] text-[#737373]">
                                    Prix unitaire (€)
                                  </label>
                                  <input
                                    type="number"
                                    min={0}
                                    value={line.unitPrice}
                                    onChange={(e) =>
                                      updateLine(line.id, {
                                        unitPrice: Number(e.target.value) || 0,
                                      })
                                    }
                                    className="mt-0.5 h-9 w-full rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] px-2.5 text-[13.5px] outline-none focus:border-[#008F6D]"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={addLine}
                            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#008F6D] hover:underline cursor-pointer"
                          >
                            + Ajouter un article
                          </button>
                          <button
                            type="button"
                            onClick={() => setOpenSection("payment-details")}
                            className="h-8.5 rounded-lg bg-[#008F6D] px-4 text-[13.5px] font-medium text-white hover:bg-[#00775B] cursor-pointer"
                          >
                            Valider
                          </button>
                        </div>
                      </>
                    )}

                    {sec.key === "payment-details" && (
                      <>
                        <div>
                          <label className="block text-[12.5px] font-medium text-[#525252]">
                            IBAN (Virement SEPA)
                          </label>
                          <input
                            type="text"
                            value={bankIban}
                            onChange={(e) => setBankIban(e.target.value)}
                            className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 font-mono text-[13px] outline-none focus:border-[#008F6D]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setOnlinePayEnabled((v) => !v)}
                          className="flex w-full items-center justify-between rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-3 py-2 text-[13.5px] cursor-pointer"
                        >
                          <span>Paiement en ligne par carte (Stripe)</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${
                              onlinePayEnabled
                                ? "bg-[#E6F5F0] text-[#00775B]"
                                : "bg-[#EFEFEF] text-[#737373]"
                            }`}
                          >
                            {onlinePayEnabled ? "Activé" : "Désactivé"}
                          </span>
                        </button>
                      </>
                    )}

                    {sec.key === "notes" && (
                      <textarea
                        rows={3}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full rounded-lg border border-[#E5E5E5] p-2.5 text-[13.5px] outline-none focus:border-[#008F6D]"
                      />
                    )}

                    {sec.key === "signature" && (
                      <div>
                        <label className="block text-[12.5px] font-medium text-[#525252]">
                          Nom du signataire
                        </label>
                        <input
                          type="text"
                          value={signatureName}
                          onChange={(e) => setSignatureName(e.target.value)}
                          className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                        />
                      </div>
                    )}

                    {sec.key === "email-details" && (
                      <>
                        <div>
                          <label className="block text-[12.5px] font-medium text-[#525252]">
                            Objet de l’email
                          </label>
                          <input
                            type="text"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="mt-1 h-9.5 w-full rounded-lg border border-[#E5E5E5] px-3 outline-none focus:border-[#008F6D]"
                          />
                        </div>
                        <div>
                          <label className="block text-[12.5px] font-medium text-[#525252]">
                            Message
                          </label>
                          <textarea
                            rows={3}
                            value={emailMessage}
                            onChange={(e) => setEmailMessage(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-[#E5E5E5] p-2.5 text-[13.5px] outline-none focus:border-[#008F6D]"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => submitDocument("draft")}
          className="flex h-10 w-full items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#EFEFEF] text-[14px] font-medium text-[#171717] transition hover:bg-[#E5E5E5] cursor-pointer"
        >
          Enregistrer comme brouillon
        </button>
      </div>

      {/* RIGHT COLUMN: Live Preview */}
      <div className="space-y-4 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold text-[#171717]">Aperçu</span>
            <div className="inline-flex rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] p-0.5 shadow-2xs">
              {(
                [
                  { id: "pdf", label: "PDF" },
                  { id: "email", label: "Email" },
                  { id: "payment", label: "Paiement en ligne" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPreviewMode(m.id)}
                  className={`rounded-md px-3 py-1 text-[13px] font-medium transition cursor-pointer ${
                    previewMode === m.id
                      ? "bg-[#171717] text-white"
                      : "text-[#525252] hover:text-[#171717]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => submitDocument("sent")}
            className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-[#00B489] px-4 text-[14px] font-medium text-white shadow-xs transition hover:bg-[#009E78] cursor-pointer"
          >
            Enregistrer et envoyer
          </button>
        </div>

        {/* Paper Preview */}
        {previewMode === "pdf" && (
          <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[24px] font-bold tracking-tight text-[#171717]">
                  {kind}
                </h3>
                <p className="mt-0.5 font-mono text-[14px] text-[#737373]">
                  #{number}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 96 96"
                  className="size-6 text-[#171717]"
                  fill="currentColor"
                >
                  <path d="M48 84 A36 36 0 1 1 84 48 L84 84 A22 22 0 0 1 62 62 L62 48 A14 14 0 1 0 48 62 Z" />
                </svg>
                <span className="text-[17px] font-bold tracking-tight text-[#171717]">
                  AutoCall
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 border-b border-[#F0F0F0] pb-5 text-[13.5px] sm:grid-cols-3">
              <div>
                <p className="text-[12px] text-[#8C8C8C]">Projet</p>
                <p className="mt-0.5 font-semibold text-[#171717]">{projectName}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#8C8C8C]">Date d’émission</p>
                <p className="mt-0.5 font-medium text-[#171717]">{issueDate}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#8C8C8C]">Échéance</p>
                <p className="mt-0.5 font-medium text-[#171717]">{dueDate}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 text-[13.5px] sm:grid-cols-2">
              <div>
                <p className="text-[12px] text-[#8C8C8C]">De</p>
                <p className="mt-1 font-semibold text-[#171717]">{senderName}</p>
                <p className="mt-0.5 text-[#525252]">{senderAddress}</p>
                <p className="text-[#525252]">{senderSiret}</p>
                <p className="text-[#525252]">{senderEmail}</p>
                <p className="text-[#525252]">{senderPhone}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-[12px] text-[#8C8C8C]">À</p>
                <p className="mt-1 font-semibold text-[#171717]">{client}</p>
                <p className="mt-0.5 text-[#525252]">{clientAddress}</p>
                <p className="text-[#525252]">{clientEmail}</p>
                <p className="text-[#525252]">{clientPhone}</p>
                <p className="text-[#525252]">{clientWebsite}</p>
              </div>
            </div>

            {/* Table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-[#F0F0F0]">
              <table className="w-full border-collapse text-left text-[13.5px]">
                <thead>
                  <tr className="bg-[#FAFAFA] text-[12.5px] font-medium text-[#737373]">
                    <th className="px-4 py-2.5">Description</th>
                    <th className="px-3 py-2.5 text-center">Qté</th>
                    <th className="px-3 py-2.5 text-right">Prix HT</th>
                    <th className="px-3 py-2.5 text-right">TVA</th>
                    <th className="px-4 py-2.5 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5]">
                  {lines.map((l) => {
                    const lineHt = l.qty * l.unitPrice;
                    const lineTva = l.taxMode === "none" ? 0 : lineHt * rateNum;
                    return (
                      <tr key={l.id}>
                        <td className="px-4 py-3 font-medium text-[#171717]">{l.title}</td>
                        <td className="px-3 py-3 text-center text-[#525252] tabular-nums">
                          {l.qty}
                        </td>
                        <td className="px-3 py-3 text-right text-[#525252] tabular-nums">
                          {l.unitPrice.toLocaleString("fr-FR")} €
                        </td>
                        <td className="px-3 py-3 text-right text-[#525252] tabular-nums">
                          {lineTva.toLocaleString("fr-FR")} €
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-[#171717] tabular-nums">
                          {(lineHt + lineTva).toLocaleString("fr-FR")} €
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#F0F0F0] pt-4">
              <span className="text-[13.5px] font-semibold text-[#171717]">
                Montant total TTC
              </span>
              <span className="text-[20px] font-bold tracking-tight text-[#171717] tabular-nums">
                {totalTtc.toLocaleString("fr-FR")} €
              </span>
            </div>

            {noteText && (
              <div className="mt-5 rounded-xl border border-[#EFEFEF] bg-[#FAFAFA] p-3.5 text-[13px] text-[#525252]">
                <strong className="text-[#171717]">Note :</strong> {noteText}
              </div>
            )}

            <div className="mt-6 flex flex-col justify-between gap-4 border-t border-[#F0F0F0] pt-5 text-[13px] sm:flex-row sm:items-end">
              <div>
                <p className="font-semibold text-[#171717]">Moyen de paiement</p>
                <p className="mt-1 text-[#525252]">Virement SEPA · {senderName}</p>
                <p className="font-mono text-[12.5px] text-[#737373]">{bankIban}</p>
              </div>
              <div className="sm:text-right">
                <svg
                  viewBox="0 0 120 36"
                  className="ml-auto h-8 w-28 text-[#171717]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    d="M8 26c12-18 20-20 22-8 2 10 12-16 20-6 6 8 16-4 28-2 10 1 20 4 32 0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-1 font-semibold text-[#171717]">{signatureName}</p>
                <p className="text-[12px] text-[#737373]">Signature autorisée</p>
              </div>
            </div>
          </div>
        )}

        {previewMode === "email" && (
          <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 shadow-sm space-y-4">
            <div className="border-b border-[#F0F0F0] pb-3 text-[13.5px]">
              <p className="text-[#737373]">
                À : <strong className="text-[#171717]">{clientEmail}</strong>
              </p>
              <p className="mt-1 text-[#737373]">
                Objet : <strong className="text-[#171717]">{emailSubject}</strong>
              </p>
            </div>
            <p className="whitespace-pre-line text-[14px] leading-relaxed text-[#262626]">
              {emailMessage}
            </p>
            <div className="flex items-center justify-between rounded-xl border border-[#B8E6D6] bg-[#F3FAF7] p-3.5 text-[13.5px]">
              <span className="font-medium text-[#00775B]">
                {kind} #{number} · {totalTtc.toLocaleString("fr-FR")} € TTC
              </span>
              <span className="rounded-lg bg-[#00B489] px-3 py-1 text-[13px] font-medium text-white">
                Consulter et régler
              </span>
            </div>
          </div>
        )}

        {previewMode === "payment" && (
          <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[#737373]">Lien de paiement sécurisé</p>
                <h4 className="mt-0.5 text-[18px] font-bold text-[#171717]">
                  {totalTtc.toLocaleString("fr-FR")} € TTC
                </h4>
              </div>
              <span className="rounded-full bg-[#E6F5F0] px-2.5 py-0.5 text-[12px] font-medium text-[#00775B]">
                SSL 256-bit
              </span>
            </div>
            <div className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-4 text-[13.5px] text-[#525252]">
              <p className="font-medium text-[#171717]">
                {client} · {kind} #{number}
              </p>
              <p className="mt-1">
                {onlinePayEnabled
                  ? "Le client peut régler instantanément par Carte Bancaire, Apple Pay ou Virement SEPA."
                  : "Paiement en ligne désactivé — virement SEPA uniquement."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
