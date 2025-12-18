import { SectionHeading } from "@/components/common/SectionHeading";
import MortgageCalculator from "@/components/sections/public/calculator/MortgageCalculator";

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