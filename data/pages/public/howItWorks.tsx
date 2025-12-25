import { HowItWorksStep } from '@/type/howItWorks';
import ExplorePropertyIcon from '@/public/icons/explore-properties.png';
import SecureFinanceIcon from '@/public/icons/secure-financing.png';
import MakeOfferIcon from '@/public/icons/make-offer.png';
import CloseWithConfidenceIcon from '@/public/icons/create-profile.png';
import CreateBusinessIcon from '@/public/icons/create-profile.png';
import ProjectListIcon from '@/public/icons/list-sheet.png';
import AprrovalListIcon from '@/public/icons/aprroval-listing.png';
import HomeRequestIcon from '@/public/icons/process-request.png'


export const HOME_BUYER_STEPS: HowItWorksStep[] = [
  {
    id: 'explore',
    title: 'Explore Properties',
    description:
      'Browse a curated selection of properties tailored to your preferences and financial goals.',
    icon: ExplorePropertyIcon,
  },
  {
    id: 'finance',
    title: 'Secure Financing',
    description:
      'Get pre-approved for a mortgage and understand your financing options with our tools.',
    icon: SecureFinanceIcon,
  },
  {
    id: 'offer',
    title: 'Make an Offer',
    description:
      'Submit offers digitally and manage negotiations with ease on dashboard.',
    icon: MakeOfferIcon,
  },
  {
    id: 'close',
    title: 'Close with Confidence',
    description:
      'Finalize your purchase with secure payments and streamlined documentation.',
    icon: CloseWithConfidenceIcon,
  },
];

export const DEVELOPER_STEPS: HowItWorksStep[] = [
  {
    id: 'profile',
    title: 'Create Business Profile',
    description:
      'Sign up as a company and upload required business information.',
    icon: CreateBusinessIcon
  },
  {
    id: 'list',
    title: 'List Projects',
    description:
      'Submit your properties for expert review and approval.',
    icon: ProjectListIcon,
  },
  {
    id: 'approve',
    title: 'Get Approved & Listed',
    description:
      'Our certified experts review and approve your listings.',
    icon: AprrovalListIcon,
  },
  {
    id: 'process',
    title: 'Process Requests',
    description:
      'Manage and process purchase requests from qualified buyers.',
    icon: HomeRequestIcon,
  },
];

export const TABS = [
  { id: 'homebuyer', label: 'Home Buyer' },
  { id: 'developer', label: 'Developer' },

];
