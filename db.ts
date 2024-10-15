import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
});

try {
  pool.query('SELECT NOW()').then(() => {
    console.log('Connected to database successfully!');
  }).catch((err:any) => {
    console.error('Error connecting to database:', err);
    // Handle connection error (e.g., stop app or retry)
  });
} catch (error) {
  console.error('Error creating database pool:', error);
  // Handle pool creation error (e.g., stop app)
}

export default pool;