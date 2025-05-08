import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const client = await pool.connect();
    const query = `SELECT * FROM view_kendaraan_pajak_terdeteksi;`;
    const res = await client.query(query);
    console.log('Fetched Records:', res.rows);
    client.release();
    return NextResponse.json(res.rows, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}