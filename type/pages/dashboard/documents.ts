import { ApplicationStageKey } from "@/type/pages/dashboard/application";

interface Signature{
  buyer:boolean;
  seller:boolean;
  banker:boolean;
}

type TemplateType = 'contract_of_sales' | 'mortgage_agreement' | 'certificate_of_occupancy' | 'title_deed';
type TemplateCategory = 'online_generated' | 'scanned_upload';


export interface TemplateBase {
  id: string;
  name: string;
  slug: string; 
  requires_signature: Signature;
  type: TemplateType;
  category: TemplateCategory;
  version: number;
  template_file_url: string; 
  template_fields : string[];
  is_active: boolean;
  description?: string;
  stage: ApplicationStageKey;
  replaced_by?: string; 
  parent_template_id?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
}