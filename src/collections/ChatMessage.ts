import type { CollectionConfig } from 'payload'

export const ChatMessage: CollectionConfig = {
  slug: 'chat-messages',
  admin: {
    group: 'Collections',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
    },
    {
      name: 'conversation',
      type: 'relationship',
      relationTo: 'conversations',
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
}
