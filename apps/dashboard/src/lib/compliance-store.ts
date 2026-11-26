import fs from "node:fs";
import path from "node:path";
import {
  findDocumentPlaceholders,
  LEGAL_DOCUMENTS,
  type LegalDocumentStatus,
} from "@/app/legal/legal-docs";

export type LegalBasisType =
  | "acceptation_contractuelle"
  | "consentement_rgpd"
  | "information";

export interface LegalDocumentVersion {
  version: string;
  status: LegalDocumentStatus;
  effectiveDate: string | null;
  updatedAt: string;
  publishedBy: string | null;
  changeSummary: string;
  notifiedClients: boolean;
}

export interface ManagedLegalDocument {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  currentVersion: string;
  status: LegalDocumentStatus;
  effectiveDate: string | null;
  updatedAt: string;
  missingPlaceholders: string[];
  history: LegalDocumentVersion[];
}

export interface LegalAcceptanceRecord {
  id: string;
  clientId: string;
  clientEmail: string;
  companyName: string;
  documentSlug: string;
  documentVersion: string;
  legalBasisType: LegalBasisType;
  context: "inscription" | "souscription" | "campagne" | "agent_ia" | "enregistrement";
  acceptedAt: string;
  ipAddress: string;
  userAgent: string;
}

export interface ConsentRecord {
  id: string;
  subjectEmail: string;
  purpose:
    | "prospection_email"
    | "prospection_telephone"
    | "enregistrement_appel"
    | "cookies_analytics";
  status: "accordé" | "retiré";
  updatedAt: string;
  source: string;
}

export interface OutreachOptOutRecord {
  id: string;
  contactValue: string;
  channel: "téléphone" | "email" | "whatsapp" | "tous";
  reason: string;
  createdAt: string;
}

export interface GdprRequestRecord {
  id: string;
  requesterEmail: string;
  companyName: string;
  requestType: "export" | "suppression" | "opposition" | "rectification";
  status: "En attente" | "En cours" | "Traitée";
  createdAt: string;
  resolvedAt: string | null;
  notes: string;
}

export interface RetentionPolicyConfig {
  audioRecordingsDays: number;
  transcriptsDays: number;
  summariesDays: number;
  callMetadataDays: number;
  securityLogsDays: number;
  backupsCycleDays: number;
  updatedAt: string;
}

export interface ComplianceIncidentRecord {
  id: string;
  kind: "abus" | "sécurité";
  title: string;
  severity: "faible" | "modérée" | "élevée";
  status: "Ouvert" | "En investigation" | "Clôturé";
  reportedAt: string;
  description: string;
}

export interface SubprocessorRecord {
  id: string;
  entityName: string;
  service: string;
  dataProcessed: string;
  processingCountry: string;
  transferSafeguards: string;
  status: "À vérifier" | "Validé";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details: string;
}

export interface LegalChangeNotification {
  id: string;
  documentSlug: string;
  version: string;
  sentAt: string;
  recipientScope: string;
  summary: string;
}

export interface ComplianceState {
  documents: ManagedLegalDocument[];
  acceptances: LegalAcceptanceRecord[];
  consents: ConsentRecord[];
  optOuts: OutreachOptOutRecord[];
  gdprRequests: GdprRequestRecord[];
  retention: RetentionPolicyConfig;
  incidents: ComplianceIncidentRecord[];
  subprocessors: SubprocessorRecord[];
  auditLogs: AuditLogEntry[];
  notifications: LegalChangeNotification[];
}

const DATA_FILE = path.join(process.cwd(), ".data", "compliance.json");

function buildInitialState(): ComplianceState {
  const documents: ManagedLegalDocument[] = LEGAL_DOCUMENTS.map((doc) => {
    const missingPlaceholders = findDocumentPlaceholders(doc);
    return {
      slug: doc.slug,
      title: doc.title,
      shortTitle: doc.shortTitle,
      category: doc.category,
      currentVersion: doc.version ?? "V1.0",
      status: "Brouillon",
      effectiveDate: doc.effectiveDate ?? null,
      updatedAt: doc.updatedAt,
      missingPlaceholders,
      history: [
        {
          version: doc.version ?? "V1.0",
          status: "Brouillon",
          effectiveDate: doc.effectiveDate ?? null,
          updatedAt: doc.updatedAt,
          publishedBy: null,
          changeSummary: "Version initiale en attente de validation juridique et technique.",
          notifiedClients: false,
        },
      ],
    };
  });

  return {
    documents,
    acceptances: [],
    consents: [],
    optOuts: [],
    gdprRequests: [],
    retention: {
      audioRecordingsDays: 180,
      transcriptsDays: 180,
      summariesDays: 365,
      callMetadataDays: 365,
      securityLogsDays: 365,
      backupsCycleDays: 30,
      updatedAt: new Date().toISOString(),
    },
    incidents: [],
    subprocessors: [
      {
        id: "sub-hosting",
        entityName: "[Entité juridique à renseigner]",
        service: "Hébergement",
        dataProcessed: "[Données à préciser]",
        processingCountry: "[Pays à vérifier]",
        transferSafeguards: "[Garanties à vérifier]",
        status: "À vérifier",
      },
      {
        id: "sub-db",
        entityName: "[Entité juridique à renseigner]",
        service: "Base de données",
        dataProcessed: "[Données à préciser]",
        processingCountry: "[Pays à vérifier]",
        transferSafeguards: "[Garanties à vérifier]",
        status: "À vérifier",
      },
      {
        id: "sub-telephony",
        entityName: "[Entité juridique à renseigner]",
        service: "Téléphonie",
        dataProcessed: "[Données à préciser]",
        processingCountry: "[Pays à vérifier]",
        transferSafeguards: "[Garanties à vérifier]",
        status: "À vérifier",
      },
      {
        id: "sub-ai",
        entityName: "[Entité juridique à renseigner]",
        service: "Intelligence artificielle",
        dataProcessed: "[Données à préciser]",
        processingCountry: "[Pays à vérifier]",
        transferSafeguards: "[Garanties à vérifier]",
        status: "À vérifier",
      },
    ],
    auditLogs: [
      {
        id: "audit-init",
        timestamp: new Date().toISOString(),
        actor: "Système",
        action: "INITIALISATION_CONFORMITE",
        target: "legal-center",
        details:
          "15 documents initialisés en statut Brouillon (aucune publication automatique tant que des champs restent à renseigner).",
      },
    ],
    notifications: [],
  };
}

let memoryState: ComplianceState | null = null;

function readState(): ComplianceState {
  if (memoryState) return memoryState;
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf8");
      memoryState = JSON.parse(raw) as ComplianceState;
      return memoryState;
    }
  } catch {
    // Fallback to in-memory initial state if filesystem is unavailable
  }
  memoryState = buildInitialState();
  writeState(memoryState);
  return memoryState;
}

function writeState(next: ComplianceState): void {
  memoryState = next;
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(next, null, 2), "utf8");
  } catch {
    // Keep memoryState updated even if filesystem write fails
  }
}

function appendAudit(
  state: ComplianceState,
  actor: string,
  action: string,
  target: string,
  details: string
): void {
  state.auditLogs.unshift({
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    actor,
    action,
    target,
    details,
  });
}

export function getComplianceState(): ComplianceState {
  const state = readState();
  // Refresh missing placeholders from source docs so validation stays accurate
  state.documents = state.documents.map((doc) => {
    const source = LEGAL_DOCUMENTS.find((d) => d.slug === doc.slug);
    return {
      ...doc,
      missingPlaceholders: source ? findDocumentPlaceholders(source) : doc.missingPlaceholders,
    };
  });
  return state;
}

export function createDraftVersion(params: {
  slug: string;
  version: string;
  effectiveDate?: string | null;
  changeSummary: string;
  actor?: string;
}): { ok: true; document: ManagedLegalDocument } | { ok: false; error: string } {
  const state = getComplianceState();
  const doc = state.documents.find((d) => d.slug === params.slug);
  if (!doc) return { ok: false, error: "Document introuvable." };

  const now = new Date().toISOString();
  doc.currentVersion = params.version;
  doc.status = "Brouillon";
  doc.effectiveDate = params.effectiveDate ?? doc.effectiveDate;
  doc.updatedAt = now.slice(0, 10);
  doc.history.unshift({
    version: params.version,
    status: "Brouillon",
    effectiveDate: doc.effectiveDate,
    updatedAt: doc.updatedAt,
    publishedBy: null,
    changeSummary: params.changeSummary || "Nouvelle version brouillon.",
    notifiedClients: false,
  });

  appendAudit(
    state,
    params.actor ?? "Super Admin",
    "NOUVELLE_VERSION_BROUILLON",
    doc.slug,
    `Création du brouillon ${params.version}`
  );
  writeState(state);
  return { ok: true, document: doc };
}

export function publishDocument(params: {
  slug: string;
  effectiveDate?: string | null;
  actor?: string;
  notifyClients?: boolean;
  changeSummary?: string;
}):
  | { ok: true; document: ManagedLegalDocument }
  | { ok: false; error: string; missingPlaceholders?: string[] } {
  const state = getComplianceState();
  const doc = state.documents.find((d) => d.slug === params.slug);
  if (!doc) return { ok: false, error: "Document introuvable." };

  if (doc.missingPlaceholders.length > 0) {
    appendAudit(
      state,
      params.actor ?? "Super Admin",
      "PUBLICATION_BLOQUEE",
      doc.slug,
      `Publication refusée : ${doc.missingPlaceholders.length} champ(s) non renseigné(s) (${doc.missingPlaceholders.slice(0, 5).join(", ")}).`
    );
    writeState(state);
    return {
      ok: false,
      error:
        "Publication bloquée : ce document comporte encore des champs non renseignés.",
      missingPlaceholders: doc.missingPlaceholders,
    };
  }

  const now = new Date().toISOString();
  doc.status = "Publié";
  doc.effectiveDate = params.effectiveDate ?? doc.effectiveDate ?? now.slice(0, 10);
  doc.updatedAt = now.slice(0, 10);

  if (doc.history[0]) {
    doc.history[0].status = "Publié";
    doc.history[0].effectiveDate = doc.effectiveDate;
    doc.history[0].updatedAt = doc.updatedAt;
    doc.history[0].publishedBy = params.actor ?? "Super Admin";
    doc.history[0].notifiedClients = Boolean(params.notifyClients);
    if (params.changeSummary) {
      doc.history[0].changeSummary = params.changeSummary;
    }
  }

  if (params.notifyClients) {
    state.notifications.unshift({
      id: `notif-${Date.now()}`,
      documentSlug: doc.slug,
      version: doc.currentVersion,
      sentAt: now,
      recipientScope: "Tous les clients actifs",
      summary:
        params.changeSummary ||
        `Mise à jour du document ${doc.title} (${doc.currentVersion}).`,
    });
  }

  appendAudit(
    state,
    params.actor ?? "Super Admin",
    "PUBLICATION_DOCUMENT",
    doc.slug,
    `Version ${doc.currentVersion} publiée (entrée en vigueur : ${doc.effectiveDate}).`
  );
  writeState(state);
  return { ok: true, document: doc };
}

export function recordAcceptance(
  input: Omit<LegalAcceptanceRecord, "id" | "acceptedAt">
): LegalAcceptanceRecord {
  const state = getComplianceState();
  const record: LegalAcceptanceRecord = {
    ...input,
    id: `acc-${Date.now()}`,
    acceptedAt: new Date().toISOString(),
  };
  state.acceptances.unshift(record);
  appendAudit(
    state,
    input.clientEmail,
    "ACCEPTATION_JURIDIQUE",
    input.documentSlug,
    `Type: ${input.legalBasisType} · Contexte: ${input.context} · Version: ${input.documentVersion}`
  );
  writeState(state);
  return record;
}

export function upsertConsent(
  input: Omit<ConsentRecord, "id" | "updatedAt">
): ConsentRecord {
  const state = getComplianceState();
  const now = new Date().toISOString();
  const existing = state.consents.find(
    (c) => c.subjectEmail === input.subjectEmail && c.purpose === input.purpose
  );
  if (existing) {
    existing.status = input.status;
    existing.updatedAt = now;
    existing.source = input.source;
    appendAudit(
      state,
      input.subjectEmail,
      input.status === "retiré" ? "RETRAIT_CONSENTEMENT" : "CONSENTEMENT_ACCORDE",
      input.purpose,
      `Source: ${input.source}`
    );
    writeState(state);
    return existing;
  }
  const created: ConsentRecord = {
    ...input,
    id: `cons-${Date.now()}`,
    updatedAt: now,
  };
  state.consents.unshift(created);
  appendAudit(
    state,
    input.subjectEmail,
    input.status === "retiré" ? "RETRAIT_CONSENTEMENT" : "CONSENTEMENT_ACCORDE",
    input.purpose,
    `Source: ${input.source}`
  );
  writeState(state);
  return created;
}

export function addOptOut(
  input: Omit<OutreachOptOutRecord, "id" | "createdAt">
): OutreachOptOutRecord {
  const state = getComplianceState();
  const record: OutreachOptOutRecord = {
    ...input,
    id: `opt-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  state.optOuts.unshift(record);
  appendAudit(
    state,
    input.contactValue,
    "OPPOSITION_PROSPECTION",
    input.channel,
    input.reason || "Demande d'opposition enregistrée."
  );
  writeState(state);
  return record;
}

export function createGdprRequest(
  input: Omit<GdprRequestRecord, "id" | "status" | "createdAt" | "resolvedAt">
): GdprRequestRecord {
  const state = getComplianceState();
  const record: GdprRequestRecord = {
    ...input,
    id: `gdpr-${Date.now()}`,
    status: "En attente",
    createdAt: new Date().toISOString(),
    resolvedAt: null,
  };
  state.gdprRequests.unshift(record);
  appendAudit(
    state,
    input.requesterEmail,
    "DEMANDE_RGPD_CREEE",
    input.requestType,
    input.notes || "Nouvelle demande RGPD."
  );
  writeState(state);
  return record;
}

export function updateGdprRequestStatus(params: {
  id: string;
  status: GdprRequestRecord["status"];
  actor?: string;
}): GdprRequestRecord | null {
  const state = getComplianceState();
  const req = state.gdprRequests.find((r) => r.id === params.id);
  if (!req) return null;
  req.status = params.status;
  req.resolvedAt = params.status === "Traitée" ? new Date().toISOString() : null;
  appendAudit(
    state,
    params.actor ?? "Super Admin",
    "MISE_A_JOUR_DEMANDE_RGPD",
    req.id,
    `Statut passé à : ${params.status}`
  );
  writeState(state);
  return req;
}

export function updateRetentionPolicy(
  patch: Partial<Omit<RetentionPolicyConfig, "updatedAt">>,
  actor = "Super Admin"
): RetentionPolicyConfig {
  const state = getComplianceState();
  state.retention = {
    ...state.retention,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  appendAudit(
    state,
    actor,
    "MODIFICATION_CONSERVATION",
    "retention-policy",
    `Audio: ${state.retention.audioRecordingsDays}j, Transcriptions: ${state.retention.transcriptsDays}j`
  );
  writeState(state);
  return state.retention;
}

export function createIncident(
  input: Omit<ComplianceIncidentRecord, "id" | "status" | "reportedAt">,
  actor = "Super Admin"
): ComplianceIncidentRecord {
  const state = getComplianceState();
  const record: ComplianceIncidentRecord = {
    ...input,
    id: `inc-${Date.now()}`,
    status: "Ouvert",
    reportedAt: new Date().toISOString(),
  };
  state.incidents.unshift(record);
  appendAudit(
    state,
    actor,
    "DECLARATION_INCIDENT",
    record.kind,
    `${record.title} (${record.severity})`
  );
  writeState(state);
  return record;
}

export function updateIncidentStatus(
  id: string,
  status: ComplianceIncidentRecord["status"],
  actor = "Super Admin"
): ComplianceIncidentRecord | null {
  const state = getComplianceState();
  const inc = state.incidents.find((i) => i.id === id);
  if (!inc) return null;
  inc.status = status;
  appendAudit(
    state,
    actor,
    "MISE_A_JOUR_INCIDENT",
    inc.id,
    `Statut passé à : ${status}`
  );
  writeState(state);
  return inc;
}

