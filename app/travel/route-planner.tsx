"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Bus, CarFront, Check, Copy,
  MapPin, RotateCcw, TrainFront,
} from "lucide-react";
import boundary from "./korea-boundary.json";
import {
  campusDirections, cities, dongdaegu, expressBusTickets, intercityBusTickets,
  kakaoRoute, straightLineKm, trainTickets, venue,
  type Mode, type Point,
} from "./route-data";

const modes = {
  train: { label: "Train", Icon: TrainFront, color: "#f5c987" },
  bus: { label: "Bus", Icon: Bus, color: "#7fddc6" },
  car: { label: "Private vehicle", Icon: CarFront, color: "#ff8a97" },
};

function project([lon, lat]: Point) {
  return [54 + (lon - 125.55) * 84, 10 + (38.65 - lat) * 96];
}

const outlines = boundary.map(({ id, coordinates }) => ({
  id,
  path: coordinates.map((polygon) => polygon.map((ring) => ring.map(
    ([lon, lat], index) => (index === 0 ? "M" : "L") + project([lon, lat])
      .map((value) => value.toFixed(1)).join(" "),
  ).join("") + "Z").join("")).join(""),
}));

function routePath(points: Point[]) {
  const projected = points.map(project);
  const last = projected[projected.length - 1];
  return "M" + projected[0].join(" ") + projected.slice(1, -1).map(([x, y], index) => {
    const [nextX, nextY] = projected[index + 2];
    return " Q" + [x, y, (x + nextX) / 2, (y + nextY) / 2].join(" ");
  }).join("") + " L" + last.join(" ");
}

type City = (typeof cities)[number];

function DistanceHighlight({ distance, city }: { distance: number; city: string }) {
  const [shown, setShown] = useState(distance);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1400, 1);
      setShown(Math.round(distance * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [distance]);
  return <div className="journey-distance-hero" aria-label={`${city} to the venue, approximately ${distance} kilometres straight line`}>
    <div className="journey-distance-orbit" aria-hidden="true" />
    <span className="journey-distance-origin">From {city} to your next connection</span>
    <div className="journey-distance-number" aria-hidden="true"><span>~</span>{shown}<small>km</small></div>
    <p>See you in Daegu.</p>
    <small>City centre to campus · straight-line distance<br />Check directions for travel distance and time.</small>
  </div>;
}

function RouteAnimation({ path, mode }: { path: string; mode: Mode }) {
  const motion = useRef<SVGAnimateMotionElement>(null);
  const visibility = useRef<SVGAnimateElement>(null);
  const { Icon, color } = modes[mode];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    motion.current?.beginElement();
    visibility.current?.beginElement();
  }, []);

  return (
    <g>
      <path className="journey-route-draw" d={path} pathLength="1" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <g className="journey-route-vehicle" opacity="0">
        <animateMotion ref={motion} begin="indefinite" dur="2.8s" path={path} fill="freeze" />
        <animate ref={visibility} begin="indefinite" attributeName="opacity" dur="3s" values="0;1;1;0" keyTimes="0;.04;.88;1" fill="freeze" />
        <circle r="13" fill={color} stroke="#111827" strokeWidth="2" />
        <Icon x={-7.5} y={-7.5} size={15} color="#101722" strokeWidth={2.4} />
      </g>
    </g>
  );
}

function JourneyMap({ city, mode, replay }: { city: City; mode: Mode; replay: number }) {
  const { color } = modes[mode];
  const stops = mode === "train" ? city.railVia : city.roadVia;
  const points = mode === "car" ? [city.point, ...stops, venue.point] : [city.point, ...stops, dongdaegu, venue.point];
  const path = routePath(points);
  const [startX, startY] = project(city.point);
  const [venueX, venueY] = project(venue.point);
  const originOnLeft = startX > 325;
  const originLabelX = startX + (originOnLeft ? -13 : 13);

  return (
    <svg className="journey-map-svg" viewBox="0 53 460 485" role="img" aria-label={`Illustrative ${modes[mode].label.toLowerCase()} route from ${city.name} to Yeungjin University in Daegu`}>
      <defs>
        <pattern id="journey-grid" width="42" height="42" patternUnits="userSpaceOnUse">
          <path d="M42 0H0V42" fill="none" stroke="#a6b8d0" strokeOpacity=".10" />
        </pattern>
        <linearGradient id="journey-land" x2="0.9" y2="1">
          <stop stopColor="#28384d" />
          <stop offset="1" stopColor="#1b293b" />
        </linearGradient>
      </defs>
      <rect width="460" height="540" fill="url(#journey-grid)" />
      {/* Coastline from Natural Earth, 1:50m Admin 0 Countries (public domain). */}
      {outlines.map(({ id, path: outline }) => (
        <path key={id} d={outline} fill={id === "KOR" ? "url(#journey-land)" : "#192434"}
          fillRule="evenodd" stroke={id === "KOR" ? "#53647a" : "#37485d"} strokeWidth=".9" />
      ))}
      <g fill="#8f9eb1" fontSize="11" letterSpacing="2">
        <text x="48" y="218">YELLOW</text>
        <text x="61" y="234">SEA</text>
        <text x="391" y="168">EAST</text>
        <text x="397" y="184">SEA</text>
        <text x="68" y="512" letterSpacing="1">JEJU</text>
      </g>
      <g transform="translate(423 82)" fill="#bdc7d5" textAnchor="middle">
        <text y="-7" fontSize="12">N</text>
        <path d="M0 1 5 14 0 11 -5 14Z" />
      </g>
      <path d={path} fill="none" stroke="#080e18" strokeWidth="9" strokeLinecap="round" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" opacity=".55" />
      {cities.map(({ name, point }) => {
        const [x, y] = project(point);
        return <circle key={name} cx={x} cy={y} r="3.5" fill="#8899ad" stroke="#101927" strokeWidth="1.5" />;
      })}
      <RouteAnimation key={`${city.name}-${mode}-${replay}`} path={path} mode={mode} />
      <circle cx={startX} cy={startY} r="6" fill={color} stroke="#111927" strokeWidth="2" />
      <text className="journey-map-label" x={originLabelX} y={startY + 4} fill={color}
        textAnchor={originOnLeft ? "end" : "start"}>{city.name}</text>
      <circle className="journey-destination-pulse" cx={venueX} cy={venueY} r="12" fill="#f65569" opacity=".23" />
      <circle cx={venueX} cy={venueY} r="6" fill="#ff7c8c" stroke="#121a27" strokeWidth="2" />
      <text className="journey-map-label" x={venueX + 15} y={venueY + 4} fill="#ff9ca7">Daegu</text>
    </svg>
  );
}

export default function RoutePlanner() {
  const [city, setCity] = useState(cities[0]);
  const [mode, setMode] = useState<Mode>("train");
  const [replay, setReplay] = useState(0);
  const [copyMessage, setCopyMessage] = useState("");
  const { label, color } = modes[mode];
  const distance = straightLineKm(city.point, venue.point);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(venue.address);
      setCopyMessage("Address copied");
    } catch {
      setCopyMessage("Select the address above to copy it.");
    }
  }

  return (
    <main className="journey-page" style={{ "--journey-accent": color } as React.CSSProperties}>
      <header className="journey-header">
        <div className="journey-wrap">
          <a className="journey-back" href="/"><ArrowLeft size={17} /> Event home</a>
          <span>Business Advisor Korea 2026</span>
        </div>
      </header>

      <div className="journey-wrap">
        <section className="journey-intro">
          <div>
            <h1>Your next connection<br className="journey-heading-break" /> is in <em>Daegu.</em></h1>
            <p>Choose your departure city and how you’re travelling to Yeungjin University.</p>
          </div>
          <div className="journey-event"><MapPin size={19} /><span>Bokhyeon Campus, Daegu<small>12–13 December 2026</small></span></div>
        </section>

        <div className="journey-layout">
          <section className="journey-panel journey-controls" aria-labelledby="journey-controls-heading">
            <h2 id="journey-controls-heading">Plan your journey</h2>
            <DistanceHighlight key={city.name} city={city.name} distance={distance} />
            <div className="journey-choice" role="group" aria-labelledby="journey-city-heading">
              <h3 id="journey-city-heading">Departure city</h3>
              <div className="journey-cities">
                {cities.map((option) => (
                  <button key={option.name} type="button" aria-pressed={option === city} onClick={() => setCity(option)}>
                    {option.name}<small lang="ko">{option.korean}</small>
                  </button>
                ))}
              </div>
            </div>
            <div className="journey-choice" role="group" aria-labelledby="journey-mode-heading">
              <h3 id="journey-mode-heading">Travel by</h3>
              <div className="journey-modes">
                {(Object.keys(modes) as Mode[]).map((option) => {
                  const { Icon, label: modeLabel } = modes[option];
                  return <button key={option} type="button" aria-pressed={option === mode} onClick={() => setMode(option)}>
                    <Icon size={19} aria-hidden="true" /> {modeLabel}
                  </button>;
                })}
              </div>
            </div>
          </section>

          <figure className="journey-panel journey-map">
            <figcaption className="journey-map-heading">
              <span>{city.name} <ArrowRight size={16} /> Daegu</span>
              <button type="button" className="journey-replay" onClick={() => setReplay((count) => count + 1)}>
                <RotateCcw size={15} /> Replay
              </button>
            </figcaption>
            <JourneyMap city={city} mode={mode} replay={replay} />
            <div className="journey-map-footer"><span><i /> {label} route preview</span><span>Illustrative map</span></div>
          </figure>

          <section className="journey-panel journey-itinerary" aria-labelledby="journey-itinerary-heading">
            <div className="journey-itinerary-title" aria-live="polite">
              <div><p>{label}</p><h2 id="journey-itinerary-heading">{city.name} to Daegu</h2></div>
            </div>
            <ol key={`${city.name}-${mode}`} className="journey-steps">
              {mode === "train" && <>
                <li><strong>Take the train from {city.name}</strong><p>{city.rail}</p></li>
                <li><strong>Transfer at Dongdaegu Station</strong><p>Take a taxi or follow the <a href={campusDirections}>university’s local bus directions</a> to campus.</p></li>
              </>}
              {mode === "bus" && <>
                <li><strong>Find a coach to Daegu</strong><p>{city.busConnection ?? `Search from ${city.terminal} to Dongdaegu Bus Terminal for your travel date.`}</p></li>
                <li><strong>Continue to Bokhyeon Campus</strong><p>From Dongdaegu Bus Terminal, take a taxi or local bus 937 or 413. Check the current stop and timetable before setting off.</p></li>
              </>}
              {mode === "car" && <li><strong>Drive from {city.name} to Bokhyeon Campus</strong><p>Set Yeungjin University as your destination and check current traffic and tolls in KakaoMap.</p></li>}
              <li><strong>Arrive at Yeungjin University</strong><p>Follow the Business Advisor Korea event signs on campus.</p></li>
            </ol>
            <div className="journey-actions">
              <a className="journey-directions" href={kakaoRoute(city, mode)} target="_blank" rel="noreferrer">
                {mode === "car" ? "Driving directions" : "Transit directions"} <ArrowUpRight size={16} />
              </a>
              {mode === "train" && <a href={trainTickets} target="_blank" rel="noreferrer">KORAIL <ArrowUpRight size={14} /></a>}
              {mode === "bus" && <>
                <a href={expressBusTickets} target="_blank" rel="noreferrer">KOBUS <ArrowUpRight size={14} /></a>
                <a href={intercityBusTickets} target="_blank" rel="noreferrer">Tmoney <ArrowUpRight size={14} /></a>
              </>}
            </div>
          </section>
        </div>

        <section className="journey-panel journey-venue" aria-labelledby="journey-venue-heading">
          <div className="journey-venue-icon"><MapPin size={23} /></div>
          <div>
            <h2 id="journey-venue-heading">Yeungjin University <span>· Bokhyeon Campus</span></h2>
            <p lang="ko">{venue.address}</p>
            <span className="journey-copy-status" role="status">{copyMessage}</span>
          </div>
          <div className="journey-venue-actions">
            <a href={campusDirections} target="_blank" rel="noreferrer">Campus directions <ArrowUpRight size={15} /></a>
            <button type="button" onClick={copyAddress}>{copyMessage === "Address copied" ? <Check size={16} /> : <Copy size={16} />} Copy address</button>
          </div>
        </section>
      </div>
    </main>
  );
}
