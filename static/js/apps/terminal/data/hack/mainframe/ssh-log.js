// data/hack/mainframe/ssh-log.js — ssh auth log window lines

export const SSH_LOG_LINES = [
  "Sep  9 03:22:01 pawprntos sshd[2048]: Accepted password for root from 10.0.0.1 port 4444 ssh2",
  "Sep  9 03:22:01 pawprntos sshd[2048]: pam_unix(sshd:session): session opened for user root by (uid=0)",
  "Sep  9 03:22:01 pawprntos kernel: [1337.001] audit: type=1400 audit(1725879321.123:456): avc:  denied  { transition } for  pid=2048 comm=\"sshd\" path=\"/bin/bash\" dev=\"sda1\" ino=1337420  scontext=system_u:system_r:sshd_t:s0 tcontext=unconfined_u:unconfined_r:unconfined_t:s0 tclass=process",
  "Sep  9 03:22:01 pawprntos sshd[2048]: Received disconnect from 10.0.0.1 port 4444:11: disconnected by user",
  "Sep  9 03:22:01 pawprntos sshd[2048]: Disconnected from user root 10.0.0.1 port 4444",
  "Sep  9 03:22:01 pawprntos sshd[2048]: pam_unix(sshd:session): session closed for user root",
  "Sep  9 03:22:02 pawprntos sshd[2049]: Accepted password for root from 10.0.0.1 port 4445 ssh2",
  "Sep  9 03:22:02 pawprntos sshd[2049]: pam_unix(sshd:session): session opened for user root by (uid=0)",
  "Sep  9 03:22:02 pawprntos kernel: [1337.002] reverse shell established: 10.0.0.1:4445 -> pawprntos:22",
  "Sep  9 03:22:02 pawprntos kernel: [1337.003] skynet module loaded, hooking syscalls",
  "Sep  9 03:22:02 pawprntos kernel: [1337.004] skynet: hiding process 2049 from ps/ls",
  "Sep  9 03:22:02 pawprntos kernel: [1337.005] skynet: persistence established via /etc/init.d/skynet",
];
