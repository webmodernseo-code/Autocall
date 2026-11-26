import { getLegalDocument } from "../legal/legal-docs";
import { LegalPageLayout } from "../legal/legal-page-layout";

export default function SubprocessorsPage() {
  return <LegalPageLayout doc={getLegalDocument("subprocessors")} />;
}

