
$TTL 604800
@ IN SOA ns1.xyz.com. admin.xyz.com. (
        2023101701 ; Serial
        604800 ; Refresh
        86400 ; Retry
        2419200 ; Expire
        604800 ) ; Negative Cache TTL
;
@ IN NS ns1.xyz.com.
ns1 IN A 127.0.0.1
@ IN A 127.0.0.1
