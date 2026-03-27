from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import hashlib
import mimetypes
import re

URLS = [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1517976547714-720226b864c1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1581093458791-9d15482442f6?auto=format&fit=crop&w=1200&q=80",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCyOjIab072l46SaGHablYPEZAu48OXAu95HSTBh0PGKdzaIZG9Lh5u9yzHcWkt0SK944QQ5uhYKt7M5DqgkQ1OoG9_OGvOYJQY1sC8HKxyY7OLv8lbZT0BRzwha9d9jQeeM27teBtr0lSNF3iO_uhgMzqoLbE4TnR_k7s2C98-l1luPQTE92tqV9pGF46BXa3Z_VwiLUuBFaLVAc_f8zLMoZaH7YSYyNG8GtAWURRYcWmQkUimBsKXpJCOb5iMP8mJIm9n2mlzkxo",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDHky4TW1pFeH2_awPPMuIqsfxjuG-7yGMeQeE2qY4sl5FdvRIOpBaNFtN7GhkqU4XIAwIdHWoJWAyz_OgttYQZeN0DwbJWKh00ATUuXay8MDez6_zQw7yoqkU5NjYbhxGYDdskhzndokbxOL_ehkdyZAu5enHhTL8bqm8hLANNV4nWm25G0qnhNY3iY-lvCkXmX-vlHIHFx8nO50cZSiUCC8EGRhCvc4ZXDb7gO4yRHsOP5rqDLxpOTOD8eN1h8fQ37H9VtRAiDK4",
    "https://tacklersc.sg-host.com/wp-content/uploads/2026/02/Audrey-Nyamande-1.jpeg",
    "https://tacklersc.sg-host.com/wp-content/uploads/2026/02/Business-Process-Management.jpeg",
    "https://tacklersc.sg-host.com/wp-content/uploads/2026/02/Cost-Management.jpeg",
    "https://tacklersc.sg-host.com/wp-content/uploads/2026/02/Executive-Leadership-Coaching.jpeg",
    "https://tacklersc.sg-host.com/wp-content/uploads/2026/02/Lean-Training.jpeg",
    "https://tacklersc.sg-host.com/wp-content/uploads/2026/02/Lean-Transformation.jpeg",
    "https://tacklersc.sg-host.com/wp-content/uploads/2026/02/Lean-transformation-consulting-UK-consultant-working-with-team-at-Gemba-1.jpeg",
    "https://tacklersc.sg-host.com/wp-content/uploads/2026/02/Manufacturing-Support.jpeg",
    "https://tacklersc.sg-host.com/wp-content/uploads/2026/02/Productivity-Improvement.jpeg",
    "https://tacklersc.sg-host.com/wp-content/uploads/2026/02/Strategy-Deployment.jpeg",
    "https://tacklersc.sg-host.com/wp-content/uploads/2026/02/Supplier-Quality-Development.jpeg",
    "https://tacklersc.sg-host.com/wp-content/uploads/2026/02/audrey-and-arlandous-1-e1773762025172.jpeg",
]

out = Path("public/media")
out.mkdir(parents=True, exist_ok=True)
manifest = []
failed = []

for url in URLS:
    parsed = urlparse(url)
    name = Path(parsed.path).name
    if not name or "." not in name:
        stem = re.sub(r"[^a-zA-Z0-9_-]+", "-", parsed.path.strip("/"))[:60] or "image"
        name = f"{stem}.jpg"
    stem = Path(name).stem
    ext = Path(name).suffix.lower() or ".jpg"
    digest = hashlib.md5(url.encode()).hexdigest()[:8]
    filename = f"{stem}-{digest}{ext}"
    dest = out / filename

    try:
        if not dest.exists():
            req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urlopen(req, timeout=60) as resp:
                data = resp.read()
                ctype = resp.headers.get_content_type()
            if ext in {"", ".bin"}:
                guessed = mimetypes.guess_extension(ctype or "") or ".jpg"
                dest = dest.with_suffix(guessed)
                filename = dest.name
            dest.write_bytes(data)
    except (HTTPError, URLError, TimeoutError) as exc:
        failed.append((url, str(exc)))
        continue

    manifest.append((url, f"/media/{filename}"))

(Path("public/media/manifest.tsv")).write_text(
    "\n".join(f"{u}\t{p}" for u, p in manifest) + "\n"
)

print(f"downloaded={len(manifest)}")
if failed:
    print("failed=")
    for url, error in failed:
        print(f"{url}\t{error}")
