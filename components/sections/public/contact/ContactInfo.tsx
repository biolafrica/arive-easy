import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-heading">
        Contact us
      </h3>

      <p className="text-secondary max-w-md">
        We&apos;re here to help with any questions about mortgages,
        properties, and more. Reach out today!
      </p>

      <ul className="space-y-4 text-sm">
        <li className="flex items-center gap-3">
          <EnvelopeIcon className="h-5 w-5 text-accent" />
          <a
            href="mailto:support@ariveasy.com"
            className="hover:underline"
          >
            info@ariveasy.com
          </a>
        </li>

        <li className="flex items-center gap-3">
          <PhoneIcon className="h-5 w-5 text-accent" />
          <span>+1 (555) 000-0000</span>
        </li>

        <li className="flex items-center gap-3">
          <MapPinIcon className="h-5 w-5 text-accent" />
          <span>123 Sample St, Sydney NSW 2000 AU</span>
        </li>
      </ul>
    </div>
  );
}
