import { StatusConfig, TableColumn } from "@/components/common/DataTable";
import { FormField } from "@/type/form";
import { TemplateBase } from "@/type/pages/dashboard/documents";
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase";

export const templateDocumentFields:FormField[] = [
  { name:'name', label:'Template Name', type:'text', required:true, placeholder:'Enter template name'},
  { name:'description', label:'Description', type:'textarea', required:false, placeholder:'Enter description'},
  { name:'type', label:'Document Type', type:'select', required:true, options:[
    { label:'Contract of Sales', value:'contract_of_sales' },
    { label:'Mortgage Agreement', value:'mortgage_agreement' },
    { label:'Certificate of Occupancy', value:'certificate_of_occupancy' },
    { label:'Title Deed', value:'title_deed' },
  ]},
  { name:'requires_signature', label:'Signatures Required', type:'select', required:true, options:[
    { label:'Buyer', value:'buyer' },
    { label:'Seller', value:'seller' },
    { label:'Buyer and Seller', value:'both' },
    { label:'None', value:'' },
  ]},

  { name:'version', label:'Template Version', type:'number', required:true},
  { name:'template_file_url', label:'Template pdf', type:'file', required:true, accept:'.pdf', helperText:'Upload a PDF file for the template'},
]

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

export const statusConfig: StatusConfig[] = [
  { value: 'active', label: 'Active', variant: 'green',  },
  { value: 'inactive', label: 'InActive', variant: 'blue' },
];