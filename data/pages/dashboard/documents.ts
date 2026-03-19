import { StatusConfig, TableColumn } from "@/components/table/DataTable";
import {formatDate } from "@/lib/formatter";
import { FormField } from "@/type/form";
import * as document from "@/type/pages/dashboard/documents";
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase";

export const columns:TableColumn<document.TemplateBase>[] = [
  {key: 'template_number', header: 'Document ID' , sortable: false},
  {key: 'name', header: 'Name' , sortable: false},
  {key: 'type', header: 'Type' , sortable: false, accessor:(value) => humanizeSnakeCase(value.type)},
  {key: 'version', header: 'Template Version' , sortable: false},
  {key: 'requires_signature', header: 'Signatures Required' , sortable: false, accessor:(value) => {
    if(value.requires_signature.buyer && value.requires_signature.seller) return 'Buyer and Seller';
    if(value.requires_signature.buyer) return 'Buyer';
    if(value.requires_signature.seller) return 'Seller';
    return 'None';
  }},
]

export const partnerColumns:TableColumn<document.PartnerDocumentBase>[] = [
  {key: 'partner_document_number', header: 'Document ID' , sortable: false},
  {key: 'document_name', header: 'Name' , sortable: false},
  {key: "created_at", header: 'Created At' , sortable: false, accessor:(value) =>formatDate(value?.created_at || '')},
  {key: 'template_version', header: 'Template Version' , sortable: false},
  {key: 'partner_type', header: 'Document Type' , sortable: false,},  
]

export const transactionalColumns:TableColumn<document.TransactionDocumentBase>[] = [
  {key: 'transaction_document_number', header: 'Document ID' , sortable: false},
  {key: 'document_type', header: 'Document Type' , sortable: false},
  {key: "created_at", header: 'Created At' , sortable: false, accessor:(value) =>formatDate(value?.created_at || '')},
  {key: 'esign_provider', header: 'Provider' , sortable: false},
]

export const sellerColumns:TableColumn<document.PartnerDocumentBase>[] = [
  {key: 'partner_document_number', header: 'ID' , sortable: false},
  {key: 'document_name', header: 'Name' , sortable: false},
  {key: "created_at", header: 'Created At' , sortable: false, accessor:(value) =>formatDate(value?.created_at || '')},
  {key: 'template_version', header: 'Template Version' , sortable: false},
]

export const statusConfig: StatusConfig[] = [
  { value: 'active', label: 'Active', variant: 'green',  },
  { value: 'inactive', label: 'InActive', variant: 'blue' },
];

export const tStatusConfig: StatusConfig[] = [
  { value: 'completed', label: 'Completed', variant: 'green'},
  { value: 'sent', label: 'Sent', variant: 'blue' },
  { value: 'partially_signed', label: 'Partial', variant: 'yellow' },
  { value: 'voided', label: 'Voided', variant: 'red' },
  { value: 'expired', label: 'Expired', variant: 'red' },
];

export const partnerStatusConfig: StatusConfig[] = [
  { value: 'draft', label: 'Draft', variant: 'yellow'},
  { value: 'active', label: 'active', variant: 'green' },
  { value: 'archived', label: 'Archived', variant: 'blue' },
];

export const documentTypes = [
  { value: 'contract_of_sales', label: 'Contract of Sales' },
  { value: 'mortgage_agreement', label: 'Mortgage Agreement' },
  { value: 'under_writtten', label: 'Under Written'},
]

export const staticDocumentTypes = [
  { value: 'certificate_of_occupancy', label: 'Certificate Of Occupancy' },
  { value: 'valuation_report', label: 'Property Valuation Report' },
  { value: 'governor-consent', label: "Governor's Consent" },
  { value: 'deed_of_conveyance', label: 'Dead of Conveyance' },
  { value: 'survery_plan', label: 'Survey Plan' },
  { value: 'building_plan', label: 'Approved Building Plan' },
]


export const staticDocumentField:FormField[]=[
  { name: 'document_type', label: 'Document Type', type: 'select', required: true,
    options: [
      { label: 'Select document', value: '' },
      { value: 'certificate_of_occupancy', label: 'Certificate Of Occupancy' },
      { value: 'valuation_report', label: 'Property Valuation Report' },
      { value: 'governor-consent', label: "Governor's Consent" },
      { value: 'deed_of_conveyance', label: 'Dead of Conveyance' },
      { value: 'survery_plan', label: 'Survey Plan' },
      { value: 'building_plan', label: 'Approved Building Plan' },
    ],
  },
  {name:'generated_document_url', label:"Upload Document", type:'file', required:true, placeholder:"Upload document file", accept:"image/*,application/pdf"},
]

export const dynamicDocumentField:FormField[]=[
  { name: 'document_type', label: 'Document Type', type: 'select', required: true,
    options: [
      { label: 'Select document', value: '' },
      { value: 'contract_of_sales', label: 'Contract of Sales' },
      { value: 'mortgage_agreement', label: 'Mortgage Agreement' },
      { value: 'under_writtten', label: 'Under Written'},
    ],
  },
]

export const staticDocumentInitialValue:document.StaticDocumentForm = {
  document_type:'',
  generated_document_url:null
}

export const dynamicDocumentInitialValue:document.DynamicDocumentForm = {
  document_type:'',
  
}