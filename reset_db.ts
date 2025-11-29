import { Client } from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const run = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URI,
  })

  try {
    await client.connect()
    
    console.log('Dropping all tables in public schema...')
    
    await client.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO public;
    `)
    
    console.log('Database reset successfully.')
    
  } catch (err) {
    console.error('Database error:', err)
  } finally {
    await client.end()
  }
}

run()
