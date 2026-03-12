import { TransactionBase } from "@/type/pages/dashboard/transactions";
import { createEntityHooks } from "./useFactory";

const transactionHooks = createEntityHooks<
  TransactionBase,'transactions','list','summary'
>({
  resource: 'transactions',
  cacheKey: 'transactions',
  listSubKey: 'list',
  detailSubKey: 'summary',
  ownerField: 'user_id',
  developerField: 'developer_id',
});

export const useTransactions  = transactionHooks.useOwnerList;
export const useSellerTransactions = transactionHooks.useSellerList;
export const useAdminTransactions  = transactionHooks.useAdminList;
