import { StatusConfig, TableColumn } from "@/components/common/DataTable";

interface Transactiontype{
  application_id : string;
  property_name : string;
  current_step: string;
  progress : string;
}

export const columns: TableColumn<Transactiontype>[] = [
  { key: 'application_id', header: 'Application ID', sortable: true,},
  { key: 'property_name', header: 'Property Name', sortable: true},
  { key: 'current_step', header: 'Current Step', sortable: false},
  { key: 'progress', header: 'Progress', sortable: false},
];

export const statusConfig: StatusConfig[] = [
  { value: 'active', label: 'Active', variant: 'green' },
  { value: 'pending', label: 'Pending', variant: 'yellow' },
  { value: 'inactive', label: 'Inactive', variant: 'red' },
  { value: 'verified', label: 'Verified', variant: 'blue' },
];

export const data = [
  { id: '1', application_id:'APP-001', property_name:'Maplewood Garden', current_step: 'Pre Approval', progress: '50%', status:'pending'},
  { id: '2', application_id:'APP-002', property_name:'Mary Keyes Residence', current_step: 'Application', progress: '100%', status:'active'},
  { id: '3', application_id:'APP-003', property_name:'Sunnyvale Heights', current_step: 'Financing', progress: '80%', status:'inactive'},
  { id: '4', application_id:'APP-004', property_name:'Cedar Point Retreat', current_step: 'Credit Check', progress: '70%', status:'verified'},
];