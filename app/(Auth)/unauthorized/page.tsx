import { PagePlaceholder } from "@/components/common/Placeholder";
import { createMetadata } from "@/components/common/metaData";

export const metadata = createMetadata({ noIndex: true });

export default function UnauthorizedPage() {
  return (
    <PagePlaceholder
      title="Access Restricted"
      description="This page is above your access level. If you believe this is a mistake, please contact support."
    />
  );
}
