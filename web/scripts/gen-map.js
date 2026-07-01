const fs = require("fs");

const IN = process.argv[2];
const OUT = process.argv[3];
const g = JSON.parse(fs.readFileSync(IN, "utf8"));

// Ramer–Douglas–Peucker simplification in lon/lat space.
function perpDist(p, a, b) {
  const [x, y] = p, [x1, y1] = a, [x2, y2] = b;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1e-9;
  return Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / len;
}
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  let dmax = 0, idx = 0;
  const a = pts[0], b = pts[pts.length - 1];
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], a, b);
    if (d > dmax) { dmax = d; idx = i; }
  }
  if (dmax > eps) {
    const l = rdp(pts.slice(0, idx + 1), eps);
    const r = rdp(pts.slice(idx), eps);
    return l.slice(0, -1).concat(r);
  }
  return [a, b];
}

const EPS = 0.015; // ~1.5 km — smooth but recognizable

// Collect all rings, compute bbox (exclude far-flung Caribbean dependencies
// so the mainland fills the frame; Dependencias Federales are tiny anyway).
const feats = g.features.filter(
  (f) => f.properties.shapeName !== "Dependencias Federales",
);

let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
for (const f of feats) {
  const polys =
    f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys)
    for (const [lon, lat] of poly[0]) {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
}

const W = 800;
const meanLat = (minLat + maxLat) / 2;
const kx = Math.cos((meanLat * Math.PI) / 180); // aspect correction
const lonSpan = (maxLon - minLon) * kx;
const latSpan = maxLat - minLat;
const H = Math.round((W * latSpan) / lonSpan);

function project(lon, lat) {
  const x = ((lon - minLon) * kx / lonSpan) * W;
  const y = H - ((lat - minLat) / latSpan) * H; // flip Y
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

function ringToPath(ring) {
  // Drop the closing duplicate: a closed ring has start === end, which makes
  // RDP degenerate (zero-length base segment). Simplify the open polyline,
  // then re-close with Z.
  let open = ring;
  const a = ring[0], z = ring[ring.length - 1];
  if (a[0] === z[0] && a[1] === z[1]) open = ring.slice(0, -1);
  const simp = rdp(open, EPS);
  if (simp.length < 3) return "";
  let d = "";
  simp.forEach(([lon, lat], i) => {
    const [x, y] = project(lon, lat);
    d += (i === 0 ? "M" : "L") + x + " " + y;
  });
  return d + "Z";
}

const paths = {};
for (const f of feats) {
  const name = f.properties.shapeName;
  const polys =
    f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  let d = "";
  for (const poly of polys) d += ringToPath(poly[0]); // outer ring only
  paths[name] = d;
}

const header = `// AUTO-GENERATED from public/data/venezuela-states.geojson (RDP eps=${EPS}).
// Do not hand-edit. Regenerate with scripts/gen-map.js if boundaries change.
// Simple equirectangular projection with cos(lat) aspect correction.
`;
const body =
  header +
  `export const MAP_VIEWBOX = "0 0 ${W} ${H}";\n\n` +
  `export const STATE_PATHS: Record<string, string> = ${JSON.stringify(paths, null, 0)};\n`;

fs.writeFileSync(OUT, body);
const size = fs.statSync(OUT).size;
console.log(`viewBox 0 0 ${W} ${H}; states=${Object.keys(paths).length}; out=${(size/1024).toFixed(1)}KB`);
