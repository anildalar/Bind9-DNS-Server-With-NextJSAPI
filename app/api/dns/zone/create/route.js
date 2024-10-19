import fs from 'fs';
import { exec } from 'child_process';

const ZONE_FILE_PATH = '/etc/bind/zones/';
const NAMED_LOCAL_CONF = '/etc/bind/named.conf.local';

// Function to reload Bind9 service
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

// API handler
export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain');
  const webserver_ip = searchParams.get('webserver_ip');

  if (!domain || !webserver_ip) {
    return new Response(JSON.stringify({ error: 'Missing domain or webserver_ip' }), { status: 400 });
  }

  const zoneDir = `${ZONE_FILE_PATH}${domain}/`;
  const zoneFile = `${zoneDir}db.${domain}`;
  const namedConfFile = `${zoneDir}named.conf.${domain}`;

  // Check if zone already exists
  if (fs.existsSync(zoneFile)) {
    return new Response(JSON.stringify({ error: 'Zone already exists' }), { status: 400 });
  }

  // Create directory for the domain
  fs.mkdirSync(zoneDir, { recursive: true });

  // Create the zone file
  const zoneContent = `
$TTL 604800
@ IN SOA ns1.${domain}. admin.${domain}. (
        2023101701 ; Serial
        604800 ; Refresh
        86400 ; Retry
        2419200 ; Expire
        604800 ) ; Negative Cache TTL
;
@ IN NS ns1.${domain}.
ns1 IN A ${webserver_ip}
@ IN A ${webserver_ip}
`;

  fs.writeFileSync(zoneFile, zoneContent);

  // Create the named.conf file for this domain
  const namedConfContent = `
zone "${domain}" {
    type master;
    file "/etc/bind/zones/${domain}/db.${domain}";
};
`;

  fs.writeFileSync(namedConfFile, namedConfContent);

  // Include this new named.conf in the main named.conf.local
  fs.appendFileSync(NAMED_LOCAL_CONF, `\ninclude "${namedConfFile}";\n`);

  // Reload Bind9
  reloadBind9();

  return new Response(JSON.stringify({ message: `Zone ${domain} created successfully` }), { status: 201 });
}
