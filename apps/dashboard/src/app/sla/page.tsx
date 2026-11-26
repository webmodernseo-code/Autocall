import { getLegalDocument } from "../legal/legal-docs";
import { LegalPageLayout } from "../legal/legal-page-layout";

export default function SlaPage() {
  return <LegalPageLayout doc={getLegalDocument("sla")} />;
}

