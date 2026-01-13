import { StatusConfig, TableColumn } from "@/components/common/DataTable";
import { formatNumberDate, formatUSD, toNumber } from "@/lib/formatter";
import { OffersBase } from "@/type/pages/dashboard/offer";

export const MOCK_DATA:OffersBase[] = [
  {
    id: '1',
    listing_id: '101',
    buyer_id: '201',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-16T12:00:00Z',
    status: 'pending',
    listings: {
      title: 'Modern Apartment in City Center',
      price: '350000'
    },
    users: {
      name: 'Alice Johnson',
      email: "alice@gmail.com",
      phone_number: "123-456-7890"
    }
  },
  {
    id: '2',
    listing_id: '102',
    buyer_id: '202',
    created_at: '2024-02-20T14:45:00Z',
    updated_at: '2024-02-21T09:15:00Z',
    status: 'accepted',
    listings: {
      title: 'Cozy Cottage by the Lake',
      price: '275000'
    },
    users: {
      name: 'Bob Smith',
      email: 'bog@gmail.com',
      phone_number: '987-654-3210'
    }
  },
  {
    id: '3',
    listing_id: '103',
    buyer_id: '203',
    created_at: '2024-03-10T08:20:00Z',
    updated_at: '2024-03-11T11:30:00Z',
    status: 'rejected',
    listings: {
      title: 'Luxury Villa with Ocean View',
      price: '1250000'
    },
    users: {
      name: 'Carol Davis',
      email: 'carol@gmail.com',
      phone_number: '555-123-4567'
    }


  }
];

export const columns: TableColumn<OffersBase>[] = [
  { key: 'property', header: 'Property', sortable: false, accessor: (row) => row.listings.title},
  { key: 'buyer', header: 'Buyer', sortable: false, accessor: (row) => row.users.name},
  { key: 'created_at', header: 'Date', sortable: false, accessor: (row) => formatNumberDate(row.created_at)},
  {key:'offer_amount', header:'Offer Amount', sortable:false, accessor:(row) => formatUSD({ amount: toNumber(row.listings.price), fromCents: false, decimals: 0 })},
];

export const statusConfig: StatusConfig[] = [
  { label: 'Accepted', value: 'accepted', variant: 'green' },
  { label: 'Pending', value: 'pending', variant: 'yellow' },
  { label: 'Decline', value: 'rejected', variant: 'red' }
];

export function useOffers(queryParams?: Record<string, any>) {
  return {
    offers:MOCK_DATA,
    isLoading: false,
  }
}