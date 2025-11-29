import type { CollectionConfig } from 'payload'
import { checkRolePermission } from '../access'

export const Activity: CollectionConfig = {
  slug: 'activities',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  access: {
    read: checkRolePermission('activities', 'read'),
    create: checkRolePermission('activities', 'create'),
    update: checkRolePermission('activities', 'update'),
    delete: checkRolePermission('activities', 'delete'),
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
      maxLength: 100,
    },
    {
      name: 'capacity',
      type: 'number',
      min: 1,
    },
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
}
