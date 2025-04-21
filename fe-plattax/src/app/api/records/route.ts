import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const client = await pool.connect();
    
    const query = `
      SELECT 
        k.plat_nomor AS plate, 
        k.nama_pemilik AS owner, 
        k.tanggal_pajak_berlakutahunan AS taxDate, 
        t.nilai_tagihan AS violation
      FROM deteksi_record d
      LEFT JOIN kendaraan k ON d.plat_nomor = k.plat_nomor
      LEFT JOIN tagihan_pajak t ON d.plat_nomor = t.plat_nomor
    `;

    const res = await client.query(query);
    client.release();
    
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error('DB error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
