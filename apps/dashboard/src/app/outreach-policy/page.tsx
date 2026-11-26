import { getLegalDocument } from "../legal/legal-docs";
import { LegalPageLayout } from "../legal/legal-page-layout";

export default function OutreachPolicyPage() {
  return <LegalPageLayout doc={getLegalDocument("outreach-policy")} />;
}

