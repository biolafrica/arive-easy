import { SectionHeading } from "@/components/common/SectionHeading";
import { createMetadata } from "@/components/common/metaData";
import MortgageCalculator from "@/components/sections/public/calculator/MortgageCalculator";

export const metadata = createMetadata({
  title: "Mortgage Calculator - Kletch",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/calculator",
});


export default function CalculatorPage(){
  return(
    <div className="py-20">
      <SectionHeading
        eyebrow="Estimate Your Mortgage"
        title="Mortgage Calculator"
        description="Explore a curated selection of our finest properties, handpicked for their investment potential and unique appeal."
      />

      <MortgageCalculator/>
    </div>
  )
}