export interface FieldMapping {
  fieldKey: string;
  dataSource: 'seller' | 'buyer' | 'property' | 'application' | 'system';
  mapping: string | ((data: any, context?: any) => any);
  defaultValue?: any;
  format?: 'currency' | 'date' | 'phone' | 'address';
}


export const DOCUMENT_FIELD_MAPPINGS: FieldMapping[] = [
  { fieldKey: 'buyer.full_name', dataSource: 'buyer', mapping: (buyer) => buyer.full_name || `${buyer.first_name || ''} ${buyer.last_name || ''}`.trim() },
  { fieldKey: 'buyer.first_name', dataSource: 'buyer', mapping: 'first_name' },
  { fieldKey: 'buyer.last_name', dataSource: 'buyer', mapping: 'last_name' },
  { fieldKey: 'buyer.email', dataSource: 'buyer', mapping: 'email' },
  { fieldKey: 'buyer.phone', dataSource: 'buyer', mapping: 'phone', format: 'phone' },
  { fieldKey: 'buyer.address', dataSource: 'buyer', mapping: 'address' },
  { fieldKey: 'buyer.nationality', dataSource: 'buyer', mapping: 'nationality' },
  { fieldKey: 'buyer.identification', dataSource: 'buyer', mapping: 'identification_number' },
  { fieldKey: 'buyer.date_of_birth', dataSource: 'buyer', mapping: 'date_of_birth', format: 'date' },

  { fieldKey: 'property.address', dataSource: 'property', mapping: (prop) => prop.full_address || prop.address },
  { fieldKey: 'property.type', dataSource: 'property', mapping: 'property_type' },
  { fieldKey: 'property.size', dataSource: 'property', mapping: 'size' },
  { fieldKey: 'property.title_number', dataSource: 'property', mapping: 'title_number' },
  { fieldKey: 'property.survey_plan', dataSource: 'property', mapping: 'survey_plan' },
  { fieldKey: 'property.price', dataSource: 'property', mapping: 'price', format: 'currency' },
  { fieldKey: 'property.bedrooms', dataSource: 'property', mapping: 'bedrooms' },
  { fieldKey: 'property.bathrooms', dataSource: 'property', mapping: 'bathrooms' },

  { fieldKey: 'purchase.total_price', dataSource: 'application', mapping: 'purchase_price', format: 'currency' },
  { fieldKey: 'purchase.deposit_amount', dataSource: 'application', mapping: 'deposit_amount', format: 'currency' },
  { fieldKey: 'purchase.balance_amount', dataSource: 'application', mapping: (app) => (app.purchase_price || 0) - (app.deposit_amount || 0), format: 'currency' },
  { fieldKey: 'purchase.payment_schedule', dataSource: 'application', mapping: 'payment_schedule' },
  { fieldKey: 'completion.date', dataSource: 'application', mapping: 'completion_date', format: 'date' },
  { fieldKey: 'application.reference', dataSource: 'application', mapping: 'reference_number' },

  { fieldKey: 'agreement.date', dataSource: 'system', mapping: () => new Date().toLocaleDateString() },
  { fieldKey: 'agreement.reference_number', dataSource: 'system', mapping: (_, context) => `CONTRACT-${context.applicationId}-${Date.now()}` },
  { fieldKey: 'system.current_date', dataSource: 'system', mapping: () => new Date().toISOString() },
  { fieldKey: 'system.timestamp', dataSource: 'system', mapping: () => Date.now() },
];


export function resolveFieldValue(
  fieldKey: string,
  dataSource: string,
  data: {
    partnerDocument: any;
    buyer: any;
    property: any;
    application: any;
    applicationId: string;
  },
  defaultValue?: any
): any {
  
  const fieldMapping = DOCUMENT_FIELD_MAPPINGS.find(
    mapping => mapping.fieldKey === fieldKey && mapping.dataSource === dataSource
  );

  if (!fieldMapping) {
    const sourceData = getDataSource(dataSource, data);
    const directValue = getNestedValue(sourceData, fieldKey.split('.').slice(1).join('.'));
    return directValue || defaultValue;
  }

  const sourceData = getDataSource(fieldMapping.dataSource, data);
  
  let value;
  if (typeof fieldMapping.mapping === 'function') {
    value = fieldMapping.mapping(sourceData, { applicationId: data.applicationId });
  } else if (fieldMapping.dataSource === 'seller') {
    value = getNestedValue(data.partnerDocument.static_data, fieldMapping.mapping);
  } else {
    value = sourceData[fieldMapping.mapping];
  }

  if (value && fieldMapping.format) {
    value = applyFormat(value, fieldMapping.format);
  }

  return value || fieldMapping.defaultValue || defaultValue;
}


function getDataSource(dataSource: string, data: any): any {
  switch (dataSource) {
    case 'seller':
      return data.partnerDocument?.static_data || {};
    case 'buyer':
      return data.buyer;
    case 'property':
      return data.property;
    case 'application':
      return data.application;
    case 'system':
      return {}; // System fields don't need source data
    default:
      return {};
  }
}


function applyFormat(value: any, format: string): any {
  switch (format) {
    case 'currency':
      return typeof value === 'number' ? `$${value.toLocaleString()}` : value;
    case 'date':
      return value instanceof Date ? 
        value.toLocaleDateString() : typeof value === 'string' ? 
        new Date(value).toLocaleDateString() : value;
    case 'phone':
      return formatPhoneNumber(value);
    case 'address':
      return value; // Could add address formatting here
    default:
      return value;
  }
}


function formatPhoneNumber(phone: string): string {
  if (!phone) return phone;
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}


function getNestedValue(obj: any, path: string): any {
  if (!path) return obj;
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
