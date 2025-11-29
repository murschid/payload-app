import type { CollectionConfig } from 'payload'

export const Event: CollectionConfig = {
  slug: 'events',
  admin: {
    group: 'Collections',
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      minLength: 5,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      maxLength: 255,
    },
    {
      name: 'eStatus',
      type: 'select',
      required: true,
      options: [
        { label: 'Proposed', value: 'Proposed' },
        { label: 'Active', value: 'Active' },
        { label: 'Rejected', value: 'Rejected' },
        { label: 'Complete', value: 'Complete' },
      ],
    },
    {
      name: 'isSponsored',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'sponsorshipExpires',
      type: 'date',
      admin: {
        condition: (data) => Boolean(data?.isSponsored),
      },
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
    },
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'attendees',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'transactions',
      type: 'join',
      collection: 'transactions',
      on: 'event',
    },
    {
      name: 'chatMessages',
      type: 'join',
      collection: 'event-chats',
      on: 'event',
    },
  ],
}
