// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { About } from './globals/About'
import { Global } from './globals/Global'
import { Activity } from './collections/Activity'
import { ChatMessage } from './collections/ChatMessage'
import { Conversation } from './collections/Conversation'
import { Event } from './collections/Event'
import { EventChat } from './collections/EventChat'
import { Notification } from './collections/Notification'
import { Permissions } from './collections/Permissions'
import { Transaction } from './collections/Transaction'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Activity, Conversation, ChatMessage, Event, EventChat, Notification, Permissions, Transaction],
  globals: [About, Global],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    idType: 'uuid',
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})
