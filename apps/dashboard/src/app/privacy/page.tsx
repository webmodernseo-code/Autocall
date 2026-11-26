import { getLegalDocument } from "../legal/legal-docs";
import { LegalPageLayout } from "../legal/legal-page-layout";

export default function PrivacyPage() {
  return <LegalPageLayout doc={getLegalDocument("privacy")} />;
}

