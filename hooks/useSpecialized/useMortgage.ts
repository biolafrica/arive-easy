import { Mortgage } from "@/type/pages/dashboard/mortgage";
import { createEntityHooks } from "./useFactory";


const mortgageHooks = createEntityHooks< 
  Mortgage,
  'mortgages',
  'list',
  'detail' 
>({
  resource: 'mortgages',
  cacheKey: 'mortgages',
  listSubKey: 'list',
  detailSubKey: 'detail',
  ownerField: 'user_id',
});

export const useMortgages      = mortgageHooks.useOwnerList;
export const useMortgage       = mortgageHooks.useDetail;
export const useAdminMortgages = mortgageHooks.useAdminList;
