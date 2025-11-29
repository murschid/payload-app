import type { GlobalConfig } from 'payload'

export const Global: GlobalConfig = {
  slug: 'global',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'defaultSeo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
        {
          name: 'shareImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
