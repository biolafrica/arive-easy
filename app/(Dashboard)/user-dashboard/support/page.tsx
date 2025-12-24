import { FAQSection } from "@/components/sections/public/faq/FAQSection";

export default function UserDashboardSupport (){
  return(
    <div className="border rounded-lg bg-white p-10">
      <div className="">
        <FAQSection variant="tabs" description="email us on info@ariveasy.com if you can't find your question here" />
      </div>
   
    </div>
  )
}