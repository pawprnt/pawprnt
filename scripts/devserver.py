#!/usr/bin/env python3
import http.server
import os
import socketserver
import sys
import threading
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080

clients = set()
clients_lock = threading.Lock()


def notify():
    with clients_lock:
        for c in list(clients):
            try:
                c.wfile.write(b"data: reload\n\n")
                c.wfile.flush()
            except Exception:
                clients.discard(c)


def watch():
    prev = {}
    while True:
        time.sleep(0.5)
        current = {}
        for root, dirs, files in os.walk(ROOT):
            dirs[:] = [d for d in dirs if not d.startswith(".") and d != "__pycache__"]
            for f in files:
                p = os.path.join(root, f)
                try:
                    current[p] = os.path.getmtime(p)
                except OSError:
                    pass
        changed = any(current.get(p) != prev.get(p) for p in set(current) | set(prev))
        prev = current
        if changed and prev:
            print("[dev] files changed, reloading clients")
            notify()


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def log_message(self, fmt, *args):
        print(f"[dev] {self.client_address[0]} {fmt % args}")

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        if self.path == "/__reload":
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.end_headers()
            with clients_lock:
                clients.add(self)
            try:
                while True:
                    self.wfile.write(b": keepalive\n\n")
                    self.wfile.flush()
                    time.sleep(15)
            except Exception:
                pass
            finally:
                with clients_lock:
                    clients.discard(self)
            return

        path = self.translate_path(self.path)
        if os.path.isfile(path) and path.endswith((".html", ".htm")):
            with open(path, "rb") as f:
                body = f.read()
            snippet = (
                b'<script>const es=new EventSource("/__reload");'
                b'es.onmessage=()=>location.reload();</script>'
            )
            if b"</body>" in body:
                body = body.replace(b"</body>", snippet + b"</body>")
            else:
                body += snippet
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        super().do_GET()


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True


def main():
    sys.stdout.reconfigure(line_buffering=True)
    threading.Thread(target=watch, daemon=True).start()
    with Server(("127.0.0.1", PORT), Handler) as httpd:
        print(f"pawprntos dev server: http://localhost:{PORT}/")
        print("serves fresh files + auto-reloads on save. ctrl-c to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
