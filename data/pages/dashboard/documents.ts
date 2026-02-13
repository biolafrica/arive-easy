import { StatusConfig, TableColumn } from "@/components/common/DataTable";
import {formatDate } from "@/lib/formatter";
import { PartnerDocumentBase, TemplateBase } from "@/type/pages/dashboard/documents";
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase";

export const columns:TableColumn<TemplateBase>[] = [
  {key: 'template_number', header: 'ID' , sortable: false},
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

export const partnerColumns:TableColumn<PartnerDocumentBase>[] = [
  {key: 'partner_document_number', header: 'ID' , sortable: false},
  {key: 'document_name', header: 'Name' , sortable: false},
  {key: "created_at", header: 'Created At' , sortable: false, accessor:(value) =>formatDate(value.created_at)},
  {key: 'template_version', header: 'Template Version' , sortable: false},
  {key: 'partner_type', header: 'Document Type' , sortable: false,},  
]

export const sellerColumns:TableColumn<PartnerDocumentBase>[] = [
  {key: 'partner_document_number', header: 'ID' , sortable: false},
  {key: 'document_name', header: 'Name' , sortable: false},
  {key: "created_at", header: 'Created At' , sortable: false, accessor:(value) =>formatDate(value.created_at)},
  {key: 'template_version', header: 'Template Version' , sortable: false},
]

export const statusConfig: StatusConfig[] = [
  { value: 'active', label: 'Active', variant: 'green',  },
  { value: 'inactive', label: 'InActive', variant: 'blue' },
];

export const partnerStatusConfig: StatusConfig[] = [
  { value: 'draft', label: 'Draft', variant: 'yellow'},
  { value: 'active', label: 'active', variant: 'green' },
  { value: 'archived', label: 'Archived', variant: 'blue' },
];