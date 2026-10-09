"use client";

import { getApiUrl, getImageUrl } from "@/lib/api";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";
import Link from "next/link";
import { Leaf, UserCheck, Briefcase, Calendar, MapPin, Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";

function AboutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>("brand");

  const [aboutData, setAboutData] = useState<any>({
    subtitle: "OUR STORY",
    title: "Care That Begins With Understanding",
    hero_heading: "Care That Begins With Understanding",
    hero_paragraph1: `Founded on January 13, 2025, in Coimbatore, Tamil Nadu, India, Qura Herbs was created with a simple belief: skincare should begin with understanding, not comparison.

Every person has different skin, different concerns, and a different journey. That is why we believe there is no single routine that works for everyone. Qura Herbs focuses on creating purposeful skincare and haircare designed around real everyday concerns—with thoughtful formulations, botanical ingredients, and carefully selected active ingredients.`,
    hero_paragraph2: `But Qura is about more than what goes inside a bottle.

It is about listening to our customers, understanding their concerns, helping them build consistent routines, and being there throughout their journey. Every product, conversation, and experience is part of our effort to make personal care more intentional and easier to understand.

We are building Qura Herbs for people who want to care for their skin and hair without unrealistic standards or unnecessary promises.`,
    closing_statement: `Real concerns. Thoughtful care. Consistent routines.\n\nThat is the Qura way.`,
    hero_image: ""
  });

  const [founderData, setFounderData] = useState<any>({
    name: "Nandavel V",
    title: "Founder & CEO, Qura Herbs",
    image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/About/nandavel_founder.jpg",
    quote: "Build Qura Herbs with purpose. Grow it with people. And never lose the reason we started.",
    description: `Qura Herbs started with an idea that was personal to me: people deserve skincare that understands their concerns instead of making them feel like they need to change who they are.

When I started Qura Herbs on January 13, 2025, in Coimbatore, I didn't see it as simply starting another beauty brand. I wanted to build something that could genuinely connect with people, understand their individual skin and hair concerns, and become a trusted part of their everyday routine.

Being involved in Qura from the beginning has meant being part of everything—from understanding customer concerns and developing products to building the brand, creating content, managing operations, and listening to every piece of feedback we receive.

What means the most to me is not simply seeing Qura grow. It is seeing someone trust our brand, share their experience, and come back because they believe in what we are building.

There is still a long way to go, but the vision remains simple:`,
    signature: "— Nandavel V\nFounder & CEO, Qura Herbs"
  });

  const [ceoData, setCeoData] = useState<any>({
    name: "Pranavi G",
    title: "Chief Executive Officer, Qura Herbs",
    image: "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/About/ceo_pranavi.jpg",
    quote: "This is more than building a company for me. It is about building something I can be proud to put my name behind.",
    description: `For me, Qura Herbs is more than a business. It is something I genuinely care about building—one customer, one product, and one experience at a time.

As the CEO of Qura Herbs, I am closely involved in shaping the brand, understanding what our customers truly need, and making sure every part of their experience feels thoughtful and meaningful. I believe a beauty brand should listen before it speaks, understand before it promises, and always put people before trends.

What inspires me most is seeing Qura grow from an idea into a brand that people choose to bring into their everyday routines. Every message from a customer, every piece of feedback, and every small milestone reminds me why we started.

I want Qura Herbs to be a brand that feels personal—not distant or overly complicated. A brand that people can trust, relate to, and grow with.`,
    signature: "— Pranavi G\nChief Executive Officer, Qura Herbs"
  });

  const [founderImgError, setFounderImgError] = useState<boolean>(false);
  const [ceoImgError, setCeoImgError] = useState<boolean>(false);
  const [brandImgError, setBrandImgError] = useState<boolean>(false);

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
            image: data.image || data.ceo_image || prev.image || "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/About/ceo_pranavi.jpg"
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
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
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
      threshold: 0
    });

    const sections = ["brand", "founder", "ceo"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Handle initial tab scroll from URL query param if present
  useEffect(() => {
    if (tabParam && ["brand", "founder", "ceo"].includes(tabParam)) {
      setActiveTab(tabParam);
      const timer = setTimeout(() => {
        const element = document.getElementById(tabParam);
        if (element) {
          const offset = 120;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [tabParam]);

  const founderImgSrc = (founderData.image || founderData.founder_image) ? getImageUrl(founderData.image || founderData.founder_image) : "";
  const ceoImgSrc = (ceoData.image || ceoData.ceo_image) ? getImageUrl(ceoData.image || ceoData.ceo_image) : "/ceo_pranavi.jpg";
  const brandImgSrc = (aboutData.hero_image || aboutData.image) ? getImageUrl(aboutData.hero_image || aboutData.image) : "";

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark font-sans selection:bg-brand-accent/20">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16 md:space-y-24">
        
        {/* Editorial Header */}
        <header className="text-center space-y-4 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-brand-light border border-brand-sand/40 rounded-full text-[11px] font-sans font-semibold text-brand-accent tracking-[0.25em] uppercase">
            <span>OUR STORY & LEADERSHIP</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-brand-dark tracking-tight leading-tight">
            The World of Qura Herbs
          </h1>
          <p className="text-xs sm:text-sm text-brand-cocoa/70 font-sans tracking-widest uppercase font-light">
            Coimbatore, Tamil Nadu &bull; Founded January 13, 2025
          </p>
          <div className="w-16 h-[1px] bg-brand-accent/40 mx-auto pt-1"></div>
        </header>

        {/* 3 Story Navigation Tabs */}
        <nav className="sticky top-20 sm:top-24 z-30 flex justify-center items-center gap-1.5 sm:gap-3 bg-brand-light/95 p-1.5 sm:p-2 border border-brand-sand/40 rounded-full max-w-xl mx-auto shadow-sm backdrop-blur-md transition-all">
          <button
            type="button"
            onClick={() => scrollToSection("brand")}
            className={`px-3.5 sm:px-6 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
              activeTab === "brand"
                ? "bg-brand-dark text-brand-cream shadow-md"
                : "text-brand-dark/70 hover:text-brand-dark hover:bg-brand-sand/20"
            }`}
          >
            <Leaf size={14} className="text-brand-accent shrink-0" />
            <span>Brand Story</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("founder")}
            className={`px-3.5 sm:px-6 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
              activeTab === "founder"
                ? "bg-brand-dark text-brand-cream shadow-md"
                : "text-brand-dark/70 hover:text-brand-dark hover:bg-brand-sand/20"
            }`}
          >
            <UserCheck size={14} className="text-brand-accent shrink-0" />
            <span>The Founder</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("ceo")}
            className={`px-3.5 sm:px-6 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
              activeTab === "ceo"
                ? "bg-brand-dark text-brand-cream shadow-md"
                : "text-brand-dark/70 hover:text-brand-dark hover:bg-brand-sand/20"
            }`}
          >
            <Briefcase size={14} className="text-brand-accent shrink-0" />
            <span>The CEO</span>
          </button>
        </nav>

        {/* ================================================== */}
        {/* SECTION 01 — ABOUT QURA HERBS (Brand Story) */}
        {/* ================================================== */}
        <section id="brand" className="space-y-10 animate-fade-in border-b border-brand-sand/30 pb-16 md:pb-24 scroll-mt-28">
          
          {/* Section Eyebrow & Title */}
          <div className="flex items-center justify-between border-b border-brand-sand/30 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-sans font-semibold tracking-[0.3em] text-brand-accent uppercase block">
                SECTION 01 &bull; OUR STORY
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-brand-dark">
                Care That Begins With Understanding
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-brand-cocoa/60 uppercase tracking-widest bg-brand-light px-3 py-1.5 border border-brand-sand/30 rounded-sm">
              <Calendar size={13} className="text-brand-accent" />
              <span>Est. Jan 13, 2025</span>
            </div>
          </div>

          {/* Editorial Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* LEFT COLUMN: Narrative Story Content */}
            <div className="lg:col-span-7 space-y-6 text-brand-cocoa/90 font-sans font-light text-base md:text-lg leading-relaxed">
              <p>
                Founded on <span className="font-normal text-brand-dark border-b border-brand-accent/50 pb-0.5">January 13, 2025</span>, in Coimbatore, Tamil Nadu, India, Qura Herbs was created with a simple belief: skincare should begin with understanding, not comparison.
              </p>
              <p>
                Every person has different skin, different concerns, and a different journey. That is why we believe there is no single routine that works for everyone. Qura Herbs focuses on creating purposeful skincare and haircare designed around real everyday concerns—with thoughtful formulations, botanical ingredients, and carefully selected active ingredients.
              </p>
              
              <div className="py-2">
                <p className="font-serif text-xl md:text-2xl text-brand-dark font-normal italic border-l-2 border-brand-accent pl-5">
                  &ldquo;But Qura is about more than what goes inside a bottle.&rdquo;
                </p>
              </div>

              <p>
                It is about listening to our customers, understanding their concerns, helping them build consistent routines, and being there throughout their journey. Every product, conversation, and experience is part of our effort to make personal care more intentional and easier to understand.
              </p>
              <p>
                We are building Qura Herbs for people who want to care for their skin and hair without unrealistic standards or unnecessary promises.
              </p>

              {/* Closing Signature Statement */}
              <div className="mt-8 bg-brand-light border-l-4 border-brand-accent p-6 md:p-8 rounded-r-md shadow-sm space-y-3">
                <p className="font-serif text-xl md:text-2xl text-brand-dark font-light leading-relaxed">
                  Real concerns. Thoughtful care. Consistent routines.
                </p>
                <p className="font-sans text-xs uppercase font-bold tracking-[0.25em] text-brand-accent">
                  That is the Qura way.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Brand Philosophy & Storytelling Visual Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-brand-dark text-brand-cream p-8 md:p-10 space-y-8 rounded-sm shadow-xl relative overflow-hidden">
                {/* Delicate background watermark accent */}
                <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-brand-cream">
                  <Leaf size={240} />
                </div>

                <div className="space-y-3 border-b border-brand-cream/15 pb-6">
                  <span className="text-[11px] tracking-[0.25em] font-sans font-semibold text-brand-accent uppercase block">
                    THE QURA FOUNDATION
                  </span>
                  <h3 className="font-serif text-2xl font-light leading-snug">
                    Purposeful Care & Intentional Routines
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-full bg-brand-cream/10 flex items-center justify-center text-brand-accent shrink-0 border border-brand-cream/20 mt-0.5">
                      <MapPin size={18} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-base text-brand-cream font-medium">Origin & Roots</h4>
                      <p className="text-xs text-brand-cream/75 font-sans leading-relaxed">
                        Founded in Coimbatore, Tamil Nadu, India on January 13, 2025. Inspired by rich botanical heritage and real customer needs.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-full bg-brand-cream/10 flex items-center justify-center text-brand-accent shrink-0 border border-brand-cream/20 mt-0.5">
                      <Sparkles size={18} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-base text-brand-cream font-medium">Thoughtful Formulations</h4>
                      <p className="text-xs text-brand-cream/75 font-sans leading-relaxed">
                        Combining botanical extracts with targeted active ingredients, created around individual skin & hair concerns.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-full bg-brand-cream/10 flex items-center justify-center text-brand-accent shrink-0 border border-brand-cream/20 mt-0.5">
                      <HeartHandshake size={18} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-base text-brand-cream font-medium">Listening First</h4>
                      <p className="text-xs text-brand-cream/75 font-sans leading-relaxed">
                        No single routine works for everyone. We listen, guide, and support your personal journey without unrealistic promises.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Optional uploaded image display if available */}
                {brandImgSrc && !brandImgError && (
                  <div className="pt-2">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm border border-brand-cream/20">
                      <img
                        src={brandImgSrc}
                        alt="Qura Herbs Brand"
                        className="w-full h-full object-cover"
                        onError={() => setBrandImgError(true)}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-brand-cream/15 text-center">
                  <p className="text-[11px] font-sans text-brand-accent tracking-widest uppercase font-medium">
                    Understanding over comparison &bull; Qura Herbs
                  </p>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* ================================================== */}
        {/* SECTION 02 — MEET OUR FOUNDER (Nandavel V) */}
        {/* ================================================== */}
        <section id="founder" className="space-y-10 animate-fade-in border-b border-brand-sand/30 pb-16 md:pb-24 scroll-mt-28">
          
          {/* Section Eyebrow & Title */}
          <div className="border-b border-brand-sand/30 pb-4">
            <span className="text-xs font-sans font-semibold tracking-[0.3em] text-brand-accent uppercase block">
              SECTION 02 &bull; THE FOUNDER
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-brand-dark">
              Meet Our Founder
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* LEFT COLUMN: Founder Image or Refined Profile Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-light border border-brand-sand/40 rounded-sm shadow-lg flex flex-col justify-between p-6">
                {founderImgSrc && !founderImgError ? (
                  <img
                    src={founderImgSrc}
                    alt="Nandavel V — Founder & CEO"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => setFounderImgError(true)}
                  />
                ) : (
                  /* Refined Editorial Profile Placeholder Area (No fake stock images generated) */
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 bg-gradient-to-b from-brand-light via-brand-cream to-brand-sand/20">
                    <div className="w-24 h-24 rounded-full bg-brand-dark text-brand-cream flex items-center justify-center font-serif text-3xl font-light tracking-wider shadow-inner border-2 border-brand-accent/40">
                      NV
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif text-2xl text-brand-dark font-medium">Nandavel V</p>
                      <p className="text-xs font-sans tracking-[0.2em] text-brand-accent uppercase font-semibold">
                        Founder & CEO, Qura Herbs
                      </p>
                    </div>
                    <div className="w-12 h-[1px] bg-brand-accent/40 my-2"></div>
                    <p className="text-xs font-sans text-brand-cocoa/70 italic max-w-xs">
                      Coimbatore, Tamil Nadu &bull; Est. Jan 13, 2025
                    </p>
                  </div>
                )}

                {/* Profile Overlay Badge when photo is present */}
                {founderImgSrc && !founderImgError && (
                  <div className="relative z-10 mt-auto bg-brand-cream/95 backdrop-blur-sm border border-brand-sand/50 p-4 text-center shadow-md">
                    <p className="font-serif text-xl text-brand-dark font-medium">Nandavel V</p>
                    <p className="text-[11px] tracking-widest text-brand-accent uppercase font-sans mt-0.5 font-semibold">
                      Founder & CEO, Qura Herbs
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-brand-light p-4 border border-brand-sand/30 text-center space-y-1 rounded-sm">
                <p className="font-serif text-xs font-medium text-brand-dark">Origin & Ownership</p>
                <p className="text-[11px] text-brand-cocoa/70 font-sans">
                  Founded Qura Herbs on January 13, 2025 in Coimbatore
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Personal Founder Story & Manifesto */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Founder Headline */}
              <div className="space-y-2">
                <h3 className="font-serif text-2xl md:text-3xl text-brand-dark font-light leading-snug">
                  Nandavel V
                </h3>
                <p className="text-xs font-sans font-semibold text-brand-accent uppercase tracking-[0.2em]">
                  Founder & CEO, Qura Herbs
                </p>
              </div>

              {/* Founder Copy */}
              <div className="space-y-5 text-brand-cocoa/90 font-sans font-light text-base leading-relaxed">
                <p>
                  Qura Herbs started with an idea that was personal to me: people deserve skincare that understands their concerns instead of making them feel like they need to change who they are.
                </p>
                <p>
                  When I started Qura Herbs on January 13, 2025, in Coimbatore, I didn't see it as simply starting another beauty brand. I wanted to build something that could genuinely connect with people, understand their individual skin and hair concerns, and become a trusted part of their everyday routine.
                </p>
                <p>
                  Being involved in Qura from the beginning has meant being part of everything—from understanding customer concerns and developing products to building the brand, creating content, managing operations, and listening to every piece of feedback we receive.
                </p>
                <p>
                  What means the most to me is not simply seeing Qura grow. It is seeing someone trust our brand, share their experience, and come back because they believe in what we are building.
                </p>
                <p className="font-medium text-brand-dark">
                  There is still a long way to go, but the vision remains simple:
                </p>
              </div>

              {/* Visually Distinctive Closing Manifesto */}
              <div className="bg-gradient-to-br from-brand-light via-brand-cream to-brand-sand/30 border border-brand-accent/30 border-l-4 border-l-brand-accent p-6 md:p-8 rounded-r-md shadow-sm space-y-4">
                <p className="font-serif text-xl sm:text-2xl text-brand-dark font-light leading-relaxed italic">
                  &ldquo;Build Qura Herbs with purpose. Grow it with people. And never lose the reason we started.&rdquo;
                </p>
                
                <div className="pt-2 border-t border-brand-sand/40 flex items-center justify-between">
                  <div>
                    <p className="font-serif text-sm font-medium text-brand-dark">— Nandavel V</p>
                    <p className="text-[10px] font-sans tracking-widest text-brand-accent uppercase">
                      Founder & CEO, Qura Herbs
                    </p>
                  </div>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-brand-cocoa/50">
                    Founder Manifesto
                  </span>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* ================================================== */}
        {/* SECTION 03 — MEET OUR CEO (Pranavi G) */}
        {/* ================================================== */}
        <section id="ceo" className="space-y-10 animate-fade-in pb-8 scroll-mt-28">
          
          {/* Section Eyebrow & Title */}
          <div className="border-b border-brand-sand/30 pb-4">
            <span className="text-xs font-sans font-semibold tracking-[0.3em] text-brand-accent uppercase block">
              SECTION 03 &bull; THE CEO
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-brand-dark">
              Meet Our CEO
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* LEFT COLUMN: CEO Narrative Story */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              
              {/* CEO Headline */}
              <div className="space-y-2">
                <h3 className="font-serif text-2xl md:text-3xl text-brand-dark font-light leading-snug">
                  Pranavi G
                </h3>
                <p className="text-xs font-sans font-semibold text-brand-accent uppercase tracking-[0.2em]">
                  Chief Executive Officer, Qura Herbs
                </p>
              </div>

              {/* CEO Story Copy */}
              <div className="space-y-5 text-brand-cocoa/90 font-sans font-light text-base leading-relaxed">
                <p>
                  For me, Qura Herbs is more than a business. It is something I genuinely care about building—one customer, one product, and one experience at a time.
                </p>
                <p>
                  As the CEO of Qura Herbs, I am closely involved in shaping the brand, understanding what our customers truly need, and making sure every part of their experience feels thoughtful and meaningful. I believe a beauty brand should listen before it speaks, understand before it promises, and always put people before trends.
                </p>
                <p>
                  What inspires me most is seeing Qura grow from an idea into a brand that people choose to bring into their everyday routines. Every message from a customer, every piece of feedback, and every small milestone reminds me why we started.
                </p>
                <p>
                  I want Qura Herbs to be a brand that feels personal—not distant or overly complicated. A brand that people can trust, relate to, and grow with.
                </p>
              </div>

              {/* Visually Emphasized Closing CEO Statement */}
              <div className="bg-brand-dark text-brand-cream p-6 md:p-8 rounded-sm shadow-xl space-y-4">
                <p className="font-serif text-xl sm:text-2xl font-light leading-relaxed">
                  &ldquo;This is more than building a company for me. It is about building something I can be proud to put my name behind.&rdquo;
                </p>
                
                <div className="pt-3 border-t border-brand-cream/15 flex items-center justify-between">
                  <div>
                    <p className="font-serif text-sm font-medium text-brand-cream">— Pranavi G</p>
                    <p className="text-[10px] font-sans tracking-widest text-brand-accent uppercase">
                      Chief Executive Officer, Qura Herbs
                    </p>
                  </div>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-brand-cream/50">
                    Leadership Commitment
                  </span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: CEO Image or Refined Executive Profile Card */}
            <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-light border border-brand-sand/40 rounded-sm shadow-lg flex flex-col justify-between p-6">
                {ceoImgSrc && !ceoImgError ? (
                  <img
                    src={ceoImgSrc}
                    alt="Pranavi G — Chief Executive Officer"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      if (e.currentTarget.src !== "/ceo_pranavi.jpg") {
                        e.currentTarget.src = "/ceo_pranavi.jpg";
                      } else {
                        setCeoImgError(true);
                      }
                    }}
                  />
                ) : (
                  /* Refined CEO Profile Placeholder Area */
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 bg-gradient-to-b from-brand-light via-brand-cream to-brand-sand/20">
                    <div className="w-24 h-24 rounded-full bg-brand-accent text-brand-cream flex items-center justify-center font-serif text-3xl font-light tracking-wider shadow-inner border-2 border-brand-dark/20">
                      PG
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif text-2xl text-brand-dark font-medium">Pranavi G</p>
                      <p className="text-xs font-sans tracking-[0.2em] text-brand-accent uppercase font-semibold">
                        Chief Executive Officer
                      </p>
                      <p className="text-[11px] font-sans tracking-widest text-brand-cocoa/70 uppercase">
                        Qura Herbs
                      </p>
                    </div>
                    <div className="w-12 h-[1px] bg-brand-accent/40 my-2"></div>
                    <p className="text-xs font-sans text-brand-cocoa/70 italic max-w-xs">
                      Executive Leadership & Brand Strategy
                    </p>
                  </div>
                )}

                {/* Overlay Badge when CEO photo is uploaded */}
                {ceoImgSrc && !ceoImgError && (
                  <div className="relative z-10 mt-auto bg-brand-cream/95 backdrop-blur-sm border border-brand-sand/50 p-4 text-center shadow-md">
                    <p className="font-serif text-xl text-brand-dark font-medium">Pranavi G</p>
                    <p className="text-[11px] tracking-widest text-brand-accent uppercase font-sans mt-0.5 font-semibold">
                      Chief Executive Officer, Qura Herbs
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-brand-light p-4 border border-brand-sand/30 text-center space-y-1 rounded-sm">
                <p className="font-serif text-xs font-medium text-brand-dark">Executive Leadership</p>
                <p className="text-[11px] text-brand-cocoa/70 font-sans">
                  Building a customer-first beauty brand with intention
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* Footer Brand CTA */}
        <div className="text-center max-w-2xl mx-auto space-y-6 pt-8 border-t border-brand-sand/30">
          <p className="font-serif text-xl text-brand-dark font-light leading-relaxed">
            Real concerns. Thoughtful care. Consistent routines.
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
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-brand-cream text-brand-dark text-xs font-sans font-bold uppercase tracking-widest">
        Loading Qura Story...
      </div>
    }>
      <AboutPageContent />
    </Suspense>
  );
}
