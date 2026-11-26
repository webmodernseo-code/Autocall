import { getLegalDocument } from "../legal/legal-docs";
import { LegalPageLayout } from "../legal/legal-page-layout";

export default function SecurityPage() {
  return <LegalPageLayout doc={getLegalDocument("security")} />;
}

