"use client";

import { sitePath } from "./site-path";
import { useEffect, useRef, useState } from "react";
import asiaGlobe from "./asia-globe.json";
import { aircraftFrame, flightArc, globePainter, initialView, projector, radians, routeFrame, surfacePoint, visible } from "./globe-renderer";

const cities = asiaGlobe.markers.map((city) => ({ ...city, point: surfacePoint(city.lat, city.lon) }));
const arc = flightArc(cities[0].point, cities[1].point);
const [origin, destination] = cities;
const deltaLat = (destination.lat - origin.lat) * radians;
const deltaLon = (destination.lon - origin.lon) * radians;
const haversine = Math.sin(deltaLat / 2) ** 2
  + Math.cos(origin.lat * radians) * Math.cos(destination.lat * radians) * Math.sin(deltaLon / 2) ** 2;
const routeDistanceKm = Math.round(6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)));

export default function InteractiveGlobe() {
  const stage = useRef<HTMLDivElement>(null);
  const sphere = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const path = useRef<SVGPathElement>(null);
  const traveller = useRef<SVGGElement>(null);
  const markers = useRef<(HTMLDivElement | null)[]>([]);
  const distanceLabel = useRef<HTMLDivElement>(null);
  const reset = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [distance, setDistance] = useState(routeDistanceKm);

  useEffect(() => {
    const element = stage.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 2200, 1);
        setDistance(Math.round(routeDistanceKm * (1 - (1 - progress) ** 3)));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: .25 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const card = stage.current;
    const target = sphere.current;
    const globe = canvas.current;
    const line = path.current;
    const pulse = traveller.current;
    if (!card || !target || !globe || !line || !pulse) return;
    const context = globe.getContext("2d");
    if (!context) {
      setStatus("unavailable");
      return;
    }

    let { yaw, pitch } = initialView;
    let pointer: { id: number; x: number; y: number } | undefined;
    let width = target.clientWidth;
    let frame = 0;
    let dirty = true;
    let inView = false;
    let started = false;
    let disposed = false;
    let paint: ReturnType<typeof globePainter> | undefined;
    let route: ReturnType<ReturnType<typeof projector>>[];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(pointer: coarse), (max-width: 600px)");
    const image = new Image();
    image.decoding = "async";

    const queue = () => {
      if (!frame && paint && inView) frame = requestAnimationFrame(draw);
    };

    const draw = (time: number) => {
      frame = 0;
      if (!paint || !inView) return;
      if (dirty) {
        const project = projector(yaw, pitch);
        // Bound the ray-cast cost on phones; restore detail after a drag ends.
        const cap = pointer ? (touch.matches ? 224 : 336) : (touch.matches ? 448 : 672);
        const resolution = Math.min(cap, Math.max(64, Math.ceil(width * Math.min(2, devicePixelRatio) / 32) * 32));
        paint(yaw, pitch, resolution);
        route = arc.map(project);
        line.setAttribute("d", routeFrame(route));
        const midpoint = route[Math.floor(route.length / 2)];
        if (distanceLabel.current) {
          distanceLabel.current.hidden = midpoint.z < 0;
          distanceLabel.current.style.left = `${(midpoint.x + 1) * 50}%`;
          distanceLabel.current.style.top = `${(midpoint.y + 1) * 50}%`;
        }
        for (let i = 0; i < cities.length; i++) {
          const marker = markers.current[i];
          if (!marker) continue;
          const position = project(cities[i].point);
          marker.hidden = position.z < 0;
          marker.style.left = `${(position.x + 1) * 50}%`;
          marker.style.top = `${(position.y + 1) * 50}%`;
        }
        dirty = false;
      }
      const phase = motion.matches ? 0.5 : (time % 6500) / 6500;
      const { point, heading } = aircraftFrame(route, phase);
      // Project the aircraft and its heading from the same rotated route as the pins.
      pulse.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${heading}) scale(${2 / Math.max(1, width)})`);
      pulse.style.visibility = visible(point) ? "visible" : "hidden";
      pulse.style.opacity = String(motion.matches ? 1 : Math.min(1, phase / 0.04, (1 - phase) / 0.04));
      if (!motion.matches) queue();
    };

    const changed = () => { dirty = true; queue(); };
    const rotate = (dx: number, dy: number) => {
      yaw = (yaw + dx) % (2 * Math.PI);
      pitch = Math.max(-89 * radians, Math.min(89 * radians, pitch + dy));
      changed();
    };
    const resetView = () => {
      ({ yaw, pitch } = initialView);
      changed();
    };
    reset.current = resetView;

    const startDrag = (event: PointerEvent) => {
      if (!paint || pointer || event.button !== 0) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      target.setPointerCapture(event.pointerId);
      target.dataset.dragging = "true";
    };
    const moveDrag = (event: PointerEvent) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const scale = 3.25 / Math.max(1, width);
      rotate((pointer.x - event.clientX) * scale, (event.clientY - pointer.y) * scale);
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const endDrag = (event: PointerEvent) => {
      if (pointer?.id !== event.pointerId) return;
      pointer = undefined;
      delete target.dataset.dragging;
      changed();
    };
    const key = (event: KeyboardEvent) => {
      if (!paint) return;
      const step = 9 * radians;
      switch (event.key) {
        case "ArrowLeft": rotate(-step, 0); break;
        case "ArrowRight": rotate(step, 0); break;
        case "ArrowUp": rotate(0, step); break;
        case "ArrowDown": rotate(0, -step); break;
        case "Home": resetView(); break;
        default: return;
      }
      event.preventDefault();
    };

    target.addEventListener("pointerdown", startDrag);
    target.addEventListener("pointermove", moveDrag);
    target.addEventListener("pointerup", endDrag);
    target.addEventListener("pointercancel", endDrag);
    target.addEventListener("lostpointercapture", endDrag);
    target.addEventListener("keydown", key);
    motion.addEventListener("change", changed);

    const sizes = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === width) return;
      width = entry.contentRect.width;
      changed();
    });
    sizes.observe(target);

    image.onload = () => {
      if (disposed) return;
      try {
        const source = document.createElement("canvas");
        source.width = Math.min(image.naturalWidth, touch.matches ? 1350 : 2700);
        source.height = Math.round(source.width * image.naturalHeight / image.naturalWidth);
        const read = source.getContext("2d", { willReadFrequently: true });
        if (!read) throw new Error("Canvas unavailable");
        read.drawImage(image, 0, 0, source.width, source.height);
        paint = globePainter(context, read.getImageData(0, 0, source.width, source.height));
        queue();
        setStatus("ready");
      } catch {
        setStatus("unavailable");
      }
    };
    image.onerror = () => { if (!disposed) setStatus("unavailable"); };

    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        if (!started) {
          started = true;
          image.src = sitePath("/images/blue-marble-world.webp");
        }
        queue();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { rootMargin: "120px" });
    visibility.observe(card);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      visibility.disconnect();
      sizes.disconnect();
      reset.current = null;
      image.onload = image.onerror = null;
      motion.removeEventListener("change", changed);
      target.removeEventListener("pointerdown", startDrag);
      target.removeEventListener("pointermove", moveDrag);
      target.removeEventListener("pointerup", endDrag);
      target.removeEventListener("pointercancel", endDrag);
      target.removeEventListener("lostpointercapture", endDrag);
      target.removeEventListener("keydown", key);
    };
  }, []);

  const ready = status === "ready";
  return (
    <div className="globe-stage" data-reveal ref={stage}>
      <div className="globe-overlay-info">
        <span className="globe-route-caption">Colombo <span>↗</span> Daegu</span>
        <p className="text-xs text-neutral-400 mt-1">Two countries. One shared ambition.</p>
      </div>
      <div className="globe-view" data-ready={ready}>
        {!ready && (
          <div className="globe-static">
            <img src={sitePath("/images/asia-globe-blue-marble.webp")} width={asiaGlobe.width} height={asiaGlobe.height} loading="lazy" alt="" />
            <svg className="globe-route-motion" viewBox={`0 0 ${asiaGlobe.width} ${asiaGlobe.height}`} aria-hidden="true">
              <path className="globe-route-base" d={asiaGlobe.route} />
            </svg>
            {cities.map(({ id, name, x, y }) => (
              <div key={id} className={`globe-city-label globe-city-label--${id}`} style={{ left: `${x / asiaGlobe.width * 100}%`, top: `${y / asiaGlobe.height * 100}%` }}>
                <i aria-hidden="true" /><span>{name}</span>
              </div>
            ))}
          </div>
        )}
        <div
          className="globe-sphere"
          ref={sphere}
          role="region"
          tabIndex={ready ? 0 : -1}
          aria-label="Interactive 3D Earth, Colombo to Daegu"
          aria-describedby="globe-controls"
          aria-hidden={!ready}
          data-lenis-prevent
        >
          <canvas ref={canvas} className="globe-map-canvas" aria-hidden="true" />
          <div ref={distanceLabel} className="globe-path-distance" aria-label={`Colombo to Daegu, approximately ${routeDistanceKm.toLocaleString("en-US")} kilometres great-circle distance`}>
            <strong aria-hidden="true">~{distance.toLocaleString("en-US")} <span>km</span></strong>
            <small>Colombo ↔ Daegu</small>
          </div>
          <svg className="globe-route-motion" viewBox="-1 -1 2 2" aria-hidden="true">
            <path className="globe-route-base" ref={path} />
            <g className="route-aircraft" ref={traveller}>
              <path d="M13 0 Q12 -2 8 -2 H2 L-5 -11 H-8 L-4 -2 H-9 L-12 -5 H-14 L-12 0 L-14 5 H-12 L-9 2 H-4 L-8 11 H-5 L2 2 H8 Q12 2 13 0Z" />
            </g>
          </svg>
          {cities.map(({ id, name }, i) => (
            <div key={id} ref={(el) => { markers.current[i] = el; }} className={`globe-city-label globe-city-label--${id}`} aria-hidden="true">
              <i /><span>{name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="globe-plinth" aria-hidden="true" />
      <div className="globe-hint-pill">
        <span id="globe-controls" className="globe-controls">
          {ready ? "Drag to rotate" : status === "unavailable" ? "3D view unavailable" : "Loading 3D globe…"}
          <span className="sr-only">. Arrow keys rotate the globe. Home resets the view.</span>
        </span>
        <button type="button" className="globe-reset-btn" onClick={() => reset.current?.()} disabled={!ready}>Reset view</button>
        <a href="https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/" className="globe-credit">
          Imagery: NASA Earth Observatory
        </a>
      </div>
    </div>
  );
}
