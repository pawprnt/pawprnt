# pawprntos

a browser-based os simulation with a terminal, file browser, wiki viewer, and more.

## apps

- **terminal** - modular shell with commands (help, neofetch, ls/cd/cat, hack, notify)
- **files** - file browser with admin panel
- **about** - discord status, music, lyrics, games, and socials
- **projects** - github repo viewer
- **wiki** - wiki viewer for project docs
- **settings** - theme, accent color, wallpaper, boot toggle, clock format, and motion

## features

- **hack mainframe** - 3-phase battle sequence (pawguard vs skynet), chaos windows with failed exploits, ssh auth log, skynet's 12 persistence mechanisms, kernel self-healing, pawguard anti-rootkit cleanup, and a skynet re-infection easter egg on first app open after hack
- **discord integration** - status display, presence, games (played + favorites), notifications via webhook
- **music** - last.fm now-playing, youtube music lyrics (synced + fancy), timestamps
- **virtual filesystem** - fake nixos structure with nested directories and files
- **window manager** - drag, minimize, maximize, close, focus stacking
- **easter eggs** - hack smart-fridge, baby-monitor, roomba, smart-toilet, smart-light, and mainframe

## project structure

```
static/
  css/
    core/       base, boot, taskbar, wm
    apps/       about, files, settings, terminal, wiki
  js/
    core/       boot, filesystem, helpers, main, settings, taskbar, wm
    apps/
      terminal/
        index.js          core shell (init, routing, input)
        sfx.js            glitch sound effects
        cmds/             help, neofetch, nav, hack, notify
        data/
          core/           devices
          hack/mainframe/ boot, chaos, shell, ssh-log, sys-alerts
      about/              index, lyrics
      files/              index, admin
      registry.js         app definitions
      settings/           index
      wiki/               index
```

## running

open `index.html` in a browser. no build step required.

## stack

- plain html, css, js (no frameworks, es modules)
- cloudflare pages (hosting)
- cloudflare worker (api proxy for discord, last.fm, youtube music lyrics)

## license

[CC BY-NC-SA 4.0](LICENSE)
