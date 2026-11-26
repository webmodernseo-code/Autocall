import { NextResponse } from "next/server";
import { createDraftVersion, publishDocument } from "@/lib/compliance-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action: "create_draft" | "publish";
      slug: string;
      version?: string;
      effectiveDate?: string | null;
      changeSummary?: string;
      notifyClients?: boolean;
      actor?: string;
    };

    if (!body.slug) {
      return NextResponse.json(
        { ok: false, error: "Identifiant de document requis." },
        { status: 400 }
      );
    }

    if (body.action === "create_draft") {
      const result = createDraftVersion({
        slug: body.slug,
        version: body.version || "V1.1",
        effectiveDate: body.effectiveDate ?? null,
        changeSummary: body.changeSummary || "Mise à jour en brouillon.",
        actor: body.actor,
      });
      return NextResponse.json(result, { status: result.ok ? 200 : 400 });
    }

    if (body.action === "publish") {
      const result = publishDocument({
        slug: body.slug,
        effectiveDate: body.effectiveDate ?? null,
        actor: body.actor,
        notifyClients: body.notifyClients,
        changeSummary: body.changeSummary,
      });
      return NextResponse.json(result, { status: result.ok ? 200 : 422 });
    }

    return NextResponse.json(
      { ok: false, error: "Action non reconnue." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête invalide." },
      { status: 400 }
    );
  }
}

