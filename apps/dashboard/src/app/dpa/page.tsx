import { getLegalDocument } from "../legal/legal-docs";
import { LegalPageLayout } from "../legal/legal-page-layout";

export default function DpaPage() {
  return <LegalPageLayout doc={getLegalDocument("dpa")} />;
}

