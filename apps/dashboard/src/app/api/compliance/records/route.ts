import { NextResponse } from "next/server";
import {
  addOptOut,
  createGdprRequest,
  createIncident,
  recordAcceptance,
  updateGdprRequestStatus,
  updateIncidentStatus,
  updateRetentionPolicy,
  upsertConsent,
} from "@/lib/compliance-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const kind = body.kind as string;

    switch (kind) {
      case "acceptance": {
        const created = recordAcceptance({
          clientId: String(body.clientId ?? "client-demo"),
          clientEmail: String(body.clientEmail ?? ""),
          companyName: String(body.companyName ?? ""),
          documentSlug: String(body.documentSlug ?? ""),
          documentVersion: String(body.documentVersion ?? "V1.0"),
          legalBasisType:
            (body.legalBasisType as
              | "acceptation_contractuelle"
              | "consentement_rgpd"
              | "information") ?? "acceptation_contractuelle",
          context:
            (body.context as
              | "inscription"
              | "souscription"
              | "campagne"
              | "agent_ia"
              | "enregistrement") ?? "inscription",
          ipAddress: String(body.ipAddress ?? "127.0.0.1"),
          userAgent: String(body.userAgent ?? "AutoCall-Client"),
        });
        return NextResponse.json({ ok: true, record: created });
      }

      case "consent": {
        const updated = upsertConsent({
          subjectEmail: String(body.subjectEmail ?? ""),
          purpose:
            (body.purpose as
              | "prospection_email"
              | "prospection_telephone"
              | "enregistrement_appel"
              | "cookies_analytics") ?? "cookies_analytics",
          status: (body.status as "accordé" | "retiré") ?? "accordé",
          source: String(body.source ?? "interface"),
        });
        return NextResponse.json({ ok: true, record: updated });
      }

      case "opt_out": {
        const created = addOptOut({
          contactValue: String(body.contactValue ?? ""),
          channel:
            (body.channel as "téléphone" | "email" | "whatsapp" | "tous") ?? "tous",
          reason: String(body.reason ?? "Opposition formulée par le contact"),
        });
        return NextResponse.json({ ok: true, record: created });
      }

      case "gdpr_request": {
        const created = createGdprRequest({
          requesterEmail: String(body.requesterEmail ?? ""),
          companyName: String(body.companyName ?? ""),
          requestType:
            (body.requestType as
              | "export"
              | "suppression"
              | "opposition"
              | "rectification") ?? "export",
          notes: String(body.notes ?? ""),
        });
        return NextResponse.json({ ok: true, record: created });
      }

      case "gdpr_status": {
        const updated = updateGdprRequestStatus({
          id: String(body.id ?? ""),
          status:
            (body.status as "En attente" | "En cours" | "Traitée") ?? "Traitée",
        });
        return NextResponse.json({ ok: Boolean(updated), record: updated });
      }

      case "retention": {
        const updated = updateRetentionPolicy({
          audioRecordingsDays: Number(body.audioRecordingsDays ?? 180),
          transcriptsDays: Number(body.transcriptsDays ?? 180),
          summariesDays: Number(body.summariesDays ?? 365),
          callMetadataDays: Number(body.callMetadataDays ?? 365),
          securityLogsDays: Number(body.securityLogsDays ?? 365),
          backupsCycleDays: Number(body.backupsCycleDays ?? 30),
        });
        return NextResponse.json({ ok: true, retention: updated });
      }

      case "incident": {
        const created = createIncident({
          kind: (body.incidentKind as "abus" | "sécurité") ?? "abus",
          title: String(body.title ?? "Signalement"),
          severity: (body.severity as "faible" | "modérée" | "élevée") ?? "modérée",
          description: String(body.description ?? ""),
        });
        return NextResponse.json({ ok: true, record: created });
      }

      case "incident_status": {
        const updated = updateIncidentStatus(
          String(body.id ?? ""),
          (body.status as "Ouvert" | "En investigation" | "Clôturé") ?? "Clôturé"
        );
        return NextResponse.json({ ok: Boolean(updated), record: updated });
      }

      default:
        return NextResponse.json(
          { ok: false, error: "Type d'opération inconnu." },
          { status: 400 }
        );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête invalide." },
      { status: 400 }
    );
  }
}

