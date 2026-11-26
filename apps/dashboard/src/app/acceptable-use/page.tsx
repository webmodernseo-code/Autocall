import { getLegalDocument } from "../legal/legal-docs";
import { LegalPageLayout } from "../legal/legal-page-layout";

export default function AcceptableUsePage() {
  return <LegalPageLayout doc={getLegalDocument("acceptable-use")} />;
}

