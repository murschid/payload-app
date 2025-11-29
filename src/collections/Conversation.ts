import type { CollectionConfig } from 'payload'

export const Conversation: CollectionConfig = {
  slug: 'conversations',
  admin: {
    group: 'Collections',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'userA',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'userB',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'lastMessageTime',
      type: 'date',
      required: true,
    },
    {
      name: 'messages',
      type: 'join',
      collection: 'chat-messages',
      on: 'conversation',
    },
  ],
}
