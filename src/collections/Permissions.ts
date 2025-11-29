import type { CollectionConfig } from 'payload'
import { isAdminOrSuperAdmin } from '../access'
import { PermissionsMatrix } from './Permissions/components/PermissionsMatrix'

export const Permissions: CollectionConfig = {
  slug: 'permissions',
  admin: {
    useAsTitle: 'role',
    group: 'System',
  },
  access: {
    read: isAdminOrSuperAdmin,
    create: isAdminOrSuperAdmin,
    update: isAdminOrSuperAdmin,
    delete: isAdminOrSuperAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'text',
      required: true,
      unique: true,
      label: 'Role Name',
    },
    {
      name: 'resources',
      type: 'array',
      label: 'Resources',
      admin: {
        components: {
          Field: PermissionsMatrix as any,
        },
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Collection Slug',
        },
        {
          name: 'actions',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Create', value: 'create' },
            { label: 'Read', value: 'read' },
            { label: 'Update', value: 'update' },
            { label: 'Delete', value: 'delete' },
          ],
          required: true,
          label: 'Allowed Actions',
        },
      ],
    },
  ],
}
