"""Local-only static server with byte ranges for reliable video seeking."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import re


class VideoHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        self.byte_range = None
        path = Path(self.translate_path(self.path))
        if not path.is_file():
            return super().send_head()
        f = path.open('rb')
        size = path.stat().st_size
        header = self.headers.get('Range')
        start, end = 0, size - 1
        if header:
            match = re.fullmatch(r'bytes=(\d*)-(\d*)', header.strip())
            if not match or not any(match.groups()):
                f.close()
                self.send_error(416, 'Invalid byte range')
                return None
            first, last = match.groups()
            if first:
                start = int(first)
                end = min(int(last), size - 1) if last else size - 1
            else:
                start = max(0, size - int(last))
            if start > end or start >= size:
                f.close()
                self.send_response(416)
                self.send_header('Content-Range', f'bytes */{size}')
                self.send_header('Content-Length', '0')
                self.end_headers()
                return None
            self.byte_range = (start, end)
        self.send_response(206 if self.byte_range else 200)
        self.send_header('Content-Type', self.guess_type(str(path)))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Length', str(end - start + 1))
        self.send_header('Last-Modified', self.date_time_string(path.stat().st_mtime))
        if self.byte_range:
            self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.end_headers()
        return f

    def copyfile(self, source, outputfile):
        if not self.byte_range:
            return super().copyfile(source, outputfile)
        start, end = self.byte_range
        source.seek(start)
        remaining = end - start + 1
        while remaining:
            chunk = source.read(min(65536, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)


if __name__ == '__main__':
    from functools import partial
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8765)
    args = parser.parse_args()
    handler = partial(VideoHandler, directory=str(Path(__file__).resolve().parent / 'dist'))
    print(f'Open http://localhost:{args.port} in your browser. Close this window to stop.', flush=True)
    ThreadingHTTPServer(('127.0.0.1', args.port), handler).serve_forever()
