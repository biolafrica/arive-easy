import { MortgagePayment } from "@/type/pages/dashboard/mortgage";
import { createEntityHooks } from "./useFactory";


const mortgagePaymentHooks = createEntityHooks< 
  MortgagePayment,
  'mortgages',
  'list',
  'detail' 
>({
  resource: 'mortgage-payments',
  cacheKey: 'mortgages',
  listSubKey: 'list',
  detailSubKey: 'detail',
});

export const useMortgagePayments = mortgagePaymentHooks.useList;
export const useMortgagePayment = mortgagePaymentHooks.useDetail;
export const useAdminMortgagePayment = mortgagePaymentHooks.useAdminList