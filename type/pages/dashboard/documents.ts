
interface Signature{
  buyer:boolean;
  seller:boolean;
  banker:boolean;
}

export type TemplateType = 'contract_of_sales' | 'mortgage_agreement' | 'certificate_of_occupancy' | 'title_deed';
export type TemplateCategory = 'online_generated' | 'scanned_upload';


export interface TemplateBase {
  id: string;
  name: string;
  slug: string; 
  template_number: string;
  requires_signature: Signature;
  type: TemplateType;
  version: number;
  template_file_url: string; 
  template_fields : string[];
  status: 'active' | 'inactive';
  description?: string;
  replaced_by?: string; 
  parent_template_id?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
}