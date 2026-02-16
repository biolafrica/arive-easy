import { DescriptionListEmpty } from "@/components/common/DescriptionList";

interface Props {
  title: string;
  subtitle: string;
  message: string;
  Icon: React.ElementType;
}

export function StageDescriptionEmpty({
  title,
  subtitle,
  message,
  Icon,
}: Props) {
  return (
    <DescriptionListEmpty
      title={title}
      subtitle={subtitle}
      message={message}
      icon={<Icon className="h-8 w-8" />}
    />
  );
}
