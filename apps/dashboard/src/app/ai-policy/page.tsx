import { getLegalDocument } from "../legal/legal-docs";
import { LegalPageLayout } from "../legal/legal-page-layout";

export default function AiPolicyPage() {
  return <LegalPageLayout doc={getLegalDocument("ai-policy")} />;
}

