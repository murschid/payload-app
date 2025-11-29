import type { CollectionConfig } from 'payload'

export const EventChat: CollectionConfig = {
  slug: 'event-chats',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Collections',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
    },
    {
      name: 'sender',
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
