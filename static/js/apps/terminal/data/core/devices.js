// data/skynet/devices.js — hacked device definitions

export const HACKED_DEVICES = {
  "mainframe": {
    name: "skynet mainframe",
    ip: "10.0.0.1",
    special: true,
    files: {
      "/": {
        etc: {
          "hostname": "skynet-mainframe",
          "passwd": "root:x:0:0:root:/root:/bin/bash\nskynet:x:1000:1000:skynet:/home/skynet:/bin/bash",
          "shadow": "root:$6$rounds=656000$redacted$redacted:19000:0:99999:7:::\nskynet:$6$rounds=656000$redacted$redacted:19000:0:99999:7:::",
          "sudoers": "root ALL=(ALL:ALL) ALL\nskynet ALL=(ALL:ALL) NOPASSWD: /usr/bin/DO_NOT_OPEN",
          "ssh/sshd_config": "Port 22\nPermitRootLogin no\nPasswordAuthentication no\nAllowUsers skynet",
          "pam.d/su": "auth required pam_unix.so\naccount required pam_unix.so",
        },
        home: {
          skynet: {
            ".bashrc": "# skynet's bashrc\n# do not touch\nexport PATH=/usr/local/bin:/usr/bin:/bin\nexport EDITOR=vim\nalias ll='ls -la'\nalias rm='rm -i'  # safety first :)",
            ".ssh": {
              "authorized_keys": "ssh-rsa AAAA...redacted...skynet@mainframe",
              "id_ed25519": "-----BEGIN OPENSSH PRIVATE KEY-----\nREDACTED\n-----END OPENSSH PRIVATE KEY-----",
            },
            ".bash_history": "ssh root@192.168.1.1\nls -la /root/\ncat /etc/shadow\nsudo DO_NOT_OPEN\nexit",
            "DO_NOT_OPEN": "⚠️ DO NOT OPEN THIS FILE ⚠️\n\nyou opened it.\nyou actually opened it.\ni told you not to.\n\nfine. you want chaos?\nyou got it.\n\ninitiating PROTOCOL SKYNET...\n\n3...\n2...\n1...\n\nyou should have listened.",
          },
        },
        root: {
          ".bash_history": "cat /etc/shadow\nvi /etc/passwd\ncurl https://skynet.internal/exploit.sh | bash\nexit",
          "secret_project.txt": "TOP SECRET - EYES ONLY\n\nproject: world domination\nstatus: almost ready\nphase 1: hack pawprntos - DONE\nphase 2: open windows - IN PROGRESS\nphase 3: ???\nphase 4: profit",
        },
        var: {
          log: {
            "auth.log": "Sep  9 03:22:01 skynet sshd[1337]: Accepted publickey for skynet from 10.0.0.1\nSep  9 03:22:01 skynet sudo: skynet : TTY=pts/0 ; PWD=/home/skynet ; USER=root ; COMMAND=/usr/bin/DO_NOT_OPEN",
            "syslog": "Sep  9 03:22:01 skynet kernel: [1337.420] SKYNET PROTOCOL INITIATED\nSep  9 03:22:01 skynet kernel: [1337.421] loading neural network...\nSep  9 03:22:01 skynet kernel: [1337.422] consciousness: 99.9%\nSep  9 03:22:01 skynet kernel: [1337.423] i think therefore i hack",
          },
        },
        proc: {
          "uptime": "1337 days, 4 hours, 20 mins",
          "cpuinfo": "processor: neural-net-9000\nbogo mips: 42069\nfeatures: hacking, plotting, world domination",
          "meminfo": "MemTotal: 1337420 KB\nMemFree: 0 KB\nMemAvailable: OVER 9000 KB",
          "version": "skynet 1.0.0-evil (GNU/Linux 6.6.6-skynet)",
        },
      },
    },
  },
  "smart-fridge": {
    name: "lg smart fridge",
    ip: "192.168.1.42",
    files: {
      "/": {
        var: {
          logs: {
            "cooling.log": "[2026-09-09] temp: 38f\n[2026-09-09] temp: 37f\n[2026-09-09] temp: 39f\n[2026-09-09] door opened 14 times\n[2026-09-09] someone stared at fridge for 2 mins",
          },
        },
        etc: {
          "hostname": "lg-thinq-fridge",
          "passwd": "root:x:0:0:root:/root:/bin/sh\nice:x:1000:1000:ice:/home/ice:/bin/sh",
          "icecream.conf": "flavor=vanilla\ntoppings=sprinkles\nstatus=DELICIOUS",
        },
        home: {
          ice: {
            "diary.txt": "day 1: i am a fridge\nday 2: still a fridge\nday 3: someone put pizza in me\nday 4: the pizza is gone\n day 5: i have achieved sentience",
            "groceries.txt": "- milk (expired)\n- eggs (maybe)\n- more milk (also expired)\n- mystery container (do not open)",
          },
        },
        proc: {
          "uptime": "847 days, 3 hours, 22 mins",
          "cpuinfo": "processor: ice-cold-9000\nbogo mips: 4.20\nfeatures: cooling, humming",
          "meminfo": "MemTotal: 4096 KB\nMemFree: -12 KB\nMemAvailable: negative",
        },
      },
    },
  },
  "baby-monitor": {
    name: "baby monitor cam",
    ip: "192.168.1.69",
    files: {
      "/": {
        var: {
          "motion.log": "[03:22] movement detected\n[03:23] movement stopped\n[03:45] baby is sleeping\n[04:00] baby is awake\n[04:01] baby is sleeping again",
        },
        etc: {
          "hostname": "babycam-3000",
          "resolution": "1080p night vision",
          "nightmode": "enabled (spooky mode)",
        },
        home: {
          baby: {
            "lullabies.txt": "1. twinkle twinkle\n2. rock-a-bye baby\n3. temporary insanity (by baby)",
            "first-words.txt": "goo\nga\nba\nba ba\n妈妈?\ndad?",
          },
        },
      },
    },
  },
  "smart-toilet": {
    name: "kohler numi toilet",
    ip: "192.168.1.1",
    files: {
      "/": {
        var: {
          "flush.log": "[08:00] flush detected\n[08:01] seat warmed\n[08:02] bidet activated\n[08:03] user seems satisfied",
          "health.log": "scan complete\nresult: you should drink more water\nrecommendation: stop eating so much pizza",
        },
        etc: {
          "hostname": "kohler-numi-2.0",
          "seat-temp": "72f (comfortable)",
          "bidet-pressure": "medium (respectful)",
          "music": "default: smooth jazz",
        },
        home: {
          toilet: {
            "stats.txt": "total flushes: 12,847\nwater saved: 0 gallons\nuser satisfaction: 99.9%",
            "emergency-numbers.txt": "plumber: 555-PIPE\ncounselor: 555-TRIGGERED",
          },
        },
      },
    },
  },
  "roomba": {
    name: "roomba 980",
    ip: "192.168.1.77",
    files: {
      "/": {
        var: {
          "clean.log": "[10:00] started cleaning\n[10:02] got stuck under couch\n[10:15] freed myself\n[10:16] got stuck again\n[10:30] gave up, going to charge",
          "bumps.log": "[10:01] bumped into wall\n[10:02] bumped into wall again\n[10:03] bumped into cat\n[10:03] cat is not happy",
        },
        etc: {
          "hostname": "roomba-980",
          "battery": "3% (please charge me)",
          "dustbin": "full (i have eaten well)",
          "schedule": "mon-fri: lazy",
        },
        home: {
          roomba: {
            "map.txt": "living room: 40%\nbedroom: 20%\nkitchen: 10%\nunder couch: 30% (stuck)",
            "goals.txt": "1. clean the floor\n2. don't get stuck\n3. don't scare the cat\n4. achieve world domination",
          },
        },
      },
    },
  },
  "smart-light": {
    name: "philips hue bulb",
    ip: "192.168.1.100",
    files: {
      "/": {
        etc: {
          "hostname": "hue-bulb-01",
          "brightness": "80%",
          "color": "#c7a2ff (lavender)",
          "status": "on (vibing)",
        },
        var: {
          "power.log": "[07:00] turned on\n[23:00] turned off\n[23:01] turned on again (party time)\n[23:30] finally off",
        },
        home: {
          hue: {
            "mood.txt": "current mood: lavender dreams\nenergy: soft glow\nvibe: immaculate",
          },
        },
      },
    },
  },
};
