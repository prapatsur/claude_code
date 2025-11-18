import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { pool } from './index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function migrate() {
  try {
    console.log('🔄 Running database migrations...')

    // Read and execute schema.sql
    const schemaPath = join(__dirname, 'schema.sql')
    const schemaSql = readFileSync(schemaPath, 'utf-8')

    await pool.query(schemaSql)

    console.log('✅ Database migrations completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()
