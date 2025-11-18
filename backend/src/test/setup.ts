import { vi } from 'vitest'

// Mock database
vi.mock('../db/index.js', () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn(),
  },
  query: vi.fn(),
  transaction: vi.fn(),
}))

// Set test environment
process.env.NODE_ENV = 'test'
process.env.PORT = '3001'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.REDIS_URL = 'redis://localhost:6379'
process.env.CORS_ORIGIN = 'http://localhost:5173'
