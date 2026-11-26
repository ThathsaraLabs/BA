import { writeFile } from "node:fs/promises";
import sharp from "sharp";

// NASA Earth Observatory Blue Marble, July 2004, global equirectangular texture.
const source = "https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography-bathymetry/july/world.topo.bathy.200407.3x5400x2700.jpg";
const width = 1440;
const height = 800;
const cx = 720;
const cy = 405;
const radius = 570;
const rad = Math.PI / 180;
const centerLat = 21 * rad;
const centerLon = 104 * rad;
const east = [-Math.sin(centerLon), Math.cos(centerLon), 0];
const north = [-Math.sin(centerLat) * Math.cos(centerLon), -Math.sin(centerLat) * Math.sin(centerLon), Math.cos(centerLat)];
const forward = [Math.cos(centerLat) * Math.cos(centerLon), Math.cos(centerLat) * Math.sin(centerLon), Math.sin(centerLat)];
const dot = (a, b) => a.reduce((sum, n, i) => sum + n * b[i], 0);
const vector = (lat, lon) => [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];
const project = (point) => ({
  x: +(cx + radius * dot(point, east)).toFixed(3),
  y: +(cy - radius * dot(point, north)).toFixed(3),
});

// GeoNames city centers, rather than airport or province coordinates.
const cities = [
  { id: "origin", name: "Colombo", detail: "Sri Lanka · Origin", lat: 6.93548, lon: 79.84868 },
  { id: "destination", name: "Daegu", detail: "South Korea · Host City", lat: 35.87102, lon: 128.60121 },
];
const positions = cities.map(({ lat, lon }) => vector(lat * rad, lon * rad));
const markers = cities.map((city, i) => ({ ...city, ...project(positions[i]) }));
const angle = Math.acos(dot(positions[0], positions[1]));
const distanceKm = Math.round(angle * 6371 / 10) * 10;
const route = Array.from({ length: 49 }, (_, i) => {
  const t = i / 48;
  const a = Math.sin((1 - t) * angle) / Math.sin(angle);
  const b = Math.sin(t * angle) / Math.sin(angle);
  const point = project(positions[0].map((n, k) => a * n + b * positions[1][k]));
  // A slight visual lift makes the connection legible without moving either pin.
  const y = (point.y - 48 * Math.sin(Math.PI * t)).toFixed(3);
  return `${i ? "L" : "M"}${point.x} ${y}`;
}).join(" ");

const response = await fetch(source, { signal: AbortSignal.timeout(25000) });
if (!response.ok) throw new Error(`NASA texture download failed: ${response.status}`);
const original = Buffer.from(await response.arrayBuffer());
await sharp(original).resize(2700, 1350).webp({ quality: 86 })
  .toFile("public/images/blue-marble-world.webp");
const { data: texture, info } = await sharp(original)
  .removeAlpha().toColourspace("srgb").raw().toBuffer({ resolveWithObject: true });
if (info.width !== 5400 || info.height !== 2700) throw new Error("Unexpected NASA texture geometry");

const raster = Buffer.alloc(width * height * 3);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const e = (x + 0.5 - cx) / radius;
    const n = (cy - y - 0.5) / radius;
    const distance = Math.hypot(e, n);
    const i = (y * width + x) * 3;
    if (distance >= 1) {
      const glow = Math.exp((1 - distance) * 75);
      raster[i] = 4 + 6 * glow;
      raster[i + 1] = 8 + 30 * glow;
      raster[i + 2] = 19 + 70 * glow;
      continue;
    }

    // Inverse of project(): sample the very same surface the pins are on.
    const f = Math.sqrt(1 - e * e - n * n);
    const [vx, vy, vz] = forward.map((v, k) => f * v + e * east[k] + n * north[k]);
    const u = (Math.atan2(vy, vx) / (2 * Math.PI) + 0.5) * info.width - 0.5;
    const v = (0.5 - Math.asin(Math.max(-1, Math.min(1, vz))) / Math.PI) * info.height - 0.5;
    const tx = Math.floor(u);
    const ty = Math.floor(v);
    const fx = u - tx;
    const fy = v - ty;
    const pixel = (a, b) => (Math.max(0, Math.min(info.height - 1, b)) * info.width + (a + info.width) % info.width) * 3;
    const i00 = pixel(tx, ty), i10 = pixel(tx + 1, ty);
    const i01 = pixel(tx, ty + 1), i11 = pixel(tx + 1, ty + 1);
    const light = 0.54 + 0.52 * Math.max(0, 0.84 * f + 0.40 * n - 0.34 * e);
    const rim = 0.8 * (1 - f) ** 3;
    for (let channel = 0; channel < 3; channel++) {
      const sample = (texture[i00 + channel] * (1 - fx) + texture[i10 + channel] * fx) * (1 - fy)
        + (texture[i01 + channel] * (1 - fx) + texture[i11 + channel] * fx) * fy;
      raster[i + channel] = Math.min(255, sample * light + rim * [28, 112, 228][channel]);
    }
  }
}

const globe = sharp(raster, { raw: { width, height, channels: 3 } });
await globe.clone().webp({ quality: 90 }).toFile("public/images/asia-globe-blue-marble.webp");
await writeFile("app/asia-globe.json", JSON.stringify({ width, height, markers, route, distanceKm }, null, 2) + "\n");

// Optional pins-only proof for checking the location before adding the route.
if (process.argv[2]) {
  const pinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    ${markers.map(({ x, y, name }) => `<circle cx="${x}" cy="${y}" r="10" fill="none" stroke="#ff3549" stroke-width="2"/>
      <circle cx="${x}" cy="${y}" r="3" fill="white"/>
      <text x="${x + 17}" y="${y + 5}" paint-order="stroke" stroke="#030713" stroke-width="5" fill="white"
        font-family="Arial" font-weight="700" font-size="21">${name}</text>`).join("")}
  </svg>`;
  await globe.composite([{ input: Buffer.from(pinSvg) }]).png().toFile(process.argv[2]);
}
console.table(markers);
