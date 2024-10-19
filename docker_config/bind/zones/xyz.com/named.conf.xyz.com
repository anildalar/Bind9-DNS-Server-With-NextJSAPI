
zone "xyz.com" {
    type master;
    file "/etc/bind/zones/xyz.com/db.xyz.com";
};
