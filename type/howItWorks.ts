import { StaticImageData } from "next/image";

export type HowItWorksRole = 'homebuyer' | 'developer';

export interface HowItWorksStep {
  id: string;
  title: string;
  description: string;
  icon: StaticImageData;
}
