import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ZONE_FILE_PATH = '/etc/bind/zones';

// Route handler to list all DNS zones
export async function GET() {
  const zones = fs.readdirSync(ZONE_FILE_PATH)
    .filter(file => file.startsWith('db.'))
    .map(file => file.replace('db.', ''));

  return NextResponse.json({ zones }, { status: 200 });
}
