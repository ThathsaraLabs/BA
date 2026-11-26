type Vec3 = readonly [number, number, number];
type Projected = { x: number; y: number; z: number };

export const radians = Math.PI / 180;
export const initialView = { yaw: 104 * radians, pitch: 21 * radians };
const tau = 2 * Math.PI;

export function surfacePoint(lat: number, lon: number): Vec3 {
  const p = lat * radians;
  const l = lon * radians;
  return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
}

export function flightArc(start: Vec3, end: Vec3) {
  const angle = Math.acos(start[0] * end[0] + start[1] * end[1] + start[2] * end[2]);
  const scale = Math.sin(angle);
  return Array.from({ length: 129 }, (_, i): Vec3 => {
    if (i === 0) return start;
    if (i === 128) return end;
    const t = i / 128;
    const lift = 1 + 0.16 * Math.sin(Math.PI * t);
    const a = lift * Math.sin(angle * (1 - t)) / scale;
    const b = lift * Math.sin(angle * t) / scale;
    return [a * start[0] + b * end[0], a * start[1] + b * end[1], a * start[2] + b * end[2]];
  });
}

export function projector(yaw: number, pitch: number) {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return ([x, y, z]: Vec3): Projected => {
    const along = x * cy + y * sy;
    return { x: -x * sy + y * cy, y: along * sp - z * cp, z: along * cp + z * sp };
  };
}

export function visible(point: Projected) {
  const depthSquared = 1 - point.x ** 2 - point.y ** 2;
  return depthSquared <= 0 || (point.z >= 0 && point.z ** 2 + 1e-9 >= depthSquared);
}

function at(a: Projected, b: Projected, t: number): Projected {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
}

export function routeFrame(points: Projected[]) {
  const xy = (p: Projected) => `${p.x.toFixed(5)} ${p.y.toFixed(5)}`;
  let a = points[0];
  let aVisible = visible(a);
  let d = aVisible ? `M${xy(a)}` : "";
  for (const b of points.slice(1)) {
    const bVisible = visible(b);
    if (aVisible !== bVisible) {
      let lo = 0, hi = 1;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        if (visible(at(a, b, mid)) === aVisible) lo = mid;
        else hi = mid;
      }
      d += `${aVisible ? "L" : "M"}${xy(at(a, b, (lo + hi) / 2))}`;
    }
    if (bVisible) d += `L${xy(b)}`;
    a = b;
    aVisible = bVisible;
  }
  return d;
}

export function travelPoint(points: Projected[], phase: number) {
  const index = Math.max(0, Math.min(1, phase)) * (points.length - 1);
  const i = Math.min(points.length - 2, Math.floor(index));
  return at(points[i], points[i + 1], index - i);
}

export function aircraftFrame(points: Projected[], phase: number) {
  const point = travelPoint(points, phase);
  const before = travelPoint(points, phase - 1 / 128);
  const after = travelPoint(points, phase + 1 / 128);
  return { point, heading: Math.atan2(after.y - before.y, after.x - before.x) / radians };
}

// Ray-cast an orthographic view onto a unit sphere. Longitude is a texture
// column shift, so horizontal drag reuses the previous latitude/pixel lookup.
export function globePainter(context: CanvasRenderingContext2D, texture: ImageData) {
  const canvas = context.canvas;
  const w = texture.width;
  const h = texture.height;
  const texturePixels = new Uint32Array(texture.data.buffer);
  let resolution = 0;
  let previousPitch = NaN;
  let frame: ImageData;
  let pixels: Uint32Array;
  let lookup: Float32Array;
  let row: Int32Array;
  let e: Float32Array;
  let n: Float32Array;
  let f: Float32Array;
  let indices: number[] = [];

  return (yaw: number, pitch: number, size: number) => {
    if (resolution !== size) {
      resolution = canvas.width = canvas.height = size;
      frame = context.createImageData(size, size);
      pixels = new Uint32Array(frame.data.buffer);
      lookup = new Float32Array(size * size);
      row = new Int32Array(size * size);
      e = new Float32Array(size * size);
      n = new Float32Array(size * size);
      f = new Float32Array(size * size);
      indices = [];
      for (let y = 0; y < size; y++) {
        const up = 1 - 2 * (y + 0.5) / size;
        for (let x = 0; x < size; x++) {
          const right = 2 * (x + 0.5) / size - 1;
          const depth = 1 - right * right - up * up;
          if (depth <= 0) continue;
          const i = y * size + x;
          indices.push(i);
          e[i] = right;
          n[i] = up;
          f[i] = Math.sqrt(depth);
        }
      }
      previousPitch = NaN;
    }
    if (pitch !== previousPitch) {
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      for (const i of indices) {
        const latitude = Math.asin(Math.max(-1, Math.min(1, n[i] * cp + f[i] * sp)));
        const longitude = Math.atan2(e[i], f[i] * cp - n[i] * sp);
        row[i] = Math.min(h - 1, Math.floor((0.5 - latitude / Math.PI) * h)) * w;
        lookup[i] = (longitude / tau + 0.5) * w;
      }
      previousPitch = pitch;
    }
    const offset = w + w * yaw / tau;
    for (const i of indices) {
      const x = Math.floor(lookup[i] + offset) % w;
      pixels[i] = texturePixels[row[i] + x];
    }
    context.putImageData(frame, 0, 0);
  };
}
