import { FAQSection } from "@/components/sections/public/faq/FAQSection";

export default function AdminDashboardSupport (){
  return(
    <div className="border rounded-lg bg-white p-10">
      <div className="">
        <FAQSection variant="tabs" description="communicate with your superior if you can't find your question here" />
      </div>
   
    </div>
  )
}