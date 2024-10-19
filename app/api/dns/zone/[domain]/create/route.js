import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const ZONE_FILE_PATH = '/etc/bind/zones';

// Helper function to reload Bind9
const reloadBind9 = () => {
  exec('rndc reload', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error reloading Bind9: ${error.message}`);
    }
    if (stderr) {
      console.error(`Bind9 stderr: ${stderr}`);
    }
    console.log(`Bind9 stdout: ${stdout}`);
  });
};

// Route handler to create a record in a DNS zone
export async function GET(request, { params }) {
  const { domain } = params;
  const { searchParams } = new URL(request.url);
  const host = searchParams.get('host');
  const type = searchParams.get('type');
  const destination = searchParams.get('destination');

  if (!host || !type || !destination) {
    return NextResponse.json({ error: 'Missing host, type, or destination' }, { status: 400 });
  }

  const zoneFile = path.join(ZONE_FILE_PATH, `db.${domain}`);

  if (!fs.existsSync(zoneFile)) {
    return NextResponse.json({ error: 'Zone file not found' }, { status: 404 });
  }

  const record = `${host} IN ${type} ${destination}\n`;

  fs.appendFileSync(zoneFile, record);
  
  // Call reloadBind9 to reload the DNS service
  reloadBind9();

  return NextResponse.json({ message: `Record ${host} ${type} ${destination} added to ${domain}` }, { status: 201 });
}
