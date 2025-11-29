import type { CollectionConfig } from 'payload'

export const Notification: CollectionConfig = {
  slug: 'notifications',
  admin: {
    group: 'Collections',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'message',
      type: 'richText',
      required: true,
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'isRead',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
    {
      name: 'sentDate',
      type: 'date',
      required: true,
    },
    {
      name: 'sourceType',
      type: 'text',
    },
    {
      name: 'sourceId',
      type: 'number',
    },
  ],
}
