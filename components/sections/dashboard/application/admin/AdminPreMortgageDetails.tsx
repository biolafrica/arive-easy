import { DescriptionList, DescriptionListEmpty } from "@/components/common/DescriptionList";
import { StepProgress } from "@/components/ui/ProgressBar";
import { ApplicationBase} from "@/type/pages/dashboard/application";
import * as icon from "@heroicons/react/24/outline";
import { getbadge } from "../../listing/SellerPropertyViewTop";
import { formatDate, formatUSD } from "@/lib/formatter";
import { Button } from "@/components/primitives/Button";
import { useState } from "react";
import AddPayment from "./AddPayment";
import AddDocuments from "./AddDocuments";
import AddTerms from "./AddTerms";

interface Props {
  applications: ApplicationBase;
}

export default function AdminPreMortgageDetails ({ applications }: Props){
  const [paymentShowModal, setPaymentShowModal] = useState(false);
  const [documentShowModal, setDocumentShowModal] = useState(false);
  const [termShowModal, setTermShowModal] = useState(false);

  const home = applications.stages_completed.identity_verification?.data;
  const immigration = applications.stages_completed.identity_verification?.data;
  const property = applications.stages_completed.property_selection;
  const payment = applications.stages_completed.payment_setup;

  const getStep=()=>{
    switch (applications.current_stage) {
      case 'identity_verification':
        return 1;
      case 'property_selection':
        return 2;
      case 'terms_agreement':
        return 3;
      case 'payment_setup':
        return 4;
      case 'mortgage_activation':
        return 5;
      default:
        return 1;
    }
  }

  const addTerms=()=>{
    console.log ('terms and condition')
  }
  
  return(
    <>
      <div>

        <StepProgress
          currentStep={getStep()}
          totalSteps={5}
          className="mb-8"
        />

        <div className="space-y-5 mt-5">

          {applications.stages_completed.identity_verification?.status === "upcoming" ? (
            <DescriptionListEmpty
              title="Identity Verification Stage"
              subtitle="User Identity Verification Stage."
              icon={<icon.IdentificationIcon className="h-8 w-8" />}
              message="User is yet to reach identity verification stage."
            />
            ):(
            <DescriptionList
              title="Identity Verification"
              subtitle="User Identity Verification Stage"
              items={[

                { label: 'Processing Fee', value: { type: 'custom',  
                  node:( 
                    <div className="flex items-center gap-10">
                      <h4 className={getbadge(applications.processing_fee_payment_status || "upcoming")}>
                        {applications.processing_fee_payment_status || "upcoming"}
                      </h4> 
                      <h4>
                        {formatDate( applications.processing_fee_payment_date || "")}
                      </h4> 
                    </div>
                  )
                }},

                { label: 'Home Verification', value: { type: 'custom', 
                  node:( 
                    <div className="flex items-center gap-10">
                      <h4 className={getbadge( home?.home_country_status || "upcoming")}>
                        {home?.home_country_status|| "upcoming"}
                      </h4>
                      <h4>
                        {formatDate( home?.home_country_verified_at || '')}
                      </h4> 
                      
                    </div>
                  )
                }},

                { label: 'Immigration Verification', value: { type: 'custom', 
                  node:(
                    <div className="flex items-center gap-10">
                      <h4 className={getbadge( immigration?.immigration_status || "upcoming")}>
                        {immigration?.home_country_status || "upcoming"}
                      </h4> 
                      <h4>
                        {formatDate(home?.immigration_verified_at || '')}
                      </h4> 
                    </div>
                  )
                }},
      
              ]}
            />
          )}

          {applications.stages_completed.property_selection?.status === "upcoming" ? (
            <DescriptionListEmpty
              title="Property Selection Stage"
              subtitle="User Property Selection Stage."
              icon={<icon.HomeIcon className="h-8 w-8" />}
              message="User is yet to reach property selection stage."
            />
          ):(
            <DescriptionList
              title="Property Selection"
              subtitle="User Property Selection Stage"
              items={[
                { label: 'Status', value: { type: 'text', value:`${property?.data.status || 'No Action Yet'}` }},
                { label: 'Property Name', value: { type: 'text', value:`${property?.data.property_name || 'No Action Yet'}` }},
                { label: 'Type', value: { type: 'text', value:`${property?.data.type || 'No Action Yet'}` }},
                { label: 'Date Submitted', value: { type: 'text', value:`${formatDate(property?.data.submitted_at) || 'No Action Yet'}` }},
                { label: 'Reason', value: { type: 'text', value:`${property?.data.reason|| 'No Action Yet'}` }},
              ]}
            />
          )}

          {applications.stages_completed.terms_agreement?.status === "upcoming" ? (
            <DescriptionListEmpty
              title="Terms Agreement Stage"
              subtitle="User Terms Agreement Stage."
              icon={<icon.DocumentIcon className="h-8 w-8" />}
              message="User is yet to reach Terms Agreement stage."
            />
          ): (
            <DescriptionList
              title="Terms Agreement"
              subtitle="User Terms Agreement Stage"
              items={[
                { label: 'Terms Details', value: { type: 'custom', 
                  node:(
                    <Button onClick={()=>setTermShowModal(true)} size='xs' >
                      Add Terms
                    </Button>
                  ) 
                }},

                {label: 'Loan Amount', value:{type:'text', value:`${applications.approved_loan_amount || 'Not set'}`}},
                {label: 'Loan Month', value:{type:'text', value:`${applications.loan_term_months || 'Not set'}`}},
                {label: 'Loan Interest', value:{type:'text', value:`${applications.interest_rate || 'Not set'}`}},
                {label: 'Down Payment Percentage', value:{type:'text', value:`${applications.down_payment_percentage || 'Not set'}`}},


                { label: 'Agreement Documents', value: { type: 'custom', 
                  node:(
                    <Button onClick={()=>setDocumentShowModal(true)} size='xs' >
                      Add Documents
                    </Button>
                  ) 
                }},
                { label: 'Complete Stage', value: { type: 'custom', 
                  node:(
                    <Button onClick={addTerms} size='xs' >
                      Complete Stage
                    </Button>
                  ) 
                }},
              ]}
            />
          )}

          {applications.stages_completed.payment_setup?.status === 'upcoming' ? (
            <DescriptionListEmpty
              title="Payment Setup Stage"
              subtitle="User Payment Setup Stage."
              icon={<icon.CreditCardIcon className="h-8 w-8" />}
              message="User is yet to reach payment setup stage."
            />
          ): (
            <DescriptionList
              title="Payment Setup"
              subtitle="User Payment Setup Stage"
              items={[
                { label: 'Payments', value: { type: 'custom', 
                  node:(
                    <Button onClick={()=>setPaymentShowModal(true)} size='xs' >
                      Add Payments
                    </Button>
                  ) 
                }},
                
                { label: 'Down Payment', value: { type: 'custom',
                  node:(
                    <div className="flex items-center gap-10">
                      <h4 className={getbadge( payment?.data.down_payment_status || "upcoming")}>
                        { payment?.data.down_payment_status || "upcoming"}
                      </h4> 
                      <h4>
                        {formatUSD({amount:payment?.data.down_payment_amount}) || ''}
                      </h4> 
                      <h4>
                        {formatDate(payment?.data.down_payment_date || '')}
                      </h4> 
                    </div>
                  )
                }},

                { label: 'Valuation Fee', value: { type: 'custom',   
                  node:(
                    <div className="flex items-center gap-10">
                      <h4 className={getbadge( payment?.data.valuation_fee_status || "upcoming")}>
                        { payment?.data.valuation_fee_status || "upcoming"}
                      </h4> 
                      <h4>
                        { formatUSD({amount:payment?.data.valuation_fee_amount})  || ''}
                      </h4> 
                      <h4>
                        {formatDate(payment?.data.valuation_fee_date || '')}
                      </h4> 
                    </div>
                  ) 
                }},

                { label: 'Legal Fee', value: { type: 'custom',
                  node:(
                    <div className="flex items-center gap-10">
                      <h4 className={getbadge( payment?.data.legal_fee_status || "upcoming")}>
                        { payment?.data.valuation_fee_status || "upcoming"}
                      </h4> 
                      <h4>
                        { formatUSD({amount:payment?.data.legal_fee_amount})  || ''}
                      </h4> 
                      <h4>
                        {formatDate(payment?.data.legal_fee_date || '')}
                      </h4> 
                    </div>
                  )  
                }},

                { label: 'Complete Stage', value: { type: 'custom', 
                  node:(
                    <Button onClick={()=>console.log("complete stage")} size='xs' >
                      Complete Stage
                    </Button>
                  ) 
                }},
              ]}
            />
          )}

          {applications.stages_completed.mortgage_activation?.status === "upcoming" ? (
            <DescriptionListEmpty
              title="Mortgage Activation Stage"
              subtitle="User Mortgage Activation Stage."
              icon={<icon.HomeModernIcon className="h-8 w-8" />}
              message="User is yet to reach mortgage activation stage."
            />
          ): (
            <DescriptionList
              title="Mortgage Activation"
              subtitle="User Mortgage Activation Stage"
              items={[
                { label: 'Payment Plan', value: { type: 'custom',
                  node:(
                    <Button onClick={addTerms} size='xs' >
                      Create Plan
                    </Button>
                  )
                }},
                { label: 'Mortgage Activation', value: { type: 'custom',
                  node:(
                    <Button onClick={addTerms} size='xs' >
                      Activate Mortgage
                    </Button>
                  )
                }},
      
              ]}
            />
          )}
    

        </div >
      </div>

      <AddPayment showModal={paymentShowModal} setShowModal={setPaymentShowModal}/>
      <AddDocuments showModal={documentShowModal} setShowModal={setDocumentShowModal}/>
      <AddTerms showModal={termShowModal} setShowModal={setTermShowModal}/>

    </>
  )
}

