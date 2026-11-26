"use client";

import { sitePath } from "./site-path";
import RoutePlanner from "./travel/route-planner";
import "./travel/travel.css";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  MapPin,
  Menu,
  X,
  CheckCircle2,
  Clock,
  ChevronDown,
  MessageCircle,
  ArrowUp,
  Handshake,
  Building2,
  Sprout,
  PiggyBank,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import InteractiveGlobe from "./interactive-globe";

const BUSINESS_ADVISOR_FACEBOOK = "https://www.facebook.com/BusinessadvisorLK";
const BOOKING_URL = "https://www.bookingministry.com/";
const BOOKING_SUPPORT_URL = `${BOOKING_URL}contact`;
const EVENT_VENUE = "Yeungjin University, Daegu";

const enterpriseSteps = [
  { title: "Earn in South Korea", detail: "Set a goal for what you earn abroad.", Icon: Building2 },
  { title: "Build your savings", detail: "Set aside money and plan your startup costs.", Icon: PiggyBank },
  { title: "Start and grow in Sri Lanka", detail: "Return with a plan to launch and build your business.", Icon: Sprout },
];

function EnterpriseJourney() {
  const journey = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const panel = journey.current;
    if (!panel || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        panel.classList.add("enterprise-in-view");
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={journey} className="enterprise-journey" aria-label="From working in Korea to building a business in Sri Lanka">
      {enterpriseSteps.map(({ title, detail, Icon }) => (
        <li key={title}>
          <span className="enterprise-icon"><Icon size={22} aria-hidden="true" /></span>
          <span><strong>{title}</strong><small>{detail}</small></span>
        </li>
      ))}
    </ol>
  );
}

interface Speaker {
  name: string;
  role: string;
  topic: string;
  mark: string;
  bio: string;
  points: string[];
  image: string;
}

const speakers: Speaker[] = [
  {
    name: "Viraj Henegedera",
    role: "Chartered Accountant & Entrepreneur",
    topic: "From overseas earnings to long-term financial success",
    mark: "VH",
    image: "/images/speakers/viraj.jpg",
    bio: "A Sri Lankan Chartered Accountant, entrepreneur, business consultant and financial educator with more than two decades of experience in auditing, corporate finance, taxation and business advisory. He is the founder of IBT Consultants, Online Tax Advisor and Online Business Advisor.",
    points: [
      "Disciplined financial management for overseas earners",
      "Personal wealth planning and informed investment evaluation",
      "Preparing for sustainable entrepreneurial opportunities in Sri Lanka",
    ],
  },
  {
    name: "Wikasitha Weerasinghe",
    role: "Brand Strategist & Dynamic Marketer",
    topic: "Building brands that connect and create measurable impact",
    mark: "VV",
    image: "/images/speakers/vikasita.jpg",
    bio: "A brand strategist and dynamic marketer with nearly 15 years of corporate experience across FMCG, broadcasting, fashion, advertising, education, insurance, and food and beverage. His work combines strategic marketing knowledge with creative brand thinking.",
    points: [
      "Brand positioning, strategy and integrated marketing",
      "Corporate communications and campaign development",
      "Market research, strategic planning and event management",
    ],
  },
  {
    name: "Damindu Welikala",
    role: "Director of IDEAZONE",
    topic: "Turning ideas into digital innovation",
    mark: "DV",
    image: "/images/speakers/damindu.jpg",
    bio: "A digital innovator, technology enthusiast and creative problem solver who brings technology, creativity and strategy together to build sustainable digital growth. His work at IDEAZONE transforms ideas into future-ready platforms for businesses.",
    points: [
      "AI, web development and strategy for digital productivity",
      "Modern websites, digital platforms and smart solutions",
      "Branding and digital marketing that connect businesses with audiences",
    ],
  },
  {
    name: "Rasika Hemantha",
    role: "Registered Investment Advisor",
    topic: "Research-driven decisions in Sri Lanka's capital market",
    mark: "RH",
    image: "/images/speakers/rasika.jpg",
    bio: "An investment advisory professional and Manager at Nestor Stock Brokers, registered with the Securities and Exchange Commission of Sri Lanka. His experience covers equity research, market analysis, investor education and client advisory services.",
    points: [
      "Understanding listed companies through equity research",
      "Interpreting market information and investment opportunities",
      "Capital-market awareness and informed portfolio decisions",
    ],
  },
];

const programmeData = [
  {
    day: "Day 01",
    date: "Saturday, 12 December 2026",
    title: "Business Networking Meeting",
    badge: "Community & Strategic Connections",
    time: "15:00 – 19:30 KST",
    venue: EVENT_VENUE,
    description:
      "A high-value networking evening connecting Sri Lankan professionals, entrepreneurs, engineers, and community leaders living across South Korea.",
    schedule: [
      { time: "15:00", title: "Arrival, Badge Collection & Welcome Refreshments" },
      { time: "15:45", title: "Opening Address: Unlocking Sri Lankan Talent & Capital in Korea" },
      { time: "16:30", title: "Cross-Border Trade & Collaboration: Sri Lanka ↔ South Korea" },
      { time: "17:30", title: "Interactive Speed-Networking & Mentorship Tables" },
      { time: "18:45", title: "Networking Dinner & Informal Partnership Discussions" },
    ],
  },
  {
    day: "Day 02",
    date: "Sunday, 13 December 2026",
    title: "Business Advisor Business Summit",
    badge: "Intensive Practical Workshop",
    time: "09:30 – 15:30 KST",
    venue: EVENT_VENUE,
    description:
      "A hands-on, masterclass-style workshop designed to transform your overseas hard work into structured investments, sustainable business ventures, and freedom.",
    schedule: [
      { time: "09:30", title: "Morning Tea & Networking Check-in" },
      { time: "10:15", title: "Keynote 01: Structuring Overseas Remittances & Wealth Discipline" },
      { time: "11:30", title: "Keynote 02: Launching a Resilient Brand & Business with Lean Capital" },
      { time: "12:30", title: "Buffet Lunch & Open Peer Interaction" },
      { time: "13:30", title: "Keynote 03: Technology, Automation & High-Yield Asset Selection" },
      { time: "14:30", title: "Live Panel Q&A: Ask the 4 Speakers Anything (Direct Advice)" },
    ],
  },
];

const outcomes = [
  "Manage overseas income with clear structure and long-term discipline",
  "Understand investment choices and evaluate real risks accurately",
  "Turn South Korean work and life experience into profitable business ventures",
  "Build an authentic brand with distinctive market identity",
  "Use modern tech & AI tools to operate businesses efficiently from anywhere",
  "Create lifelong professional connections across Daegu, Seoul, and Busan",
];

const faqs = [
  {
    q: "Who should attend this event in Daegu?",
    a: "Sri Lankans currently working or studying in South Korea (E-9, E-7, D-2, D-10 visa holders, business owners, and professionals) who wish to build a secure financial future, invest wisely, or start an enterprise.",
  },
  {
    q: "What language will the sessions be delivered in?",
    a: "The sessions will be conducted in Sinhala, accompanied by bilingual (Sinhala & English) visual presentations, case studies, and actionable handbooks.",
  },
  {
    q: "Can I attend from other cities like Seoul, Incheon, or Busan?",
    a: "Yes. The event takes place at Yeungjin University, Bokhyeon Campus in Daegu. Travel to Dongdaegu by train or intercity bus, then continue to the campus by taxi or local bus. See our City Travel Guide for the campus address and check current services before travelling.",
  },
  {
    q: "Can I participate in only one day?",
    a: "Check Booking Ministry for the available ticket options for each day.",
  },
  {
    q: "Where can I book tickets or get help?",
    a: "Use the Booking Ministry links on this page to check ticket availability. For booking or ticket questions, choose Booking Support to contact their team.",
  },
];

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const programmeDetailsRef = useRef<HTMLDetailsElement>(null);
  const speakerDialogRef = useRef<HTMLDivElement>(null);
  const speakerRailRef = useRef<HTMLDivElement>(null);
  const [speakerSlide, setSpeakerSlide] = useState(0);

  // General UI states
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  // Travel Guide state

  useEffect(() => {
    if (!selectedSpeaker) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = speakerDialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.querySelector<HTMLButtonElement>("button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedSpeaker(null);
      if (event.key !== "Tab" || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]'));
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [selectedSpeaker]);

  // Native scrolling on touch screens; desktop-only parallax and smooth wheel.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const handleScroll = () => setShowFloatingBar(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const media = gsap.matchMedia(mainRef);
    media.add({
      desktop: "(min-width: 901px) and (hover: hover) and (pointer: fine)",
      reduce: "(prefers-reduced-motion: reduce)",
      all: "all",
    }, (context) => {
      const { desktop, reduce } = context.conditions!;
      if (reduce) {
        mainRef.current?.querySelectorAll<HTMLElement>(".stat-num").forEach((el) => {
          el.textContent = Number(el.dataset.target || 0).toLocaleString();
        });
        return;
      }

      const lenis = desktop ? new Lenis({ duration: 0.9, smoothWheel: true }) : null;
      const tick = (time: number) => lenis?.raf(time * 1000);
      const handleMouseMove = (event: MouseEvent) => {
        document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
      };
      if (lenis) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
      }

      gsap.from(".hero-kicker, .hero-title span, .hero-meta p, .hero-actions", {
        y: desktop ? 30 : 16, opacity: 0,
        duration: desktop ? 0.9 : 0.65, stagger: 0.06,
        ease: "power2.out", clearProps: "transform,opacity",
      });

      if (desktop) {
        gsap.to(".hero-image", {
          yPercent: 10, scale: 1.05, ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.4 },
        });
        gsap.to(".hero-copy", {
          yPercent: 12, opacity: 0.3, ease: "none",
          scrollTrigger: { trigger: ".hero", start: "20% top", end: "bottom top", scrub: 0.4 },
        });
        gsap.to(".progress-fill", {
          scaleY: 1, ease: "none",
          scrollTrigger: { trigger: mainRef.current, start: "top top", end: "bottom bottom", scrub: 0.2 },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: desktop ? 35 : 18, opacity: 0,
          duration: desktop ? 0.8 : 0.55, ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: el, start: "top 94%", once: true },
        });
      });
      gsap.from(".speaker-card", {
        y: desktop ? 30 : 16, opacity: 0, duration: 0.65,
        stagger: desktop ? 0.08 : 0.03, ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: ".speakers-grid", start: "top 94%", once: true },
      });
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: Number(el.dataset.target || 0), duration: 1.5, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 94%", once: true },
          onUpdate: () => { el.textContent = Math.floor(obj.val).toLocaleString(); },
        });
      });
      return () => {
        gsap.ticker.remove(tick);
        lenis?.destroy();
        window.removeEventListener("mousemove", handleMouseMove);
      };
    });

    return () => {
      media.revert();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const theme = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = theme;
    try { localStorage.setItem("ba-theme", theme); } catch { /* Keep the theme for this visit. */ }
  }

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <main ref={mainRef} className="experience">
      {/* Ambient Cursor Spotlight */}
      <div className="mouse-spotlight" aria-hidden="true" />

      {/* Reading Progress Bar */}
      <div className="progress-rail" aria-hidden="true">
        <span className="progress-fill" />
      </div>

      {/* Navigation */}
      <nav className="nav-shell" aria-label="Primary navigation">
        <div className="header-branding">
          <button className="brand summit-nav-brand" onClick={() => scrollTo("top")} aria-label="Business Advisor – Business Summit – South Korea, back to top">
            <img src={sitePath("/images/business-advisor-logo.jpeg")} alt="Business Advisor" width={432} height={442} />
            <span>Business Advisor – Business Summit – South Korea</span>
          </button>
          <a className="header-presenter" href={BOOKING_URL} aria-label="By Booking Ministry">
            <span>by</span>
            <img src={sitePath("/images/booking-ministry-logo.webp")} alt="Booking Ministry" width={700} height={340} />
          </a>
        </div>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <button onClick={() => scrollTo("story")}>The Event</button>
          <button onClick={() => scrollTo("programme")}>Programme</button>
          <button onClick={() => scrollTo("speakers")}>Speakers</button>
          <button onClick={() => scrollTo("partners")}>Organizer</button>
          <a className="nav-travel" href="#travel" onClick={() => setMenuOpen(false)}>Travel</a>
          <a className="nav-cta" href={BOOKING_URL}>
            Tickets <ArrowRight size={16} />
          </a>
        </div>

        <div className="nav-utilities">
        <button type="button" className="theme-toggle" onClick={toggleTheme}><span className="theme-to-light">☀ Light</span><span className="theme-to-dark">☾ Dark</span></button>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="top">
        <div className="hero-image" />
        <div className="hero-shade" />

        <div className="hero-copy">
          <p className="hero-kicker">Daegu, South Korea</p>
          <a className="summit-wordmark summit-main-logo" href="#partners">
            <img src={sitePath("/images/booking-ministry-logo.webp")} alt="Booking Ministry" width={700} height={340} fetchPriority="high" />
          </a>
          <h1 className="summit-wordmark">
            <img src={sitePath("/images/business-summit-logo.png")} alt="Business Summit – South Korea" width={880} height={328} fetchPriority="high" />
          </h1>
          <a className="summit-organizer-credit" href="#partners">Organised by <strong>Booking Ministry</strong></a>

          <div className="hero-meta">
            <p>
              <CalendarDays size={18} className="text-red-500" /> 13 December 2026
            </p>
            <p>
              <MapPin size={18} className="text-red-500" /> {EVENT_VENUE}
            </p>
          </div>

          <div className="hero-actions">
            <button className="primary-btn" onClick={() => scrollTo("programme")}>
              Explore the programme <ArrowRight size={18} />
            </button>
            <a className="text-btn hero-facebook" href={BUSINESS_ADVISOR_FACEBOOK} target="_blank" rel="noreferrer">Business Advisor on Facebook <ArrowRight size={17} /></a>
          </div>
        </div>

        <div className="hero-manifesto" aria-label="Connect. Build. Grow.">
          <span>Connect</span><i /><span>Build</span><i /><span>Grow</span>
        </div>
      </section>

      {/* Feature 4: The Connection Section with Interactive 3D Dark Globe */}
      <section className="connection section" id="story">
        <div className="connection-head" data-reveal>
          <div className="section-label">The Connection</div>
          <h2>
            Local roots.<br />Global <em>ambition.</em>
          </h2>
          <p>
            From Sri Lanka to Daegu. A shared ambition to turn experience into enterprise, and connections into new possibilities.
          </p>
          <ul className="connection-values">
            <li><Handshake aria-hidden="true" /><span>Build connections</span></li>
            <li><Building2 aria-hidden="true" /><span>Explore opportunities</span></li>
            <li><Sprout aria-hidden="true" /><span>Grow your business</span></li>
          </ul>
          <button className="text-btn" onClick={() => scrollTo("programme")}>Explore the programme <ArrowRight size={20} /></button>
        </div>

        <InteractiveGlobe />
      </section>

      {/* Programme Section with Tabs */}
      <section className="programme section" id="programme">
        <div className="programme-intro" data-reveal>
          <div className="section-label">The Programme</div>
          <h2>
            Two days.<br />New possibilities.
          </h2>
        </div>

        <div className="programme-showcase">
          {programmeData.map((prog, idx) => (
            <div className="programme-card-shell" data-reveal key={prog.day}>
              <div className="programme-photo-card" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
                <img src={sitePath(idx === 0 ? "/images/networking-premium-v1.webp" : "/images/workshop-premium-v1.webp")} alt={idx === 0 ? "Illustration of professionals sharing ideas at a business networking session" : "Illustration of an interactive business workshop"} width={1536} height={1024} loading="lazy" />
                <div className="programme-card-copy">
                  <span className="programme-date">{idx === 0 ? "12" : "13"} December <i /></span>
                  <h3>{idx === 0 ? <>Business Networking<br />Meeting</> : <>Business Advisor<br />Business Summit</>}</h3>
                  <p>{idx === 0 ? "Connect. Share. Collaborate." : "Learn. Plan. Build."}</p>
                  <button className="programme-card-link" aria-label={`Explore ${prog.day}`} onClick={() => {
                    setActiveDay(idx);
                    if (programmeDetailsRef.current) programmeDetailsRef.current.open = true;
                    requestAnimationFrame(() => { ScrollTrigger.refresh(); scrollTo("programme-details"); });
                  }}><ArrowRight size={26} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="programme-bottom" data-reveal><span>Business Summit – South Korea</span><i /><a className="primary-btn" href={BOOKING_URL}>Check Tickets <ArrowRight size={18} /></a></div>

        {/* Day Selector Tabs */}
        <details className="programme-details" id="programme-details" ref={programmeDetailsRef} onToggle={() => ScrollTrigger.refresh()}>
        <summary>Explore the day-by-day programme <ChevronDown size={18} /></summary>
        <div className="programme-tabs-nav" role="tablist" aria-label="Programme day">
          {programmeData.map((prog, idx) => (
            <button
              key={prog.day}
              className={`programme-tab-btn ${activeDay === idx ? "active" : ""}`}
              onClick={() => setActiveDay(idx)}
              role="tab"
              id={`programme-day-${idx}`}
              aria-selected={activeDay === idx}
              aria-controls="programme-panel"
              tabIndex={activeDay === idx ? 0 : -1}
              onKeyDown={(event) => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const next = event.key === "Home" ? 0 : event.key === "End" ? programmeData.length - 1 : (idx + (event.key === "ArrowRight" ? 1 : -1) + programmeData.length) % programmeData.length;
                setActiveDay(next);
                document.getElementById(`programme-day-${next}`)?.focus();
              }}
            >
              <span className="tab-day-badge">{prog.day}</span>
              <span>{prog.title}</span>
            </button>
          ))}
        </div>

        {/* Active Tab Schedule Card */}
        <div
          className={`programme-tab-content ${activeDay === 1 ? "dark-card" : ""}`}
          id="programme-panel"
          role="tabpanel"
          aria-labelledby={`programme-day-${activeDay}`}
        >
          <div className="programme-header-row">
            <div className="programme-header-left">
              <span className="eyebrow">
                {programmeData[activeDay].day} · {programmeData[activeDay].date}
              </span>
              <h3>{programmeData[activeDay].title}</h3>
              <p className={activeDay === 1 ? "text-neutral-300" : "text-neutral-600"}>
                {programmeData[activeDay].description}
              </p>
            </div>
            <div className="programme-meta-badges">
              <span>
                <Clock size={16} /> {programmeData[activeDay].time}
              </span>
              <span>
                <MapPin size={16} /> {programmeData[activeDay].venue}
              </span>
              <a
                className="primary-btn !min-h-[44px] !py-2 !px-5 text-sm"
                href={BOOKING_URL}
              >
                Check Ticket Availability <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="programme-schedule-list">
            {programmeData[activeDay].schedule.map((item, idx) => (
              <div className="schedule-row" key={idx}>
                <div className="schedule-time">
                  <Clock size={15} /> {item.time}
                </div>
                <div className="schedule-title">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
        </details>
      </section>

      {/* Speakers Section with 3D Tilt Cards */}
      <section className="speakers section" id="speakers">
        <div className="speakers-head" data-reveal>
          <div>
            <div className="section-label">The Expert Panel</div>
            <h2>
              Four voices.
              <br />
              <em>One practical toolkit.</em>
            </h2>
          </div>
          <p>
            Meet the leaders and specialists joining us in Daegu to guide your journey from salary earner to empowered investor and business owner.
          </p>
        </div>

        <div className="speakers-grid" ref={speakerRailRef} onScroll={(event) => {
          const rail = event.currentTarget;
          const firstCard = rail.firstElementChild as HTMLElement | null;
          if (firstCard) setSpeakerSlide(Math.max(0, Math.min(speakers.length - 1, Math.round(rail.scrollLeft / (firstCard.offsetWidth + 16)))));
        }}>
          {speakers.map((speaker) => (
            <article
              className="speaker-card"
              key={speaker.name}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => setSelectedSpeaker(speaker)}
              role="button"
              tabIndex={0}
              aria-label={`Meet ${speaker.name}`}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedSpeaker(speaker); } }}
            >
              <div className="speaker-mark">
                <img className="speaker-avatar-img" src={sitePath(speaker.image)} alt={speaker.name} loading="lazy" />
              </div>
              <div className="speaker-info">
                <p>{speaker.role}</p>
                <h3>{speaker.name}</h3>
                <span>{speaker.topic}</span>
                <div className="speaker-explore-btn">
                  <span>View Insights</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="speaker-rail-controls">
          <span>Meet the advisors <b aria-live="polite">{String(speakerSlide + 1).padStart(2, "0")} / 04</b></span>
          <button aria-label="Previous speaker" disabled={speakerSlide === 0} onClick={() => {
            const rail = speakerRailRef.current;
            rail?.scrollBy({ left: -((rail.firstElementChild as HTMLElement)?.offsetWidth + 16), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
          }}><ArrowLeft size={18} /></button>
          <button aria-label="Next speaker" disabled={speakerSlide === speakers.length - 1} onClick={() => {
            const rail = speakerRailRef.current;
            rail?.scrollBy({ left: (rail.firstElementChild as HTMLElement)?.offsetWidth + 16, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
          }}><ArrowRight size={18} /></button>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="partnership section" id="partners">
        <div className="partnership-copy" data-reveal>
          <div className="section-label">Summit Organizer</div>
          <h2>Booking Ministry</h2>
          <p>Booking Ministry organizes the Business Advisor Business Summit in Daegu, featuring the Business Advisor team from Sri Lanka.</p>
          <div className="partnership-actions">
            <a className="primary-btn" href={BOOKING_URL}>Check Tickets <ArrowRight size={17} /></a>
            <a className="text-btn" href={BOOKING_SUPPORT_URL}>Booking Support</a>
            <a className="text-btn" href={BUSINESS_ADVISOR_FACEBOOK} target="_blank" rel="noreferrer">Business Advisor on Facebook <ArrowRight size={16} /></a>
          </div>
        </div>
        <figure className="partnership-frame" data-reveal>
          <div className="partnership-photo organizer-logo">
            <img src={sitePath("/images/booking-ministry-logo.webp")} alt="Booking Ministry logo" width={700} height={340} loading="lazy" />
          </div>
        </figure>
      </section>

      {/* Why It Matters Section */}
      <section className="why section">
        <div className="why-image" data-reveal />
        <div className="why-copy" data-reveal>
          <div className="section-label">Why It Matters</div>
          <h2>
            Turn today’s income into <em>tomorrow’s freedom.</em>
          </h2>
          <p>
            Sri Lankans across South Korea make immense personal sacrifices in factories, sites, and offices. The summit provides the exact strategic roadmap needed to safeguard and multiply your earnings into self-sustaining ventures.
          </p>
          <ul>
            <li>
              <span>01</span> Structure overseas remittances with disciplined asset allocation
            </li>
            <li>
              <span>02</span> Evaluate high-yield investments while protecting capital against scams
            </li>
            <li>
              <span>03</span> Turn international working insights into viable businesses in Sri Lanka
            </li>
            <li>
              <span>04</span> Forge genuine business networks with fellow Sri Lankans across Korea
            </li>
          </ul>
        </div>
      </section>


      <section className="outcomes section">
        <div className="outcomes-visual" data-reveal>
          <EnterpriseJourney />
        </div>
        <div className="outcomes-copy" data-reveal>
          <div className="section-label">What You Take Home</div>
          <h2>
            From earning in Korea to <em>building a business in Sri Lanka.</em>
          </h2>
          <p>At the summit, learn how to set a savings target, evaluate a business idea, and plan your first steps before you return.</p>
          <ol>
            {outcomes.map((item, i) => (
              <li key={item}>
                <span>0{i + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Live Animated Stats Counter Section */}
      <section className="proof section">
        <div className="section-label" data-reveal>
          Built on proven reach & community trust
        </div>
        <div className="stats" data-reveal>
          <div>
            <b>
              <span className="stat-num" data-target="2018">
                0
              </span>
            </b>
            <span>Established Year</span>
          </div>
          <div>
            <b>
              <span className="stat-num" data-target="500">
                0
              </span>
              K+
            </b>
            <span>YouTube Community</span>
          </div>
          <div>
            <b>
              <span className="stat-num" data-target="500">
                0
              </span>
              K+
            </b>
            <span>Facebook Community</span>
          </div>
          <div>
            <b>
              <span className="stat-num" data-target="12">
                0
              </span>
              M+
            </b>
            <span>Monthly Social Reach</span>
          </div>
        </div>
        <p data-reveal>
          From Kandy, Galle, Kurunegala, and Colombo — now the journey continues in <strong>Daegu.</strong>
        </p>
      </section>

      {/* Interactive FAQ Section */}
      <section className="faq section" id="faq">
        <div className="faq-intro" data-reveal>
          <div className="section-label">Common Inquiries</div>
          <h2>
            Frequently Asked <em>Questions.</em>
          </h2>
          <p>
            Everything you need to know about attendance, language, transport, and participation for the Daegu 2026 conference.
          </p>
        </div>

        <div className="faq-list" data-reveal>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div className={`faq-item ${isOpen ? "open" : ""}`} key={index}>
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <div className="faq-icon">
                    <ChevronDown size={18} />
                  </div>
                </button>
                {isOpen && <div className="faq-answer">{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Booking and support */}
      <section className="closing" id="contact">
        <div className="closing-bg" />
        <div className="closing-inner" data-reveal>
          <p className="section-label">Yeungjin University · Daegu · December 2026</p>
          <h2>
            Build what comes
            <br />
            <em>after the income.</em>
          </h2>
          <p>
            Secure your presence, gain actionable strategies from proven advisors, and connect with Sri Lankans taking bold steps toward independent futures.
          </p>

          <div className="closing-cta-row">
            <a className="primary-btn large" href={BOOKING_URL}>
              Check Tickets <ArrowRight size={18} />
            </a>
            <a className="secondary-btn" href={BOOKING_SUPPORT_URL}>
              <MessageCircle size={20} />
              Booking Support
            </a>
          </div>

          <div className="contact-line">
            <a href={BOOKING_SUPPORT_URL}>Booking and inquiries via Booking Ministry <ArrowRight size={14} /></a>
          </div>
        </div>
      </section>

      <RoutePlanner />

      {/* Footer */}
      <footer id="site-footer" className="summit-footer">
        <div className="summit-footer-grid">
          <div className="summit-footer-brand">
            <a href="#top" className="summit-footer-logo" aria-label="Business Summit home">
              <img src={sitePath("/images/summit-footer-logo.png")} alt="" loading="lazy" />
            </a>
            <p>13 December 2026<br />Yeungjin University · Daegu, South Korea</p>
          </div>
          <nav className="summit-footer-group" aria-label="Explore the summit">
            <h2>Explore the summit</h2>
            <a href="#programme">Programme</a>
            <a href="#speakers">Speakers</a>
            <a href="#travel">Travel Guide</a>
          </nav>
          <div className="summit-footer-group">
            <a className="summit-footer-organizer" href={BOOKING_URL}>
              <img src={sitePath("/images/booking-ministry-logo.webp")} alt="" width={700} height={340} loading="lazy" />
              <span><small>Organised by</small><strong>Booking Ministry</strong></span>
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href={BOOKING_SUPPORT_URL}>Booking support</a>
            <a href={BUSINESS_ADVISOR_FACEBOOK}>Business Advisor on Facebook</a>
          </div>
        </div>
        <div className="summit-footer-bottom">
          <small>© 2026 Business Advisor. All rights reserved.</small>
          <a href="#top">Back to top <ArrowUp size={15} aria-hidden="true" /></a>
        </div>
      </footer>

      {/* Floating Bottom Quick Action Pill Bar */}
      <aside
        className={`floating-bar ${showFloatingBar ? "visible" : ""}`}
        aria-label="Quick actions"
      >
        <button className="floating-pill-btn quick-programme" onClick={() => scrollTo("programme")}>
          Programme
        </button>
        <a className="floating-pill-btn quick-travel" href="#travel" onClick={() => setMenuOpen(false)}>
          Travel
        </a>
        <a
          className="floating-pill-btn quick-support"
          href={BOOKING_SUPPORT_URL}
          title="Contact Booking Ministry"
        >
          <MessageCircle size={15} /> Support
        </a>
        <a className="floating-pill-btn floating-pill-cta" href={BOOKING_URL}>
          Tickets <ArrowRight size={14} />
        </a>
        <button
          className="floating-pill-btn quick-top !px-3"
          onClick={() => scrollTo("top")}
          title="Scroll to top"
        >
          <ArrowUp size={16} />
        </button>
      </aside>

      {/* Speaker Details Modal Dialog */}
      {selectedSpeaker && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedSpeaker(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="speaker-dialog-title"
          ref={speakerDialogRef}
          data-lenis-prevent
        >
          <div className="modal-card">
            <button
              className="modal-close-btn"
              onClick={() => setSelectedSpeaker(null)}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-5 mb-6">
              <div className="speaker-mark !w-20 !h-24 !text-3xl shrink-0">
                <img
                  className="speaker-avatar-img"
                  src={sitePath(selectedSpeaker.image)}
                  alt={selectedSpeaker.name}
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-red-500 font-bold">
                  {selectedSpeaker.role}
                </p>
                <h3 id="speaker-dialog-title" className="font-serif text-2xl md:text-3xl font-bold text-white mt-1">
                  {selectedSpeaker.name}
                </h3>
              </div>
            </div>

            <div className="border-t border-neutral-700/60 pt-4 mb-5">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Session Focus
              </h4>
              <p className="text-lg font-serif italic text-red-400">
                &ldquo;{selectedSpeaker.topic}&rdquo;
              </p>
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                About the Speaker
              </h4>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {selectedSpeaker.bio}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                Key Insights You Will Learn
              </h4>
              <ul className="space-y-2">
                {selectedSpeaker.points.map((pt, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-neutral-300 bg-neutral-900/60 p-3 rounded border border-neutral-800"
                  >
                    <CheckCircle2 size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-neutral-800">
              <a
                className="primary-btn !min-h-[46px] !text-sm"
                href={BOOKING_URL}
              >
                Check Tickets <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
