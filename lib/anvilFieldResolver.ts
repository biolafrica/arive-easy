import { PartnerDocumentBase } from "@/type/pages/dashboard/documents";
import { PropertyBase } from "@/type/pages/property";
import { ApplicationBase } from "@/type/pages/dashboard/application";
import { PersonalInfoType } from "@/type/pages/dashboard/approval";


interface ResolverContext {
  partnerDocument: PartnerDocumentBase;
  buyerInfo: PersonalInfoType;
  property: PropertyBase;
  application: ApplicationBase;
  applicationId: string;
}

function formatValueForAnvil(value: any, fieldType: string): any {
  if (value === null || value === undefined) return '';

  switch (fieldType) {
    case 'name':
    case 'fullName': {
      if (typeof value === 'object' && value.firstName !== undefined) return value;
      if (typeof value === 'string') {
        const parts = value.trim().split(/\s+/);
        if (parts.length === 1) return { firstName: parts[0], mi: '', lastName: '' };
        if (parts.length === 2) return { firstName: parts[0], mi: '', lastName: parts[1] };
        return { firstName: parts[0], mi: parts[1], lastName: parts.slice(2).join(' ') };
      }
      return value;
    }

    case 'address': {
      if (typeof value === 'object' && (value.street1 || value.street)) {
        return {
          street1: value.street || value.street1 || '',
          street2: value.street2 || '',
          city: value.city || '',
          state: value.state || '',
          zip: value.postal_code || value.zip || '',
          country: value.country || 'GB'
        };
      }
      if (typeof value === 'string') {
        return { street1: value, city: '', state: '', zip: '', country: 'GB' };
      }
      return value;
    }

    case 'phone': {
      const num = typeof value === 'string' ? value.replace(/\D/g, '') : String(value);
      return { num, region: 'GB', baseRegion: 'GB' };
    }

    case 'currency':
      return typeof value === 'string' ? parseFloat(value) : value;

    case 'date':
      if (!value) return '';
      try {
        return new Date(value).toISOString().split('T')[0];
      } catch {
        return value;
      }

    case 'email':
    case 'text':
    default:
      return String(value);
  }
}

export function resolveAnvilFieldValue(
  field: { field_key: string; field_type: string; data_source: string },
  context: ResolverContext
): any {
  const { field_key, field_type, data_source } = field;

  let rawValue: any;

  switch (data_source) {
    case 'seller': {
      rawValue = context.partnerDocument.static_data[field_key];
      break;
    }

    case 'buyer': {
      const buyer = context.buyerInfo;
      const buyerKeyMap: Record<string, any> = {
        buyerFullNameValue:      { firstName: buyer.first_name, mi: '', lastName: buyer.last_name },
        buyerFullName1:          { firstName: buyer.first_name, mi: '', lastName: buyer.last_name },
        buyerEmail:              buyer.email,
        buyerAddressValue:       buyer.address,
        buyerPhoneValue:         buyer.phone_number,
        buyerNationalityValue:   buyer.residence_country,
        buyerIdentificationValue: buyer.visa_status,
      };
      rawValue = buyerKeyMap[field_key];
      break;
    }

    case 'property': {
      const prop = context.property;
      const propertyKeyMap: Record<string, any> = {
        propertyAddress:         prop.address_full,
        propertyType:            prop.property_type,
        propertyTitleNumber:     prop.property_number,
        propertySurveyPlanNumber: prop.bedrooms,
        propertySize:prop.area_sqm
      };
      rawValue = propertyKeyMap[field_key];
      break;
    }

    case 'application': {
      const app = context.application;
      const appKeyMap: Record<string, any> = {
        totalPurchasePrice:  app.property_price,
        initialDepositLabel: app.down_payment_amount,
        balanceAmount:       app.property_price - app.down_payment_amount,
        paymentSchedule:     app.first_payment_date,
        completionDate:      app.last_payment_date,
      };
      rawValue = appKeyMap[field_key];
      break;
    }

    case 'system': {
      const systemKeyMap: Record<string, any> = {
        agreementDate:            new Date().toISOString().split('T')[0],
        agreementReferenceNumber: `CONTRACT-${context.applicationId}-${Date.now()}`,
      };
      rawValue = systemKeyMap[field_key];
      break;
    }

    default:
      rawValue = '';
  }

  return formatValueForAnvil(rawValue, field_type);
}

export function buildAnvilPayload(
  templateFields: Array<{ field_key: string; field_type: string; data_source: string }>,
  context: ResolverContext
): Record<string, any> {
  const data: Record<string, any> = {};

  for (const field of templateFields) {
    const value = resolveAnvilFieldValue(field, context);
    if (value !== undefined && value !== null && value !== '') {
      data[field.field_key] = value;
    }
  }

  console.log('data payload', data)

  return data;
}