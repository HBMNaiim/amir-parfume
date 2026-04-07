"""Custom HTTP server that correctly serves .js files as application/javascript,
fixing the Windows registry MIME type bug that causes browsers to block JS execution."""
import http.server
import socketserver

class CorrectMIMEHandler(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.css'):
            return 'text/css'
        if path.endswith('.html'):
            return 'text/html'
        return super().guess_type(path)

    def log_message(self, format, *args):
        pass  # Suppress log noise

PORT = 8080
with socketserver.TCPServer(("", PORT), CorrectMIMEHandler) as httpd:
    print(f"Serving at http://localhost:{PORT}", flush=True)
    httpd.serve_forever()
