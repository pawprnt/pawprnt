// cmds/notify.js — discord webhook notification command

export function execNotify(args, out) {
  const msg = args.join(" ").replace(/[<>"'&]/g, "");
  if (!msg) {
    out.add("notify: missing message", "c-red");
    return;
  }
  out.add("sending notification...", "c-dim");
  notifyWorker(msg).then(() => {
    out.add("notification sent", "c-green");
  }).catch(() => {
    out.add("failed to send notification", "c-red");
  });
}
