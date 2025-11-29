import type { CollectionConfig } from 'payload'

export const Transaction: CollectionConfig = {
  slug: 'transactions',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Collections',
  },
  fields: [
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0.01,
    },
    {
      name: 'pType',
      type: 'select',
      required: true,
      options: [
        { label: 'Payment', value: 'Payment' },
        { label: 'Purchase', value: 'Purchase' },
        { label: 'Refund', value: 'Refund' },
      ],
    },
    {
      name: 'pStatus',
      type: 'select',
      required: true,
      options: [
        { label: 'Paid', value: 'Paid' },
        { label: 'Processing', value: 'Processing' },
        { label: 'RefundRequested', value: 'RefundRequested' },
        { label: 'Refunded', value: 'Refunded' },
      ],
    },
    {
      name: 'transactionDate',
      type: 'date',
      required: true,
    },
    {
      name: 'notes',
      type: 'richText',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
    },
  ],
}
