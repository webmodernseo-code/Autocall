import { getLegalDocument } from "../legal/legal-docs";
import { LegalPageLayout } from "../legal/legal-page-layout";

export default function TermsOfSalePage() {
  return <LegalPageLayout doc={getLegalDocument("terms-of-sale")} />;
}

