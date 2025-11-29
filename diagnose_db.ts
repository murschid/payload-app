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
    console.log('Connected to database.')

    // Check if users table exists
    const tableRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users';
    `)

    if (tableRes.rows.length === 0) {
      console.log('ERROR: "users" table does not exist in public schema.')
    } else {
      console.log('"users" table exists.')

      // Check columns and types
      const columnsRes = await client.query(`
        SELECT column_name, data_type, udt_name
        FROM information_schema.columns 
        WHERE table_name = 'users';
      `)
      
      console.log('Columns:', columnsRes.rows.map(r => `${r.column_name} (${r.data_type}/${r.udt_name})`).join(', '))

      // Check row count
      const countRes = await client.query('SELECT COUNT(*) FROM users;')
      console.log('Row count:', countRes.rows[0].count)

      // Show all rows
      const rowsRes = await client.query('SELECT * FROM users;')
      console.log('Rows:', JSON.stringify(rowsRes.rows, null, 2))
    }

  } catch (err) {
    console.error('Database error:', err)
  } finally {
    await client.end()
  }
}

run()
