"use client";

import { getApiUrl, getImageUrl } from "@/lib/api";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";
import Link from "next/link";
import { Leaf, UserCheck, Briefcase, Calendar, Sparkles } from "lucide-react";

function AboutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>("brand");

  const [aboutData, setAboutData] = useState<any>({
    brand_name: "QURA HERBS",
    tagline: "Skin That Feels Like You.",
    subtitle: "OUR STORY",
    title: "Skin That Feels Like You.",
    hero_paragraph1:
      "Qura Herbs is a skincare and haircare brand built around a simple belief people should feel comfortable and confident in their own skin.",
    hero_paragraph2:
      "Founded in Coimbatore - 2025, Qura Herbs began with a personal skin journey and has grown through real customer experiences, offline connections, and now an expanding online community of 300+ customers.",
    hero_paragraph3:
      "We bring together skincare and haircare products made with herbal and botanical ingredients, selected with care for everyday skin and hair concerns. Our focus is on thoughtful products, honest communication, and routines that are simple enough to become part of everyday life.",
    hero_paragraph4:
      "What began with a small circle of customers is now growing into a brand with a larger purpose helping people care for their skin and hair without feeling the need to change who they are.",
    purpose_heading: "GROWING WITH PURPOSE",
    purpose_paragraph:
      "As an authorised reseller, we continue to grow through customer feedback, thoughtful product selection, and a commitment to presenting trusted skincare and haircare with transparency.",
    purpose_quote:
      "Beauty isn't about changing who you are. It's about caring for who you are.",
    hero_image:
      "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/product-images/d5dbde14da8c48a5ab796d080b563d42.jpg",
    image:
      "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/product-images/d5dbde14da8c48a5ab796d080b563d42.jpg",
  });

  const [founderData, setFounderData] = useState<any>({
    name: "Nandavel V",
    title: "Founder & CEO, Qura Herbs",
    image:
      "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/About/nandavel_founder.jpg",
    quote:
      "“Qura Herbs started with my own skin journey. I wanted to bring that experience to people who were going through something similar and help them feel more comfortable in their own skin.”",
    description: `Having experienced skin concerns himself, he understood the insecurity and frustration that can come with trying to find the right care. His personal experience with skincare and herbal ingredients eventually inspired him to build something that could reach people facing similar concerns.

His vision was simple, to make people feel more confident in their own skin through better care, not through unrealistic standards of beauty.

From understanding customer concerns and exploring ingredients to selecting products and shaping the brand, Nandavel continues to be closely involved in the foundation and direction of Qura Herbs.`,
    signature: "— Nandavel V\nFounder & CEO, Qura Herbs",
  });

  const [ceoData, setCeoData] = useState<any>({
    name: "Pranavi GY",
    title: "Co-Founder & MD, Qura Herbs",
    image:
      "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/About/ceo_pranavi.jpg",
    quote:
      "“For me, Qura is more than a business. It is a feeling that deserves to be experienced, expressed, and carried forward.”",
    description: `As Qura Herbs continued to take shape, Pranavi became part of the journey, bringing her own perspective, creativity, and ideas to the brand.

With a strong eye for aesthetics, creativity, and communication, Pranavi brings a distinct perspective to Qura Herbs. As someone who genuinely values self-care, she believes that taking care of your skin and yourself should be a positive and empowering experience. Her ideas and creative direction shape Qura's visual identity, presentation, and voice, bringing this belief into the way the brand expresses itself.`,
    signature: "— Pranavi GY\nCo-Founder & MD, Qura Herbs",
  });

  const [founderImgError, setFounderImgError] = useState<boolean>(false);
  const [ceoImgError, setCeoImgError] = useState<boolean>(false);

  useEffect(() => {
    // Fetch About Page Content
    fetch(getApiUrl("/api/v1/content/about"))
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setAboutData((prev: any) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.log("Failed to load about data:", err));

    // Fetch Founder Content
    fetch(getApiUrl("/api/v1/content/founder"))
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setFounderData((prev: any) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.log("Failed to load founder data:", err));

    // Fetch CEO Content
    fetch(getApiUrl("/api/v1/content/ceo"))
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setCeoData((prev: any) => ({
            ...prev,
            ...data,
            image:
              data.image ||
              data.ceo_image ||
              prev.image ||
              "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/About/ceo_pranavi.jpg",
          }));
        }
      })
      .catch((err) => console.log("Failed to load ceo data:", err));
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    router.replace(`/about?tab=${sectionId}`, { scroll: false });
  };

  // ScrollSpy with IntersectionObserver
  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "-20% 0px -50% 0px",
      threshold: 0,
    });

    const sections = ["brand", "founder", "ceo", "purpose"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Handle initial tab scroll from URL query param if present
  useEffect(() => {
    if (tabParam && ["brand", "founder", "ceo", "purpose"].includes(tabParam)) {
      setActiveTab(tabParam);
      const timer = setTimeout(() => {
        const element = document.getElementById(tabParam);
        if (element) {
          const offset = 120;
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [tabParam]);

  const tabButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const activeBtn = tabButtonRefs.current[activeTab];
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

  const navTabs = [
    { id: "brand", label: "Brand Story", icon: Leaf },
    { id: "founder", label: "The Founder", icon: UserCheck },
    { id: "ceo", label: "Co-Founder & MD", icon: Briefcase },
    { id: "purpose", label: "Growing with Purpose", icon: Sparkles },
  ];

  const founderImgSrc =
    founderData.image || founderData.founder_image
      ? getImageUrl(founderData.image || founderData.founder_image)
      : "/founder_nandavel.jpg";
  const ceoImgSrc =
    ceoData.image || ceoData.ceo_image
      ? getImageUrl(ceoData.image || ceoData.ceo_image)
      : "/ceo_pranavi.jpg";

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark font-sans selection:bg-brand-accent/20">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16 md:space-y-24">
        {/* Editorial Header */}
        <header className="text-center space-y-4 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-brand-light border border-brand-sand/40 rounded-full text-[11px] font-sans font-semibold text-brand-accent tracking-[0.25em] uppercase">
            <span>ABOUT OUR BRAND &amp; LEADERSHIP</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-brand-dark tracking-tight leading-tight uppercase">
            QURA HERBS
          </h1>

          <p className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-dark font-normal italic tracking-wide">
            Skin That Feels Like You.
          </p>

          <p className="text-xs sm:text-sm text-brand-cocoa/70 font-sans tracking-widest uppercase font-light">
            Coimbatore - 2025 &bull; Botanical Skincare &amp; Haircare
          </p>
          <div className="w-16 h-[1px] bg-brand-accent/40 mx-auto pt-1"></div>
        </header>

        {/* 4 Story Navigation Tabs */}
        <div className="sticky top-20 sm:top-24 z-30 w-full py-2 bg-brand-cream/90 backdrop-blur-md transition-all">
          <div
            className="w-full max-w-5xl mx-auto overflow-x-auto scrollbar-none px-4 sm:px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <nav
              aria-label="About Page Sections"
              className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 md:gap-3 py-1 min-w-max sm:min-w-0 mx-auto"
            >
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabButtonRefs.current[tab.id] = el;
                    }}
                    type="button"
                    onClick={() => scrollToSection(tab.id)}
                    className={`px-3 sm:px-3.5 md:px-5 py-1.5 sm:py-2 text-[10px] sm:text-[11px] md:text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1 sm:gap-1.5 md:gap-2 whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-brand-dark text-brand-cream shadow-sm"
                        : "text-brand-dark/75 hover:text-brand-dark hover:bg-brand-sand/25 border border-brand-sand/35 bg-brand-sand/10"
                    }`}
                  >
                    <Icon size={13} className="text-brand-accent shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ================================================== */}
        {/* SECTION 01 — BRAND INTRODUCTION (Brand Story) */}
        {/* ================================================== */}
        <section
          id="brand"
          className="space-y-8 md:space-y-10 animate-fade-in border-b border-brand-sand/30 pb-16 md:pb-24 scroll-mt-28"
        >
          {/* Section Eyebrow & Title */}
          <div className="space-y-3 border-b border-brand-sand/30 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-sans font-semibold tracking-[0.3em] text-brand-accent uppercase block">
                SECTION 01 &bull; OUR STORY
              </span>
              <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-brand-cocoa/60 uppercase tracking-widest bg-brand-light px-3 py-1.5 border border-brand-sand/30 rounded-sm">
                <Calendar size={13} className="text-brand-accent" />
                <span>Coimbatore &bull; 2025</span>
              </div>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-dark tracking-tight leading-tight">
              Skin That Feels Like You.
            </h2>
          </div>

          {/* Editorial Story Layout */}
          <div className="max-w-4xl space-y-6 text-brand-cocoa/90 font-sans font-light text-base md:text-lg leading-relaxed">
            <p>
              Qura Herbs is a skincare and haircare brand built around a
              simple belief{" "}
              <strong className="font-semibold text-brand-dark">
                people should feel comfortable and confident in their own skin.
              </strong>
            </p>
            <p>
              Founded in Coimbatore - 2025, Qura Herbs began with a personal
              skin journey and has grown through real customer experiences,
              offline connections, and now an expanding online community of{" "}
              <strong className="font-semibold text-brand-dark">
                300+ customers
              </strong>
              .
            </p>
            <p>
              We bring together skincare and haircare products made with{" "}
              <strong className="font-semibold text-brand-dark">
                herbal and botanical ingredients
              </strong>
              , selected with care for everyday skin and hair concerns. Our
              focus is on thoughtful products, honest communication, and
              routines that are simple enough to become part of everyday life.
            </p>

            {/* Highlight Callout Box */}
            <div className="mt-8 bg-brand-light border-l-4 border-brand-accent p-6 md:p-8 rounded-r-md shadow-sm space-y-3">
              <p className="font-serif text-lg sm:text-xl text-brand-dark font-light leading-relaxed">
                What began with a small circle of customers is now growing into
                a brand with a larger purpose{" "}
                <strong className="font-semibold text-brand-dark">
                  helping people care for their skin and hair without feeling the
                  need to change who they are.
                </strong>
              </p>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* SECTION 02 — MEET THE FOUNDER (Nandavel V) */}
        {/* ================================================== */}
        <section
          id="founder"
          className="space-y-8 md:space-y-10 animate-fade-in border-b border-brand-sand/30 pb-16 md:pb-24 scroll-mt-28"
        >
          {/* Two-Column Editorial Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* LEFT COLUMN: Founder Portrait & Identity directly below image */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-brand-light border border-brand-sand/30 shadow-md">
                {founderImgSrc && !founderImgError ? (
                  <img
                    src={founderImgSrc}
                    alt="Nandavel V — Founder & CEO, Qura Herbs"
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      if (e.currentTarget.src !== "/founder_nandavel.jpg") {
                        e.currentTarget.src = "/founder_nandavel.jpg";
                      } else {
                        setFounderImgError(true);
                      }
                    }}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 bg-gradient-to-b from-brand-light via-brand-cream to-brand-sand/20">
                    <div className="w-24 h-24 rounded-full bg-brand-dark text-brand-cream flex items-center justify-center font-serif text-3xl font-light tracking-wider shadow-inner border-2 border-brand-accent/40">
                      NV
                    </div>
                  </div>
                )}
              </div>

              {/* Name & Position directly below founder's image only */}
              <div className="pt-1 text-left space-y-1">
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-dark tracking-tight">
                  Nandavel V
                </h3>
                <p className="text-xs sm:text-sm font-sans tracking-widest text-brand-accent uppercase font-medium">
                  Founder &amp; CEO, Qura Herbs
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Founder Introduction, Story, & Quotation */}
            <div className="lg:col-span-7 space-y-6 pt-2 lg:pt-0">
              {/* Section Title & Editorial Header */}
              <div className="space-y-3 border-b border-brand-sand/30 pb-4">
                <span className="text-xs font-sans font-semibold tracking-[0.3em] text-brand-accent uppercase block">
                  SECTION 02 &bull; THE FOUNDER
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-[40px] font-light text-brand-dark tracking-tight">
                  Founder&apos;s Note
                </h2>
              </div>

              {/* Subtle Quote Mark Icon */}
              <div className="text-brand-accent/60">
                <svg
                  className="w-8 h-8 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Anchor Headline */}
              <h4 className="font-serif text-xl sm:text-2xl text-brand-dark font-medium leading-snug">
                Qura Herbs began with Nandavel&apos;s own skin journey.
              </h4>

              {/* Story Narrative */}
              <div className="space-y-4 text-brand-cocoa/90 font-sans font-light text-base md:text-lg leading-relaxed">
                <p>
                  Having experienced skin concerns himself, he understood the
                  insecurity and frustration that can come with trying to find
                  the right care. His personal experience with skincare and
                  herbal ingredients eventually inspired him to build something
                  that could reach people facing similar concerns.
                </p>
                <p>
                  His vision was simple, to make people feel more confident in
                  their own skin through better care, not through unrealistic
                  standards of beauty.
                </p>
                <p>
                  From understanding customer concerns and exploring ingredients
                  to selecting products and shaping the brand, Nandavel continues
                  to be closely involved in the foundation and direction of Qura
                  Herbs.
                </p>
              </div>

              {/* Quotation */}
              <div className="pt-6 border-t border-brand-sand/40">
                <blockquote className="font-serif text-lg sm:text-xl text-brand-dark font-light italic leading-relaxed pl-5 border-l-2 border-brand-accent">
                  &ldquo;Qura Herbs started with my own skin journey. I wanted to
                  bring that experience to people who were going through
                  something similar and help them feel more comfortable in their
                  own skin.&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* SECTION 03 — CO-FOUNDER SECTION (Pranavi GY) */}
        {/* ================================================== */}
        <section
          id="ceo"
          className="space-y-8 md:space-y-10 animate-fade-in border-b border-brand-sand/30 pb-16 md:pb-24 scroll-mt-28"
        >
          {/* Two-Column Editorial Layout (Alternating on Desktop, Image first on Mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* TEXT COLUMN: Co-Founder Story & Quotation (Left on Desktop, Below on Mobile) */}
            <div className="lg:col-span-7 space-y-6 pt-2 lg:pt-0 order-2 lg:order-1">
              {/* Section Title & Editorial Header */}
              <div className="space-y-3 border-b border-brand-sand/30 pb-4">
                <span className="text-xs font-sans font-semibold tracking-[0.3em] text-brand-accent uppercase block">
                  SECTION 03 &bull; CO-FOUNDER &amp; MD
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-[40px] font-light text-brand-dark tracking-tight">
                  Co-Founder&apos;s Note
                </h2>
              </div>

              {/* Subtle Quote Mark Icon */}
              <div className="text-brand-accent/60">
                <svg
                  className="w-8 h-8 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Anchor Headline */}
              <h4 className="font-serif text-xl sm:text-2xl text-brand-dark font-medium leading-snug">
                Pranavi believed everyone deserved to feel confident in their own
                skin.
              </h4>

              {/* Story Narrative */}
              <div className="space-y-4 text-brand-cocoa/90 font-sans font-light text-base md:text-lg leading-relaxed">
                <p>
                  As Qura Herbs continued to take shape, Pranavi became part of
                  the journey, bringing her own perspective, creativity, and
                  ideas to the brand.
                </p>
                <p>
                  With a strong eye for aesthetics, creativity, and
                  communication, Pranavi brings a distinct perspective to Qura
                  Herbs. As someone who genuinely values self-care, she believes
                  that taking care of your skin and yourself should be a
                  positive and empowering experience. Her ideas and creative
                  direction shape Qura&apos;s visual identity, presentation, and
                  voice, bringing this belief into the way the brand expresses
                  itself.
                </p>
              </div>

              {/* Quotation */}
              <div className="pt-6 border-t border-brand-sand/40">
                <blockquote className="font-serif text-lg sm:text-xl text-brand-dark font-light italic leading-relaxed pl-5 border-l-2 border-brand-accent">
                  &ldquo;For me, Qura is more than a business. It is a feeling that
                  deserves to be experienced, expressed, and carried
                  forward.&rdquo;
                </blockquote>
              </div>
            </div>

            {/* PORTRAIT COLUMN: Co-Founder Portrait & Identity directly below image (Right on Desktop, First on Mobile) */}
            <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-brand-light border border-brand-sand/30 shadow-md">
                {ceoImgSrc && !ceoImgError ? (
                  <img
                    src={ceoImgSrc}
                    alt="Pranavi GY — Co-Founder & MD, Qura Herbs"
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      if (e.currentTarget.src !== "/ceo_pranavi.jpg") {
                        e.currentTarget.src = "/ceo_pranavi.jpg";
                      } else {
                        setCeoImgError(true);
                      }
                    }}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 bg-gradient-to-b from-brand-light via-brand-cream to-brand-sand/20">
                    <div className="w-24 h-24 rounded-full bg-brand-accent text-brand-cream flex items-center justify-center font-serif text-3xl font-light tracking-wider shadow-inner border-2 border-brand-dark/20">
                      PG
                    </div>
                  </div>
                )}
              </div>

              {/* Name & Position directly below co-founder's image only */}
              <div className="pt-1 text-left space-y-1">
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-dark tracking-tight">
                  Pranavi GY
                </h3>
                <p className="text-xs sm:text-sm font-sans tracking-widest text-brand-accent uppercase font-medium">
                  Co-Founder &amp; MD, Qura Herbs
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* SECTION 04 — GROWING WITH PURPOSE */}
        {/* ================================================== */}
        <section
          id="purpose"
          className="space-y-8 animate-fade-in pb-8 scroll-mt-28"
        >
          {/* Section Eyebrow & Title */}
          <div className="border-b border-brand-sand/30 pb-4 text-center">
            <span className="text-xs font-sans font-semibold tracking-[0.3em] text-brand-accent uppercase block mb-1">
              SECTION 04 &bull; PURPOSE &amp; TRANSPARENCY
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-brand-dark uppercase tracking-wide">
              GROWING WITH PURPOSE
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <p className="text-base sm:text-lg md:text-xl text-brand-cocoa/90 font-sans font-light leading-relaxed">
              As an authorised reseller, we continue to grow through customer
              feedback, thoughtful product selection, and a commitment to
              presenting trusted skincare and haircare with transparency.
            </p>

            {/* Distinctive Philosophy Callout Banner */}
            <div className="bg-gradient-to-br from-brand-dark via-brand-cocoa to-brand-dark text-brand-cream p-8 sm:p-10 md:p-12 text-center rounded-sm shadow-xl space-y-4">
              <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-relaxed text-brand-cream">
                Beauty isn&apos;t about changing who you are. It&apos;s about caring
                for who you are.
              </p>
              <div className="w-16 h-[1px] bg-brand-accent/60 mx-auto"></div>
              <p className="text-xs font-sans tracking-[0.25em] text-brand-accent uppercase font-semibold">
                Qura Herbs &bull; Coimbatore - 2025
              </p>
            </div>
          </div>
        </section>

        {/* Footer Brand CTA */}
        <div className="text-center max-w-2xl mx-auto space-y-6 pt-8 border-t border-brand-sand/30">
          <p className="font-serif text-xl sm:text-2xl text-brand-dark font-light leading-relaxed italic">
            Skin That Feels Like You.
          </p>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block bg-brand-dark hover:bg-brand-accent text-brand-cream px-9 py-4 text-xs font-sans font-bold uppercase tracking-[0.25em] transition-colors duration-300 shadow-lg"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}

export default function AboutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-brand-cream text-brand-dark text-xs font-sans font-bold uppercase tracking-widest">
          Loading Qura Story...
        </div>
      }
    >
      <AboutPageContent />
    </Suspense>
  );
}
