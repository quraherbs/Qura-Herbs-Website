"use client";

import { useEffect, useState } from "react";
import { getApiV1Base } from "@/lib/api";
import { 
  BarChart3, Box, Folders, ShoppingBag, Star, 
  BookOpen, AlertCircle, Settings, 
  TrendingUp, Trash2, Check, X, ShieldAlert, LogOut, Plus, Edit3,
  Smartphone, Monitor, Upload, Mail, RefreshCw, Clock, CheckCircle2, XCircle,
  Tag, Printer, Download, UserCheck, MapPin, CreditCard, FileText, PlusCircle, Users,
  Image, LayoutTemplate, Sliders, Truck, Search, Sparkles, ExternalLink
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  SKU: string;
  stock: number;
  category_id?: number;
  category_ids?: number[];
  categories?: Category[];
  skin_type: string;
  short_description: string;
  full_description: string;
  ingredients?: string;
  benefits?: string;
  how_to_use?: string;
  thumbnail?: string;
  product_images?: string[];
  featured?: boolean;
  active?: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  active?: boolean;
  display_order?: number;
}

interface Order {
  id: number;
  order_number: string;
  total: number;
  subtotal?: number;
  shipping?: number;
  payment_status: string;
  order_status: string;
  tracking_number: string | null;
  payment_confirmed_at?: string | null;
  payment_confirmed_by?: string | null;
  created_at: string;
  customer_id?: number;
  customer?: any;
  items?: any[];
}

interface OfferItem {
  id?: number;
  name: string;
  code: string;
  description?: string;
  offer_type: string;
  discount_value: number;
  minimum_order_value: number;
  maximum_discount?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  usage_limit?: number | null;
  used_count?: number;
  per_customer_limit?: number;
  first_order_only?: boolean;
  exclude_sale_products?: boolean;
  active?: boolean;
}

interface Review {
  id: number;
  product_id: number;
  rating: number;
  review: string;
  approved: boolean;
  featured: boolean;
  customer_id: number;
  customer_name?: string;
  product_name?: string;
  customer_email?: string;
  image?: string;
  verified_purchase?: boolean;
  created_at?: string;
}

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published: boolean;
  published_at?: string;
  featured_image?: string;
  meta_description?: string;
}

function ProductDescriptionTool({
  label,
  value,
  onChange,
  rows = 4,
  required = false,
  placeholder = "Write product details...",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const insertText = (textToInsert: string) => {
    if (!value) {
      onChange(textToInsert);
    } else {
      onChange(value + (value.endsWith("\n") ? "" : "\n") + textToInsert);
    }
  };

  const renderPreview = (text: string) => {
    if (!text) return <p className="text-slate-500 italic text-xs p-3">No description content entered yet.</p>;
    const lines = text.split("\n");
    return (
      <div className="bg-[#FDFBF7] border border-[#EFE8D8] p-4 text-[#3D261D] font-sans text-xs space-y-2 rounded shadow-inner">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;
          if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
            return (
              <h5 key={idx} className="font-serif text-sm font-semibold text-[#2C1A14] pt-2 pb-0.5 border-b border-[#EFE8D8]">
                {trimmed.replace(/^#+\s*/, "")}
              </h5>
            );
          }
          if (trimmed.startsWith("•") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            return (
              <div key={idx} className="flex items-start space-x-1.5 pl-1 my-0.5">
                <span className="text-[#A47148] font-bold">•</span>
                <span>{trimmed.replace(/^[\•\-\*]\s*/, "")}</span>
              </div>
            );
          }
          return <p key={idx} className="leading-relaxed text-[#3D261D]/90 my-0.5">{trimmed}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="border border-slate-800 bg-slate-950 p-3 space-y-2 rounded">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-blue-400 font-bold text-[10px] uppercase tracking-widest">{label}</span>
          {required && <span className="text-red-400 text-[10px]">*</span>}
        </div>
        <div className="flex space-x-1 bg-slate-900 border border-slate-800 p-0.5 rounded text-[9px]">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-2.5 py-1 font-bold uppercase rounded transition-all ${
              activeTab === "write" ? "bg-blue-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ✏️ Write Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-2.5 py-1 font-bold uppercase rounded transition-all ${
              activeTab === "preview" ? "bg-blue-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            👁️ Store Live Preview
          </button>
        </div>
      </div>

      {activeTab === "write" ? (
        <div className="space-y-2">
          {/* Quick Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mr-1">Formatting:</span>
            <button
              type="button"
              onClick={() => insertText("**Bold Heading or Term**")}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] rounded border border-slate-700"
              title="Add Bold Text"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => insertText("*Italicized herbal note*")}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 italic text-[10px] rounded border border-slate-700"
              title="Add Italic Text"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => insertText("### Section Title")}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] rounded border border-slate-700"
              title="Add Heading"
            >
              H3 Header
            </button>
            <button
              type="button"
              onClick={() => insertText("• Key feature bullet item")}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] rounded border border-slate-700"
              title="Add Bullet Point"
            >
              • Bullet List
            </button>

            <div className="h-3 w-[1px] bg-slate-800 mx-1" />

            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mr-1">Presets:</span>
            <button
              type="button"
              onClick={() => insertText("### Key Formula Highlights\n• High-potency organic botanical extract\n• Protects and restores skin moisture barrier\n• Non-greasy, fast-absorbing texture")}
              className="px-2 py-0.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold text-[10px] rounded border border-blue-500/30"
            >
              + Highlights Template
            </button>
            <button
              type="button"
              onClick={() => insertText("### Clinical Purity & Ethos\nFormulated with 100% pure plant actives. Free from parabens, sulfates, mineral oils, and synthetic colorants.")}
              className="px-2 py-0.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold text-[10px] rounded border border-blue-500/30"
            >
              + Purity Ethos Template
            </button>
            <button
              type="button"
              onClick={() => insertText("### Daily Ritual Guide\n• Apply 2-3 drops to clean damp skin\n• Massage upward in circular motions\n• Follow with sunscreen during daytime")}
              className="px-2 py-0.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold text-[10px] rounded border border-blue-500/30"
            >
              + Ritual Steps Template
            </button>
          </div>

          <textarea
            required={required}
            rows={rows}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 p-2.5 text-slate-100 text-xs focus:outline-none focus:border-blue-500/50 rounded font-mono leading-relaxed"
          />
        </div>
      ) : (
        <div className="space-y-1">
          <span className="text-[9px] uppercase tracking-widest text-slate-400 block font-semibold">Store Page Rendering Preview:</span>
          {renderPreview(value)}
        </div>
      )}
    </div>
  );
}

function parseProductDescriptionAI(rawText: string) {
  const result = {
    short_description: "",
    full_description: "",
    benefits: "",
    ingredients: "",
    how_to_use: "",
    skin_type: "",
  };

  if (!rawText || !rawText.trim()) return result;

  const lines = rawText.split("\n");
  let currentSection: "description" | "benefits" | "ingredients" | "how_to_use" | "skin_type" = "description";

  const descriptionLines: string[] = [];
  const benefitsLines: string[] = [];
  const ingredientsLines: string[] = [];
  const howToUseLines: string[] = [];
  const skinTypeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentSection === "description" && descriptionLines.length > 0) {
        descriptionLines.push("");
      }
      continue;
    }

    if (/^\s*(?:key\s*)?(?:product\s*)?(?:benefits|features|why\s*you\s*will\s*love\s*it|results|what\s*it\s*does|highlights|key\s*highlights|benefits\s*&\s*uses|uses|advantages)[:\s\-]*$/i.test(trimmed) || /^(?:benefits|key benefits|highlights):/i.test(trimmed)) {
      currentSection = "benefits";
      const inline = trimmed.replace(/^(?:benefits|key benefits|highlights|key product benefits|why you will love it|results)[:\s\-]*/i, "").trim();
      if (inline) benefitsLines.push(inline);
      continue;
    }

    if (/^\s*(?:pure\s*)?(?:key\s*)?(?:active\s*)?(?:ingredients|formula|composition|inci|contains|extracts|key\s*actives)[:\s\-]*$/i.test(trimmed) || /^(?:ingredients|key ingredients|pure ingredients|formula):/i.test(trimmed)) {
      currentSection = "ingredients";
      const inline = trimmed.replace(/^(?:ingredients|key ingredients|pure ingredients|formula|inci|composition)[:\s\-]*/i, "").trim();
      if (inline) ingredientsLines.push(inline);
      continue;
    }

    if (/^\s*(?:how\s*to\s*use|how\s*to\s*ritual|directions|usage|application|suggested\s*use|ritual|application\s*steps|how\s*to\s*apply)[:\s\-]*$/i.test(trimmed) || /^(?:how to use|directions|usage|ritual):/i.test(trimmed)) {
      currentSection = "how_to_use";
      const inline = trimmed.replace(/^(?:how to use|directions|usage|ritual|application)[:\s\-]*/i, "").trim();
      if (inline) howToUseLines.push(inline);
      continue;
    }

    if (/^\s*(?:skin\s*type|suitable\s*for|recommended\s*for|target\s*skin)[:\s\-]*$/i.test(trimmed) || /^(?:skin type|suitable for):/i.test(trimmed)) {
      currentSection = "skin_type";
      const inline = trimmed.replace(/^(?:skin type|suitable for|recommended for)[:\s\-]*/i, "").trim();
      if (inline) skinTypeLines.push(inline);
      continue;
    }

    if (/^\s*(?:full\s*)?(?:editorial\s*)?(?:description|overview|story|about\s*the\s*product|details)[:\s\-]*$/i.test(trimmed)) {
      currentSection = "description";
      const inline = trimmed.replace(/^(?:description|overview|story|about the product)[:\s\-]*/i, "").trim();
      if (inline) descriptionLines.push(inline);
      continue;
    }

    if (currentSection === "benefits") {
      benefitsLines.push(trimmed);
    } else if (currentSection === "ingredients") {
      ingredientsLines.push(trimmed);
    } else if (currentSection === "how_to_use") {
      howToUseLines.push(trimmed);
    } else if (currentSection === "skin_type") {
      skinTypeLines.push(trimmed);
    } else {
      descriptionLines.push(trimmed);
    }
  }

  // Fallback heuristics if no section headers were present
  if (benefitsLines.length === 0 && ingredientsLines.length === 0 && howToUseLines.length === 0) {
    const remainingDescription: string[] = [];
    for (const l of descriptionLines) {
      const t = l.trim();
      if (!t) continue;

      if (/^(?:apply|massage|smooth|pump|rinse|wash|use\s+daily|step\s+\d)/i.test(t)) {
        howToUseLines.push(t);
      } else if (t.includes(",") && (/\b(extract|oil|water|acid|butter|juice|leaf|seed|root|hyaluronic|saffron|turmeric|tea tree|neem|aloe|glycerin|vitamin)\b/i.test(t))) {
        ingredientsLines.push(t);
      } else if (/^[•\-\*]/.test(t) || /^\d+[\.\)]/.test(t)) {
        benefitsLines.push(t);
      } else {
        remainingDescription.push(t);
      }
    }
    result.full_description = remainingDescription.join("\n").trim();
  } else {
    result.full_description = descriptionLines.join("\n").trim();
  }

  result.benefits = benefitsLines.join("\n").trim();
  result.ingredients = ingredientsLines.join("\n").trim();
  result.how_to_use = howToUseLines.join("\n").trim();
  result.skin_type = skinTypeLines.join(" ").trim();

  if (result.full_description) {
    const firstSentence = result.full_description.split(/(?<=[.!?])\s+/)[0];
    result.short_description = firstSentence || result.full_description.substring(0, 140);
  } else if (result.benefits) {
    result.short_description = result.benefits.split("\n")[0].replace(/^[\•\-\*]\s*/, "");
  }

  return result;
}

function SmartDescriptionParserBox({
  onParse,
}: {
  onParse: (parsed: {
    short_description?: string;
    full_description?: string;
    benefits?: string;
    ingredients?: string;
    how_to_use?: string;
    skin_type?: string;
  }) => void;
}) {
  const [rawText, setRawText] = useState("");
  const [isParsed, setIsParsed] = useState(false);
  const [extractedStats, setExtractedStats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleParse = async () => {
    if (!rawText.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/admin/parse-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: rawText }),
      });

      let parsed: any;
      if (res.ok) {
        parsed = await res.json();
      } else {
        parsed = parseProductDescriptionAI(rawText);
      }

      onParse(parsed);

      const fields: string[] = [];
      if (parsed.short_description) fields.push("Short Summary");
      if (parsed.full_description) fields.push("Editorial Story");
      if (parsed.benefits) fields.push("Key Benefits");
      if (parsed.ingredients) fields.push("Pure Ingredients");
      if (parsed.how_to_use) fields.push("How to Ritual");
      if (parsed.skin_type) fields.push("Skin Type");

      setExtractedStats(fields);
      setIsParsed(true);
    } catch (err) {
      const parsed = parseProductDescriptionAI(rawText);
      onParse(parsed);
      const fields: string[] = [];
      if (parsed.short_description) fields.push("Short Summary");
      if (parsed.full_description) fields.push("Editorial Story");
      if (parsed.benefits) fields.push("Key Benefits");
      if (parsed.ingredients) fields.push("Pure Ingredients");
      if (parsed.how_to_use) fields.push("How to Ritual");
      if (parsed.skin_type) fields.push("Skin Type");

      setExtractedStats(fields);
      setIsParsed(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-span-2 bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/40 p-4 rounded space-y-3 shadow-xl">
      <div className="flex justify-between items-center border-b border-blue-500/20 pb-2.5">
        <div className="flex items-center space-x-2">
          <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
            ✨ AI SINGLE COPY-PASTE
          </span>
          <div>
            <span className="text-blue-200 font-bold text-xs uppercase tracking-widest block">
              SMART PRODUCT DESCRIPTION PARSER & AUTO-SEPARATER
            </span>
            <span className="text-[10px] text-slate-400">
              Paste complete raw product text here (description, benefits, ingredients, usage). AI will parse and auto-separate all fields instantly!
            </span>
          </div>
        </div>
        {isParsed && extractedStats.length > 0 && (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded text-[10px] font-bold font-mono">
            ✓ Auto-Separated {extractedStats.length} Fields
          </span>
        )}
      </div>

      <div className="space-y-2">
        <textarea
          rows={4}
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            setIsParsed(false);
          }}
          placeholder="Paste raw text here... Example:
Experience luxury skincare infused with Kashmiri Saffron and Sandalwood.

BENEFITS:
• Reduces dark spots and hyperpigmentation
• Restores lit-from-within glow

INGREDIENTS:
Kashmiri Saffron, Wild Turmeric, Sandalwood Oil, Hyaluronic Acid

HOW TO USE:
Apply 3-4 drops to cleansed face morning and evening."
          className="w-full bg-slate-950/90 border border-slate-700 p-3 text-slate-100 text-xs font-mono focus:outline-none focus:border-blue-400 rounded transition-all placeholder:text-slate-600 leading-relaxed"
        />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleParse}
              disabled={!rawText.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded flex items-center space-x-2 shadow-md transition-all uppercase tracking-wider cursor-pointer"
            >
              <span>{isLoading ? "Analyzing..." : "✨ AI Parse & Auto-Separate All Fields"}</span>
            </button>
            {rawText && (
              <button
                type="button"
                onClick={() => {
                  setRawText("");
                  setIsParsed(false);
                  setExtractedStats([]);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded uppercase tracking-wider font-semibold border border-slate-700"
              >
                Clear Box
              </button>
            )}
          </div>

          {isParsed && extractedStats.length > 0 && (
            <div className="text-[10px] text-slate-400 font-sans">
              <span className="text-emerald-400 font-bold">Populated: </span>
              <span>{extractedStats.join(" • ")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SingleCopyPasteDescriptionEditor({
  productData,
  onChange,
}: {
  productData: {
    short_description: string;
    full_description: string;
    benefits?: string;
    ingredients?: string;
    how_to_use?: string;
  };
  onChange: (updated: {
    short_description: string;
    full_description: string;
    benefits?: string;
    ingredients?: string;
    how_to_use?: string;
  }) => void;
}) {
  const getInitialCombinedText = () => {
    const parts: string[] = [];
    if (productData.full_description) parts.push(productData.full_description);
    if (productData.benefits && !productData.full_description?.includes("BENEFITS:")) {
      parts.push(`BENEFITS:\n${productData.benefits}`);
    }
    if (productData.ingredients && !productData.full_description?.includes("INGREDIENTS:")) {
      parts.push(`INGREDIENTS:\n${productData.ingredients}`);
    }
    if (productData.how_to_use && !productData.full_description?.includes("HOW TO USE:")) {
      parts.push(`HOW TO USE:\n${productData.how_to_use}`);
    }
    return parts.join("\n\n").trim();
  };

  const [rawText, setRawText] = useState(getInitialCombinedText());
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    const combined = getInitialCombinedText();
    setRawText(combined);
  }, [productData.full_description, productData.benefits, productData.ingredients, productData.how_to_use]);

  const handleTextChange = (text: string) => {
    setRawText(text);
    const parsed = parseProductDescriptionAI(text);
    onChange({
      short_description: productData.short_description || parsed.short_description || "",
      full_description: parsed.full_description || text,
      benefits: parsed.benefits || "",
      ingredients: parsed.ingredients || "",
      how_to_use: parsed.how_to_use || "",
    });
  };

  const insertSnippet = (snippet: string) => {
    const newText = rawText ? rawText + (rawText.endsWith("\n") ? "" : "\n\n") + snippet : snippet;
    handleTextChange(newText);
  };

  const updateFields = (patch: Partial<typeof productData>) => {
    onChange({
      short_description: patch.short_description ?? productData.short_description ?? "",
      full_description: patch.full_description ?? productData.full_description ?? "",
      benefits: patch.benefits ?? productData.benefits ?? "",
      ingredients: patch.ingredients ?? productData.ingredients ?? "",
      how_to_use: patch.how_to_use ?? productData.how_to_use ?? "",
    });
  };

  return (
    <div className="col-span-2 space-y-4 border border-amber-500/30 bg-slate-900/90 p-5 rounded shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 font-bold text-[10px] px-2.5 py-0.5 rounded border border-amber-500/30 uppercase tracking-wider">
              ⚡ SINGLE COPY-PASTE FLOW
            </span>
            <span className="text-slate-100 font-bold text-xs uppercase tracking-wider">
              Product Description & Details
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Paste your entire product text here. Use headings like <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">BENEFITS:</code>, <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">INGREDIENTS:</code>, or <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">HOW TO USE:</code> for auto-formatting.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer ${activeTab === "edit" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`}
          >
            Write / Paste
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer ${activeTab === "preview" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`}
          >
            Live Tab Preview
          </button>
        </div>
      </div>

      {activeTab === "edit" ? (
        <div className="space-y-3">
          {/* Preset Helper Buttons */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button type="button" onClick={() => insertSnippet("BENEFITS:\n• Instant hydration & glow\n• Soothes sensitive skin")} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-sans text-[11px] cursor-pointer">
              + Benefits Section
            </button>
            <button type="button" onClick={() => insertSnippet("INGREDIENTS:\nKashmiri Saffron, Wild Turmeric, Sandalwood Oil, Hyaluronic Acid")} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-sans text-[11px] cursor-pointer">
              + Ingredients Section
            </button>
            <button type="button" onClick={() => insertSnippet("HOW TO USE:\nApply 3-4 drops to cleansed face morning and evening. Gently massage until absorbed.")} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-sans text-[11px] cursor-pointer">
              + Directions Section
            </button>
          </div>

          {/* Master Single Copy-Paste Text Area */}
          <textarea
            rows={10}
            value={rawText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Paste complete product details here...&#10;&#10;Example:&#10;Experience luxury skincare infused with Kashmiri Saffron and Sandalwood.&#10;&#10;BENEFITS:&#10;• Reduces dark spots and hyperpigmentation&#10;• Restores lit-from-within glow&#10;&#10;INGREDIENTS:&#10;Kashmiri Saffron, Wild Turmeric, Sandalwood Oil, Hyaluronic Acid&#10;&#10;HOW TO USE:&#10;Apply 3-4 drops to cleansed face morning and evening."
            className="w-full bg-slate-950 border border-slate-800 p-3.5 text-slate-100 font-sans text-xs leading-relaxed focus:outline-none focus:border-amber-500/50 rounded shadow-inner"
          />
        </div>
      ) : (
        /* Live Tab Preview Mode */
        <div className="bg-slate-950 border border-slate-800 p-4 rounded text-xs space-y-3 max-h-64 overflow-y-auto">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-[10px] uppercase font-bold text-amber-400">Short Summary</span>
            <p className="text-slate-200 mt-0.5">{productData.short_description || "No short summary set"}</p>
          </div>

          <div className="border-b border-slate-800 pb-2">
            <span className="text-[10px] uppercase font-bold text-amber-400">Main Editorial Description</span>
            <p className="text-slate-300 whitespace-pre-wrap mt-0.5">{productData.full_description || "No main description"}</p>
          </div>

          {productData.benefits && (
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Detected Benefits</span>
              <p className="text-slate-300 whitespace-pre-wrap mt-0.5">{productData.benefits}</p>
            </div>
          )}

          {productData.ingredients && (
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] uppercase font-bold text-cyan-400">Detected Ingredients</span>
              <p className="text-slate-300 whitespace-pre-wrap mt-0.5">{productData.ingredients}</p>
            </div>
          )}

          {productData.how_to_use && (
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-400">Detected Directions</span>
              <p className="text-slate-300 whitespace-pre-wrap mt-0.5">{productData.how_to_use}</p>
            </div>
          )}
        </div>
      )}

      {/* Catalog Short Summary */}
      <div className="pt-2 border-t border-slate-800 flex flex-col space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Catalog Card Summary *</label>
          <span className="text-[10px] text-slate-500">Auto-extracted from 1st sentence</span>
        </div>
        <input
          required
          value={productData.short_description}
          onChange={(e) => updateFields({ short_description: e.target.value })}
          placeholder="Brief 1-sentence product summary for catalog cards"
          className="bg-slate-950 border border-slate-800 p-2 text-slate-100 text-xs focus:outline-none focus:border-slate-700 rounded"
        />
      </div>

      {/* Optional Collapsible Separate Tab Fields */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvancedFields(!showAdvancedFields)}
          className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>{showAdvancedFields ? "▼ Hide Individual Tab Fields" : "▶ Need to view or edit individual tab fields? (Optional)"}</span>
        </button>

        {showAdvancedFields && (
          <div className="mt-3 p-3 bg-slate-950/80 border border-slate-800 rounded space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Full Editorial Story</label>
              <textarea rows={3} value={productData.full_description} onChange={(e) => updateFields({ full_description: e.target.value })} className="w-full bg-slate-900 border border-slate-800 p-2 text-slate-200 text-xs focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-emerald-400">Key Benefits</label>
              <textarea rows={2} value={productData.benefits || ""} onChange={(e) => updateFields({ benefits: e.target.value })} className="w-full bg-slate-900 border border-slate-800 p-2 text-slate-200 text-xs focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-cyan-400">Ingredients</label>
              <textarea rows={2} value={productData.ingredients || ""} onChange={(e) => updateFields({ ingredients: e.target.value })} className="w-full bg-slate-900 border border-slate-800 p-2 text-slate-200 text-xs focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-purple-400">How to Use</label>
              <textarea rows={2} value={productData.how_to_use || ""} onChange={(e) => updateFields({ how_to_use: e.target.value })} className="w-full bg-slate-900 border border-slate-800 p-2 text-slate-200 text-xs focus:outline-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  // Authentication states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Dashboard dynamic stats state
  const [stats, setStats] = useState({
    total_revenue: 0,
    orders_count: 0,
    customers_count: 0,
    products_count: 0,
    today_sales: 0,
    pending_orders: 0,
    active_offers: 0,
    low_stock: [] as any[],
    recent_orders: [] as any[]
  });

  // Selected tab state
  const [activeTab, setActiveTab] = useState("dashboard");

  // CMS datasets
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // Image Uploading State
  const [isUploading, setIsUploading] = useState(false);

  // --- PRODUCTS STATE ---
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "", slug: "", price: 0, sale_price: null as number | null, SKU: "", stock: 0, category_id: 1,
    category_ids: [1] as number[],
    short_description: "", full_description: "", skin_type: "All Skin Types",
    ingredients: "", benefits: "", how_to_use: "", thumbnail: "", product_images: [] as string[],
    featured: false, active: true
  });
  const [galleryInput, setGalleryInput] = useState("");

  // --- CATEGORIES STATE ---
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "", slug: "", description: "", image: "", active: true, display_order: 0
  });

  // --- REVIEWS STATE ---
  const [showAddReview, setShowAddReview] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [newReview, setNewReview] = useState({
    product_id: 0, rating: 5, review: "", image: "", featured: false,
    customer_name: "", customer_email: "", verified_purchase: true, approved: true
  });

  // --- BLOGS STATE ---
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [newBlog, setNewBlog] = useState({
    title: "", slug: "", excerpt: "", content: "", featured_image: "",
    author: "", published: false, meta_description: ""
  });
  const [blogTab, setBlogTab] = useState<"write" | "preview">("write");
  const [blogPreviewDevice, setBlogPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // --- ORDERS & EMAIL SYSTEM STATE ---
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [richOrderDetails, setRichOrderDetails] = useState<any | null>(null);
  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState<Order | null>(null);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("ALL");
  const [filterOrderStatus, setFilterOrderStatus] = useState("ALL");
  const [filterDate, setFilterDate] = useState("ALL");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("ALL");
  const [newAdminNoteText, setNewAdminNoteText] = useState("");
  const [statusUpdateNotes, setStatusUpdateNotes] = useState("");
  const [selectedStatusUpdate, setSelectedStatusUpdate] = useState("CONFIRMED");

  // --- SHIPPING ANALYTICS STATE ---
  const [shippingAnalytics, setShippingAnalytics] = useState<any>({
    total_orders: 0,
    tn_orders: 0,
    outside_tn_orders: 0,
    shipping_80_orders: 0,
    shipping_150_orders: 0,
    total_shipping_revenue: 0,
    avg_shipping_charge: 0,
    revenue_by_date: [],
    revenue_by_state: []
  });

  // --- AI ANALYTICS STATE ---
  const [aiAnalytics, setAiAnalytics] = useState<any>({
    total_analyses: 0,
    analysis_types: { "Skin Analyses": 0, "Hair Analyses": 0, "Both Analyses": 0 },
    most_detected_skin_types: {},
    most_detected_concerns: {},
    funnel_metrics: { total_analyses: 0, product_views: 0, adds_to_cart: 0, purchases: 0, conversion_rate: 0 }
  });


  // --- OFFERS & VOUCHERS CMS STATE ---
  const [offers, setOffers] = useState<any[]>([]);
  const [offerAnalytics, setOfferAnalytics] = useState<any>({
    total_offers: 0, active_offers: 0, expired_offers: 0, total_uses: 0, total_discount: 0
  });
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [newOffer, setNewOffer] = useState<OfferItem>({
    name: "", code: "", description: "", offer_type: "percentage",
    discount_value: 10, minimum_order_value: 0, maximum_discount: null,
    start_date: null, end_date: null, usage_limit: null, per_customer_limit: 1,
    first_order_only: false, exclude_sale_products: false, active: true
  });

  // --- CONTENT & MEDIA CMS STATE ---
  const [heroBanners, setHeroBanners] = useState<any[]>([]);
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [newBanner, setNewBanner] = useState<any>({
    desktop_image: "/uploads/hero_main.jpg",
    mobile_image: "/uploads/hero_main.jpg",
    heading: "",
    subheading: "",
    cta_text: "EXPLORE PRODUCTS",
    cta_link: "/shop",
    display_order: 1,
    active: true
  });

  const [resultGalleryItems, setResultGalleryItems] = useState<any[]>([]);
  const [showAddResultModal, setShowAddResultModal] = useState(false);
  const [editingResult, setEditingResult] = useState<any | null>(null);
  const [newResult, setNewResult] = useState<any>({
    image: "/uploads/product_placeholder.jpg",
    title: "",
    description: "",
    product_used: "",
    customer_name: "",
    duration: "",
    display_order: 1,
    active: true
  });

  // --- REAL RESULTS CMS STATE ---
  const [realResults, setRealResults] = useState<any[]>([]);
  const [realResultsSearch, setRealResultsSearch] = useState("");
  const [realResultsFilterStatus, setRealResultsFilterStatus] = useState<"all" | "published" | "hidden">("all");
  const [showRealResultModal, setShowRealResultModal] = useState(false);
  const [editingRealResult, setEditingRealResult] = useState<any | null>(null);
  const [realResultDeleteId, setRealResultDeleteId] = useState<number | null>(null);
  const [realResultForm, setRealResultForm] = useState<any>({
    customer_name: "",
    customer_location: "",
    before_image: "/uploads/product_placeholder.jpg",
    after_image: "/uploads/product_placeholder.jpg",
    description: "",
    product_used: "",
    duration: "",
    skin_concern: "",
    display_order: 1,
    active: true,
  });

  // --- BOTANICAL ROUTINE JOURNEYS CMS STATE ---
  const [botanicalJourneys, setBotanicalJourneys] = useState<any[]>([]);
  const [botanicalJourneysSearch, setBotanicalJourneysSearch] = useState("");
  const [botanicalJourneysStatusFilter, setBotanicalJourneysStatusFilter] = useState<"all" | "published" | "hidden">("all");
  const [showBotanicalJourneyModal, setShowBotanicalJourneyModal] = useState(false);
  const [editingBotanicalJourney, setEditingBotanicalJourney] = useState<any | null>(null);
  const [botanicalJourneyDeleteId, setBotanicalJourneyDeleteId] = useState<number | null>(null);
  const [newProgressImageUrl, setNewProgressImageUrl] = useState("");
  const [botanicalJourneyForm, setBotanicalJourneyForm] = useState<any>({
    title: "",
    customer_name: "",
    skin_type: "",
    skin_concern: "",
    products_used: "",
    routine_description: "",
    morning_routine: "",
    night_routine: "",
    duration: "",
    result_description: "",
    before_image: "",
    progress_images: [],
    final_image: "/uploads/product_placeholder.jpg",
    display_order: 1,
    active: true,
  });

  const [founderStory, setFounderStory] = useState<any>({
    name: "Nandavel V",
    title: "Founder & CEO, Qura Herbs",
    image: "",
    quote: "Build Qura Herbs with purpose. Grow it with people. And never lose the reason we started.",
    description: "Qura Herbs started with an idea that was personal to me: people deserve skincare that understands their concerns instead of making them feel like they need to change who they are.\n\nWhen I started Qura Herbs on January 13, 2025, in Coimbatore, I didn't see it as simply starting another beauty brand. I wanted to build something that could genuinely connect with people, understand their individual skin and hair concerns, and become a trusted part of their everyday routine.\n\nBeing involved in Qura from the beginning has meant being part of everything—from understanding customer concerns and developing products to building the brand, creating content, managing operations, and listening to every piece of feedback we receive.\n\nWhat means the most to me is not simply seeing Qura grow. It is seeing someone trust our brand, share their experience, and come back because they believe in what we are building.\n\nThere is still a long way to go, but the vision remains simple:"
  });

  const [ceoStory, setCeoStory] = useState<any>({
    name: "Pranavi G",
    title: "Chief Executive Officer, Qura Herbs",
    image: "",
    quote: "This is more than building a company for me. It is about building something I can be proud to put my name behind.",
    description: "For me, Qura Herbs is more than a business. It is something I genuinely care about building—one customer, one product, and one experience at a time.\n\nAs the CEO of Qura Herbs, I am closely involved in shaping the brand, understanding what our customers truly need, and making sure every part of their experience feels thoughtful and meaningful. I believe a beauty brand should listen before it speaks, understand before it promises, and always put people before trends.\n\nWhat inspires me most is seeing Qura grow from an idea into a brand that people choose to bring into their everyday routines. Every message from a customer, every piece of feedback, and every small milestone reminds me why we started.\n\nI want Qura Herbs to be a brand that feels personal—not distant or overly complicated. A brand that people can trust, relate to, and grow with."
  });

  const [aboutContent, setAboutContent] = useState<any>({
    subtitle: "OUR STORY",
    title: "About Qura Herbs",
    hero_heading: "Where Laboratory Chemistry Meets Healing Botanicals.",
    hero_paragraph1: "Qura Herbs was founded in India with a clear mission: to deliver clean, active, luxury skincare that respects the skin barrier. We believe that true skincare does not require stripping the skin or loading it with synthetic texturizers.",
    hero_paragraph2: "By blending ancient, phytomedical healing knowledge with modern active chemical science, our laboratory develops clean elixirs that soothe redness, control breakouts, and unlock radiant glass-like transparency.",
    hero_image: "/uploads/about_banner.jpg",
    pillar1_title: "1. Barrier Support",
    pillar1_desc: "We never use drying alcohols, harsh sulfates, or stripping cleansers. Our items are formulated to nurture the pH balance and reinforce the lipid seal.",
    pillar2_title: "2. Ethical Sourcing",
    pillar2_desc: "All roots, leaves, and oils are ethically wild-harvested across India, supporting local farmers and preserving organic biodiverse ecosystems.",
    pillar3_title: "3. Pure Transparency",
    pillar3_desc: "No hidden synthetic fragrances, parabens, or heavy chemical dyes. We declare every single compound used in our editorial batches."
  });

  const [aboutSubTab, setAboutSubTab] = useState<"about" | "founder" | "ceo">("about");
  const [contentSubTab, setContentSubTab] = useState<"banners" | "results" | "founder">("banners");

  // Allowed admin list (simulating backend check)
  const allowedAdminEmails = ["admin@quraherbs.in", "nandavelv@gmail.com"];

  useEffect(() => {
    // Check path for auto tab selection (/admin/about, /admin/founder, etc.)
    if (typeof window !== "undefined") {
      const path = window.location.pathname.replace(/\/$/, "");
      const parts = path.split("/");
      const lastPart = parts[parts.length - 1];
      if (lastPart && ["dashboard", "orders", "offers", "content", "about", "founder", "ceo", "products", "categories", "reviews", "blogs", "settings"].includes(lastPart)) {
        if (lastPart === "founder" || lastPart === "ceo") {
          setActiveTab("about");
          setAboutSubTab(lastPart as "founder" | "ceo");
        } else {
          setActiveTab(lastPart);
        }
      }
    }

    // Check local session storage on mount
    const savedSession = sessionStorage.getItem("qura_admin_session");
    if (savedSession && allowedAdminEmails.includes(savedSession)) {
      setIsAuthorized(true);
      loadAdminData();
    }
  }, []);

  const handleSaveAboutContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/v1/content/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutContent),
      });
      if (res.ok) {
        alert("About Page content updated successfully!");
      } else {
        alert("Failed to save About Page content.");
      }
    } catch (err) {
      console.error("Error saving About Page content:", err);
      alert("Error saving About Page content.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("http://localhost:8000/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });
      if (res.ok) {
        sessionStorage.setItem("qura_admin_session", email.trim().toLowerCase());
        setIsAuthorized(true);
        setLoginError("");
        loadAdminData();
      } else {
        const data = await res.json();
        setLoginError(data.detail || "Invalid email or password.");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Failed to connect to authentication server.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("qura_admin_session");
    setIsAuthorized(false);
  };

  const loadAdminData = () => {
    // 1. Fetch dashboard statistics
    fetch("http://localhost:8000/api/v1/admin/dashboard")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log("Failed to load dashboard stats:", err));

    // 2. Fetch products
    fetch("http://localhost:8000/api/v1/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        if (data.length > 0 && newReview.product_id === 0) {
          setNewReview((prev) => ({ ...prev, product_id: data[0].id }));
        }
      })
      .catch((err) => console.log("Failed to load products:", err));

    // 3. Fetch categories
    fetch("http://localhost:8000/api/v1/categories/")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0 && newProduct.category_id === 1) {
          setNewProduct((prev) => ({ ...prev, category_id: data[0].id }));
        }
      })
      .catch((err) => console.log("Failed to load categories:", err));

    // 4. Fetch reviews
    fetch("http://localhost:8000/api/v1/reviews/")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.log("Failed to load reviews:", err));

    // 5. Fetch blogs
    fetch("http://localhost:8000/api/v1/blogs/?published_only=false")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.log("Failed to load blogs:", err));

    // 6. Fetch orders
    fetch("http://localhost:8000/api/v1/orders/")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log("Failed to load orders:", err));

    // 7. Fetch offers
    fetch("http://localhost:8000/api/v1/offers/?active_only=false")
      .then((res) => res.json())
      .then((data) => setOffers(data))
      .catch((err) => console.log("Failed to load offers:", err));

    // 8. Fetch shipping analytics
    fetch("http://localhost:8000/api/v1/orders/analytics/shipping")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.total_orders !== undefined) {
          setShippingAnalytics(data);
        }
      })
      .catch((err) => console.log("Failed to load shipping analytics:", err));

    // 8. Fetch offer analytics
    fetch("http://localhost:8000/api/v1/offers/analytics")
      .then((res) => res.json())
      .then((data) => setOfferAnalytics(data))
      .catch((err) => console.log("Failed to load offer analytics:", err));

    // 8.5. Fetch AI Analytics
    fetch("http://localhost:8000/api/v1/ai/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.total_analyses !== undefined) {
          setAiAnalytics(data);
        }
      })
      .catch((err) => console.log("Failed to load AI analytics:", err));


    // 9. Fetch Hero Banners
    fetch("http://localhost:8000/api/v1/content/hero-banners?active_only=false")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setHeroBanners(data); })
      .catch((err) => console.log("Failed to load hero banners:", err));

    // 10. Fetch Result Gallery
    fetch("http://localhost:8000/api/v1/content/results-gallery?active_only=false")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setResultGalleryItems(data); })
      .catch((err) => console.log("Failed to load result gallery:", err));

    // 11. Fetch Founder Story
    fetch("http://localhost:8000/api/v1/content/founder")
      .then((res) => res.json())
      .then((data) => { if (data) setFounderStory(data); })
      .catch((err) => console.log("Failed to load founder story:", err));

    // 12. Fetch CEO Story
    fetch("http://localhost:8000/api/v1/content/ceo")
      .then((res) => res.json())
      .then((data) => { if (data) setCeoStory(data); })
      .catch((err) => console.log("Failed to load ceo story:", err));

    // 13. Fetch About Page Content
    fetch("http://localhost:8000/api/v1/content/about")
      .then((res) => res.json())
      .then((data) => { if (data && data.title) setAboutContent(data); })
      .catch((err) => console.log("Failed to load about page content:", err));

    // 14. Fetch Real Results
    fetch("http://localhost:8000/api/v1/content/real-results?active_only=false")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setRealResults(data); })
      .catch((err) => console.log("Failed to load real results:", err));

    // 15. Fetch Botanical Journeys
    fetch("http://localhost:8000/api/v1/content/botanical-journeys?active_only=false")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setBotanicalJourneys(data); })
      .catch((err) => console.log("Failed to load botanical journeys:", err));
  };

  // --- REAL RESULTS HANDLERS ---
  const handleSaveRealResult = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingRealResult
        ? `http://localhost:8000/api/v1/content/real-results/${editingRealResult.id}`
        : "http://localhost:8000/api/v1/content/real-results";
      const method = editingRealResult ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(realResultForm),
      });

      if (res.ok) {
        setShowRealResultModal(false);
        setEditingRealResult(null);
        loadAdminData();
      } else {
        alert("Failed to save Real Result.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving Real Result.");
    }
  };

  const handleToggleRealResult = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/content/real-results/${id}/toggle`, {
        method: "PATCH",
      });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRealResult = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/content/real-results/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRealResultDeleteId(null);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- BOTANICAL JOURNEYS HANDLERS ---
  const handleSaveBotanicalJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBotanicalJourney
        ? `http://localhost:8000/api/v1/content/botanical-journeys/${editingBotanicalJourney.id}`
        : "http://localhost:8000/api/v1/content/botanical-journeys";
      const method = editingBotanicalJourney ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(botanicalJourneyForm),
      });

      if (res.ok) {
        setShowBotanicalJourneyModal(false);
        setEditingBotanicalJourney(null);
        loadAdminData();
      } else {
        alert("Failed to save Botanical Journey.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving Botanical Journey.");
    }
  };

  const handleToggleBotanicalJourney = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/content/botanical-journeys/${id}/toggle`, {
        method: "PATCH",
      });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBotanicalJourney = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/content/botanical-journeys/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBotanicalJourneyDeleteId(null);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- RICH ORDER DETAILS & STATUS ACTIONS ---
  const fetchRichOrderDetails = async (orderId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/orders/${orderId}/details`);
      if (res.ok) {
        const data = await res.json();
        setRichOrderDetails(data);
        setSelectedStatusUpdate(data.order_status || "CONFIRMED");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (orderNumber: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/orders/${orderNumber}/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatusUpdate,
          notes: statusUpdateNotes,
          admin_name: "Admin Staff"
        })
      });
      if (res.ok) {
        alert(`Order #${orderNumber} status updated to ${selectedStatusUpdate}!`);
        setStatusUpdateNotes("");
        fetchRichOrderDetails(orderNumber);
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAdminNote = async (orderNumber: string) => {
    if (!newAdminNoteText.trim()) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/orders/${orderNumber}/add-note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: newAdminNoteText,
          admin_name: "Admin Staff"
        })
      });
      if (res.ok) {
        setNewAdminNoteText("");
        fetchRichOrderDetails(orderNumber);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- OFFERS & VOUCHERS MANAGEMENT ACTIONS ---
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = !!editingOffer;
      const url = isEditing
        ? `http://localhost:8000/api/v1/offers/${editingOffer.id}`
        : "http://localhost:8000/api/v1/offers/";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOffer)
      });

      if (res.ok) {
        alert(`Offer ${isEditing ? "updated" : "created"} successfully!`);
        setShowAddOfferModal(false);
        setEditingOffer(null);
        setNewOffer({
          name: "", code: "", description: "", offer_type: "percentage",
          discount_value: 10, minimum_order_value: 0, maximum_discount: null,
          start_date: null, end_date: null, usage_limit: null, per_customer_limit: 1,
          first_order_only: false, exclude_sale_products: false, active: true
        });
        loadAdminData();
      } else {
        const errData = await res.json();
        alert(`Failed to save offer: ${errData.detail || "Check input fields."}`);
      }
    } catch (e) {
      console.error(e);
      alert("Communication error while saving offer.");
    }
  };

  const handleDeleteOffer = async (offerId: number) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/offers/${offerId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Offer deleted successfully.");
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleOfferActive = async (offer: any) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/offers/${offer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...offer, active: !offer.active })
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- ORDER PAYMENT & EMAIL ACTIONS ---
  const handleConfirmPaymentClick = (order: Order) => {
    if (order.payment_status === "PAYMENT_CONFIRMED" || order.payment_status === "paid") {
      alert("Payment is already confirmed for this order.");
      return;
    }
    setOrderToConfirm(order);
    setShowConfirmPaymentModal(true);
  };

  const executeConfirmPayment = async () => {
    if (!orderToConfirm) return;
    setIsConfirmingPayment(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/orders/${orderToConfirm.order_number}/confirm-payment`, {
        method: "POST"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Payment confirmed successfully! Customer confirmation email queued.");
        setShowConfirmPaymentModal(false);
        setOrderToConfirm(null);
        loadAdminData();
        if (selectedOrderDetails && selectedOrderDetails.id === orderToConfirm.id) {
          fetchEmailLogs(orderToConfirm.order_number);
        }
      } else {
        alert(`Notice: ${data.message || "Payment is already confirmed or failed."}`);
        setShowConfirmPaymentModal(false);
      }
    } catch (err) {
      console.error(err);
      alert("Communication error with authentication server.");
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  const handleRejectPayment = async (orderNumber: string) => {
    if (!confirm("Are you sure you want to REJECT this payment and cancel the order?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/orders/${orderNumber}/reject-payment`, {
        method: "POST"
      });
      if (res.ok) {
        alert("Payment rejected and order status set to CANCELLED.");
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEmailLogs = async (orderNumber: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/orders/${orderNumber}/email-logs`);
      if (res.ok) {
        const logs = await res.json();
        setEmailLogs(logs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResendConfirmation = async (orderNumber: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/orders/${orderNumber}/resend-confirmation`, {
        method: "POST"
      });
      if (res.ok) {
        alert("Confirmation email re-queued for sending to customer!");
        fetchEmailLogs(orderNumber);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- CONTENT & MEDIA CMS ACTIONS ---
  const handleSaveHeroBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBanner
        ? `http://localhost:8000/api/v1/content/hero-banners/${editingBanner.id}`
        : "http://localhost:8000/api/v1/content/hero-banners";
      const method = editingBanner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBanner),
      });

      if (res.ok) {
        alert(editingBanner ? "Hero Banner updated!" : "Hero Banner created!");
        setShowAddBannerModal(false);
        setEditingBanner(null);
        loadAdminData();
      } else {
        alert("Failed to save hero banner.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteHeroBanner = async (id: number) => {
    if (!confirm("Are you sure you want to delete this hero banner?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/content/hero-banners/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveResultItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingResult
        ? `http://localhost:8000/api/v1/content/results-gallery/${editingResult.id}`
        : "http://localhost:8000/api/v1/content/results-gallery";
      const method = editingResult ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResult),
      });

      if (res.ok) {
        alert(editingResult ? "Result item updated!" : "Result item created!");
        setShowAddResultModal(false);
        setEditingResult(null);
        loadAdminData();
      } else {
        alert("Failed to save result item.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteResultItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this result item?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/content/results-gallery/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveFounderStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/v1/content/founder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(founderStory),
      });

      if (res.ok) {
        alert("Founder Story Updated: The founder profile and story details have been saved.");
        loadAdminData();
      } else {
        alert("Failed to save founder story.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCeoStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/v1/content/ceo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ceoStory),
      });

      if (res.ok) {
        alert("CEO Story Updated: The CEO profile & leadership details have been saved.");
        loadAdminData();
      } else {
        alert("Failed to save CEO story.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- FILE UPLOAD HELPER ---
  const handleFileUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const apiBase = getApiV1Base();
      const res = await fetch(`${apiBase}/media/upload`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const url = data.url;
        setIsUploading(false);
        return url;
      }
    } catch (e) {
      console.warn("Backend upload endpoint unavailable, using local client preview:", e);
    }

    // Client-side fallback: Convert file to Data URL if backend is offline or returned an error
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsUploading(false);
        resolve((reader.result as string) || "");
      };
      reader.onerror = () => {
        setIsUploading(false);
        alert("Error reading file");
        resolve("");
      };
      reader.readAsDataURL(file);
    });
  };

  // --- GOOGLE DRIVE & WEB URL IMPORT HELPER ---
  const handleUrlOrDriveImport = async (inputUrl: string): Promise<string> => {
    if (!inputUrl || !inputUrl.trim()) return "";
    const cleanUrl = inputUrl.trim();

    if (cleanUrl.includes("drive.google.com") || cleanUrl.includes("googleusercontent.com") || cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
      try {
        setIsUploading(true);
        const apiBase = getApiV1Base();
        const res = await fetch(`${apiBase}/media/import-drive-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: cleanUrl }),
        });
        if (res.ok) {
          const data = await res.json();
          setIsUploading(false);
          return data.url;
        }
      } catch (e) {
        console.error("Drive import error:", e);
      } finally {
        setIsUploading(false);
      }
    }
    return cleanUrl;
  };

  // --- PRODUCTS CRUD ACTIONS ---
  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.price <= 0 || newProduct.stock < 0) {
      alert("Please enter valid positive values for Price and Stock");
      return;
    }
    try {
      const selectedCategoryIds = (newProduct.category_ids && newProduct.category_ids.length > 0)
        ? newProduct.category_ids
        : [Number(newProduct.category_id || 1)];

      const res = await fetch("http://localhost:8000/api/v1/products/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          sale_price: newProduct.sale_price ? Number(newProduct.sale_price) : null,
          stock: Number(newProduct.stock),
          category_id: selectedCategoryIds[0],
          category_ids: selectedCategoryIds
        }),
      });
      if (res.ok) {
        alert("Product created successfully!");
        setShowAddProduct(false);
        setNewProduct({
          name: "", slug: "", price: 0, sale_price: null, SKU: "", stock: 0, category_id: categories[0]?.id || 1,
          category_ids: categories[0] ? [categories[0].id] : [1],
          short_description: "", full_description: "", skin_type: "All Skin Types",
          ingredients: "", benefits: "", how_to_use: "", thumbnail: "", product_images: [],
          featured: false, active: true
        });
        loadAdminData();
      } else {
        const data = await res.json();
        alert(`Failed to create product: ${data.detail || "Check for duplicates."}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (editingProduct.price <= 0 || editingProduct.stock < 0) {
      alert("Please enter valid positive values for Price and Stock");
      return;
    }
    try {
      const selectedCategoryIds = (editingProduct.category_ids && editingProduct.category_ids.length > 0)
        ? editingProduct.category_ids
        : (editingProduct.category_id ? [Number(editingProduct.category_id)] : []);

      const res = await fetch(`http://localhost:8000/api/v1/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingProduct,
          price: Number(editingProduct.price),
          sale_price: editingProduct.sale_price ? Number(editingProduct.sale_price) : null,
          stock: Number(editingProduct.stock),
          category_id: selectedCategoryIds[0] || editingProduct.category_id,
          category_ids: selectedCategoryIds
        }),
      });
      if (res.ok) {
        alert("Product updated successfully!");
        setEditingProduct(null);
        loadAdminData();
      } else {
        const data = await res.json();
        alert(`Failed to update product: ${data.detail || "Error saving changes."}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/products/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- CATEGORIES CRUD ACTIONS ---
  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      alert("Name and Slug are required.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/v1/categories/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (res.ok) {
        alert("Category created successfully!");
        setShowAddCategory(false);
        setNewCategory({ name: "", slug: "", description: "", image: "", active: true, display_order: 0 });
        loadAdminData();
      } else {
        const data = await res.json();
        alert(`Failed to create category: ${data.detail || "Slug must be unique."}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });
      if (res.ok) {
        alert("Category updated successfully!");
        setEditingCategory(null);
        loadAdminData();
      } else {
        const data = await res.json();
        alert(`Failed to update category: ${data.detail || "Error saving changes."}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category? All related items might be affected.")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/categories/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadAdminData();
      } else {
        alert("Failed to delete category.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- REVIEWS CRUD ACTIONS ---
  const approveReview = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/reviews/${id}/approve`, {
        method: "PUT"
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.customer_name || !newReview.review) {
      alert("Customer Name and Review Text are required.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/v1/reviews/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: Number(newReview.product_id),
          rating: Number(newReview.rating),
          review: newReview.review,
          image: newReview.image || null,
          featured: newReview.featured,
          customer_name: newReview.customer_name,
          customer_email: newReview.customer_email || null
        }),
      });
      if (res.ok) {
        alert("Review created successfully!");
        setShowAddReview(false);
        setNewReview({
          product_id: products[0]?.id || 0, rating: 5, review: "", image: "", featured: false,
          customer_name: "", customer_email: "", verified_purchase: true, approved: true
        });
        loadAdminData();
      } else {
        const data = await res.json();
        alert(`Failed to create review: ${data.detail || "Error saving."}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/reviews/${editingReview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: Number(editingReview.product_id),
          rating: Number(editingReview.rating),
          review: editingReview.review,
          image: editingReview.image || null,
          featured: editingReview.featured,
          customer_name: editingReview.customer_name,
          customer_email: editingReview.customer_email || null
        }),
      });
      if (res.ok) {
        alert("Review updated successfully!");
        setEditingReview(null);
        loadAdminData();
      } else {
        const data = await res.json();
        alert(`Failed to update review: ${data.detail || "Error saving."}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/reviews/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleReviewFeatured = async (review: Review) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: review.product_id,
          rating: review.rating,
          review: review.review,
          image: review.image || null,
          featured: !review.featured,
          customer_name: review.customer_name || "Customer",
          customer_email: review.customer_email || null
        }),
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- BLOGS CRUD ACTIONS ---
  const createBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.slug || !newBlog.content) {
      alert("Title, Slug and Article Content are required.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/v1/blogs/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlog),
      });
      if (res.ok) {
        alert("Blog post created successfully!");
        setShowAddBlog(false);
        setNewBlog({
          title: "", slug: "", excerpt: "", content: "", featured_image: "",
          author: "", published: false, meta_description: ""
        });
        loadAdminData();
      } else {
        const data = await res.json();
        alert(`Failed to create post: ${data.detail || "Slug must be unique."}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/blogs/${editingBlog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBlog),
      });
      if (res.ok) {
        alert("Blog post updated successfully!");
        setEditingBlog(null);
        loadAdminData();
      } else {
        const data = await res.json();
        alert(`Failed to update blog post: ${data.detail || "Error saving."}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteBlog = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/blogs/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- RENDER STARS VISUAL HELPER ---
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={12}
          className={i <= rating ? "fill-blue-400 text-blue-400" : "text-slate-600"}
        />
      );
    }
    return <div className="flex space-x-0.5">{stars}</div>;
  };

  // --- BLOG TEXT PARSER FOR LIVE PREVIEW ---
  const renderRichContent = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((para, index) => {
      const trimmed = para.trim();
      if (trimmed.startsWith("# ")) {
        return <h1 key={index} className="text-2xl md:text-3xl font-serif font-light my-4 text-slate-100">{trimmed.slice(2)}</h1>;
      } else if (trimmed.startsWith("## ")) {
        return <h2 key={index} className="text-xl md:text-2xl font-serif font-light my-3 text-slate-200">{trimmed.slice(3)}</h2>;
      } else if (trimmed.startsWith("### ")) {
        return <h3 key={index} className="text-lg font-semibold my-2 text-slate-300">{trimmed.slice(4)}</h3>;
      } else if (trimmed.startsWith("> ")) {
        return <blockquote key={index} className="border-l-2 border-slate-600 pl-4 italic text-slate-400 my-4 text-sm font-light">{trimmed.slice(2)}</blockquote>;
      } else if (trimmed.startsWith("- ")) {
        return <li key={index} className="list-disc ml-6 text-slate-350 my-1 text-sm font-light">{trimmed.slice(2)}</li>;
      } else if (trimmed === "") {
        return <div key={index} className="h-4" />;
      } else {
        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} className="text-slate-300 leading-relaxed text-sm my-2 font-light">
            {parts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={pIdx} className="font-bold text-slate-100">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      }
    });
  };

  const sidebarLinks = [
    { name: "Dashboard", id: "dashboard", icon: BarChart3 },
    { name: "Orders", id: "orders", icon: ShoppingBag },
    { name: "Shipping Analytics", id: "shipping", icon: Truck },
    { name: "Offers & Vouchers", id: "offers", icon: Tag },
    { name: "Content & Media", id: "content", icon: Image },
    { name: "Real Results", id: "real-results", icon: CheckCircle2 },
    { name: "Botanical Journeys", id: "botanical-journeys", icon: Sparkles },
    { name: "About & Founder", id: "about", icon: UserCheck },
    { name: "Products", id: "products", icon: Box },
    { name: "Categories", id: "categories", icon: Folders },
    { name: "Reviews", id: "reviews", icon: Star },
    { name: "Blogs Journal", id: "blogs", icon: BookOpen },
    { name: "Settings", id: "settings", icon: Settings },
  ];



  // 1. Lock screen Login Portal
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-3 flex flex-col items-center">
            <img src="/logo.png" alt="Qura Herbs Logo" className="h-12 w-auto object-contain bg-slate-950/60 p-1.5 rounded-md border border-slate-800" />
            <div>
              <span className="text-[10px] tracking-[0.3em] font-sans text-slate-400 uppercase font-bold block">
                QURA HERBS PORTAL
              </span>
              <h1 className="font-serif text-2xl font-light text-slate-100 mt-0.5">
                Admin Login
              </h1>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] uppercase tracking-widest text-slate-400">Admin Email</label>
              <input
                required
                type="email"
                placeholder="e.g. nandavelv@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:border-slate-600 w-full"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[9px] uppercase tracking-widest text-slate-400">Admin Password</label>
              <input
                required
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 focus:outline-none focus:border-slate-600 w-full"
              />
            </div>

            {loginError && (
              <div className="flex items-center space-x-2 text-red-400 text-xs font-sans">
                <ShieldAlert size={14} />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-950 font-sans text-xs uppercase tracking-widest py-3.5 font-bold transition-all"
            >
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Master Dashboard layout
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top navbar */}
      <header className="bg-slate-950 border-b border-slate-800 h-16 flex items-center justify-between px-6 z-10">
        <span className="font-serif text-lg tracking-[0.2em] font-light text-slate-100">
          QURA ADMIN PANEL
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-xs uppercase tracking-widest text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col p-4 space-y-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-colors ${
                  activeTab === link.id
                    ? "bg-slate-800 text-slate-100 border-l-2 border-slate-100"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                }`}
              >
                <Icon size={16} />
                <span>{link.name}</span>
              </button>
            );
          })}
        </aside>

        {/* Central main workspace */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-900">
          
          {/* TAB 1: DASHBOARD STATS */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold">Dashboard Overview</h2>
              
              {/* Stat widgets grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-950 border border-slate-800 p-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold">Total Sales Revenue</span>
                    <h3 className="text-2xl font-bold mt-1">₹{stats.total_revenue}</h3>
                  </div>
                  <TrendingUp className="text-green-500" size={28} />
                </div>
                <div className="bg-slate-950 border border-slate-800 p-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold">Orders Volume</span>
                    <h3 className="text-2xl font-bold mt-1">{stats.orders_count}</h3>
                  </div>
                  <ShoppingBag className="text-blue-500" size={28} />
                </div>
                <div className="bg-slate-950 border border-slate-800 p-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold">Products Catalog</span>
                    <h3 className="text-2xl font-bold mt-1">{stats.products_count}</h3>
                  </div>
                  <Box className="text-purple-500" size={28} />
                </div>
                <div className="bg-slate-950 border border-slate-800 p-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold">Low Stock Warning</span>
                    <h3 className="text-2xl font-bold mt-1">{stats.low_stock.length} Items</h3>
                  </div>
                  <AlertCircle className="text-red-500" size={28} />
                </div>
              </div>

              {/* Low stock alerts lists */}
              {stats.low_stock.length > 0 && (
                <div className="bg-red-950/20 border border-red-800/40 p-4 flex items-center gap-3 text-xs text-red-400">
                  <AlertCircle size={18} />
                  <span>
                    Warning: <strong>{stats.low_stock.map((p) => p.name).join(", ")}</strong> stock levels are low. Adjust catalog inventory.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB: ADVANCED ORDERS MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                    <ShoppingBag className="text-blue-500" size={22} />
                    <span>Order Management & Fulfillment</span>
                  </h2>
                  <p className="text-xs text-slate-400">Track orders, verify payment, log status transitions, and inspect customer communications.</p>
                </div>

                <button
                  onClick={loadAdminData}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 text-xs font-semibold uppercase flex items-center space-x-1.5 self-start md:self-auto"
                >
                  <RefreshCw size={14} />
                  <span>Refresh Orders</span>
                </button>
              </div>

              {/* SEARCH & ADVANCED FILTERS BAR */}
              <div className="bg-slate-950 p-4 border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                  {/* Multi-field Search */}
                  <div className="lg:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Search Orders</label>
                    <input
                      type="text"
                      placeholder="Search by Order #, Customer Name, Phone, Email..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 text-slate-100 focus:outline-none text-xs"
                    />
                  </div>

                  {/* Payment Status Filter */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Payment Status</label>
                    <select
                      value={filterPaymentStatus}
                      onChange={(e) => setFilterPaymentStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 text-slate-200 focus:outline-none text-xs"
                    >
                      <option value="ALL">All Payment Statuses</option>
                      <option value="PAYMENT_PENDING">Payment Pending</option>
                      <option value="PAYMENT_CONFIRMED">Payment Confirmed</option>
                      <option value="PAYMENT_FAILED">Payment Failed / Rejected</option>
                    </select>
                  </div>

                  {/* Order Status Filter */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Order Status</label>
                    <select
                      value={filterOrderStatus}
                      onChange={(e) => setFilterOrderStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 text-slate-200 focus:outline-none text-xs"
                    >
                      <option value="ALL">All Order Statuses</option>
                      <option value="PAYMENT_PENDING">Payment Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="PACKED">Packed</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="REFUNDED">Refunded</option>
                    </select>
                  </div>

                  {/* Payment Method Filter */}
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Payment Method</label>
                    <select
                      value={filterPaymentMethod}
                      onChange={(e) => setFilterPaymentMethod(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 text-slate-200 focus:outline-none text-xs"
                    >
                      <option value="ALL">All Payment Methods</option>
                      <option value="UPI">UPI Payment</option>
                      <option value="COD">Cash On Delivery (COD)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Confirmation Modal Dialog */}
              {showConfirmPaymentModal && orderToConfirm && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50">
                  <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <CheckCircle2 size={20} />
                        <h3 className="text-lg font-bold text-slate-100">Confirm Payment?</h3>
                      </div>
                      <button onClick={() => setShowConfirmPaymentModal(false)} className="text-slate-400 hover:text-slate-100">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs text-slate-300">
                      <p className="leading-relaxed">
                        Are you sure you have verified the UPI payment of <strong className="text-slate-100">₹{orderToConfirm.total}</strong> for order <strong className="text-slate-100">#{orderToConfirm.order_number}</strong>?
                      </p>

                      <div className="bg-slate-950 p-3 border border-slate-800 space-y-1 font-mono text-[11px]">
                        <div><span className="text-slate-500">Order ID:</span> #{orderToConfirm.order_number}</div>
                        <div><span className="text-slate-500">Amount:</span> ₹{orderToConfirm.total}</div>
                        <div><span className="text-slate-500">Payment Status:</span> PAYMENT_PENDING</div>
                      </div>

                      <p className="text-[11px] text-slate-400 italic">
                        Confirming will update payment status to <strong>PAYMENT_CONFIRMED</strong> and trigger an automated confirmation email to the customer.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPaymentModal(false)}
                        className="flex-1 border border-slate-700 hover:bg-slate-800 text-slate-300 py-2.5 text-xs font-bold uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={executeConfirmPayment}
                        disabled={isConfirmingPayment}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {isConfirmingPayment ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <Check size={14} />
                            <span>Confirm Payment</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 10-SECTION RICH ORDER DETAILS DRAWER MODAL */}
              {richOrderDetails && (
                <div className="fixed inset-0 bg-slate-950/85 flex items-center justify-center p-4 z-50 overflow-y-auto">
                  <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6 max-h-[92vh] overflow-y-auto scrollbar-thin">
                    
                    {/* SECTION 1 — ORDER HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-serif text-lg tracking-[0.2em] font-light text-blue-500">QURA HERBS</span>
                          <span className="text-slate-600">•</span>
                          <h3 className="text-lg font-bold text-slate-100">Order #{richOrderDetails.order_number}</h3>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Placed on {new Date(richOrderDetails.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${richOrderDetails.order_status === "DELIVERED" ? "bg-emerald-950/40 text-emerald-400 border-emerald-900" : "bg-slate-800 text-slate-200 border-slate-700"}`}>
                          [ {richOrderDetails.order_status} ]
                        </span>
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${richOrderDetails.payment_status === "PAYMENT_CONFIRMED" || richOrderDetails.payment_status === "paid" ? "bg-emerald-950/40 text-emerald-400 border-emerald-900" : "bg-blue-950/40 text-blue-400 border-blue-900"}`}>
                          [ {richOrderDetails.payment_status} ]
                        </span>

                        <button
                          onClick={() => window.print()}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 text-[10px] uppercase font-bold tracking-widest flex items-center space-x-1 border border-slate-700"
                        >
                          <Printer size={12} />
                          <span>Print Invoice</span>
                        </button>
                        <button
                          onClick={() => setRichOrderDetails(null)}
                          className="text-slate-400 hover:text-slate-100 p-1"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* SECTION 2 — CUSTOMER DETAILS */}
                      <div className="bg-slate-950 p-5 border border-slate-800 space-y-3">
                        <div className="flex items-center space-x-2 text-xs font-bold text-blue-500 uppercase tracking-widest border-b border-slate-850 pb-2">
                          <UserCheck size={14} />
                          <span>Customer Details</span>
                        </div>
                        <div className="space-y-1 text-xs text-slate-300">
                          <p className="font-semibold text-slate-100 text-sm">{richOrderDetails.customer.name}</p>
                          <p className="text-slate-400">Email: {richOrderDetails.customer.email}</p>
                          <p className="text-slate-400">Phone: {richOrderDetails.customer.phone}</p>
                          {richOrderDetails.customer.id && <p className="text-[10px] text-slate-500">Customer ID: #{richOrderDetails.customer.id}</p>}
                        </div>
                        <div className="pt-2 border-t border-slate-850 flex justify-between text-[11px] text-slate-400">
                          <span>Previous Orders: <strong>{richOrderDetails.customer.previous_orders_count}</strong></span>
                          <span>Total Customer Spending: <strong>₹{richOrderDetails.customer.total_spending}</strong></span>
                        </div>
                      </div>

                      {/* SECTION 3 — DELIVERY ADDRESS */}
                      <div className="bg-slate-950 p-5 border border-slate-800 space-y-3">
                        <div className="flex items-center space-x-2 text-xs font-bold text-blue-500 uppercase tracking-widest border-b border-slate-850 pb-2">
                          <MapPin size={14} />
                          <span>Delivery Address</span>
                        </div>
                        <div className="space-y-1 text-xs text-slate-300">
                          <p className="font-semibold text-slate-100">{richOrderDetails.customer.name}</p>
                          <p className="text-slate-300">{richOrderDetails.customer.address}</p>
                          <p className="text-slate-400">
                            {richOrderDetails.customer.city}, {richOrderDetails.customer.state} - {richOrderDetails.customer.pincode}
                          </p>
                          <p className="text-slate-400">India • Phone: {richOrderDetails.customer.phone}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-850 text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                          Shipping Method: FREE SHIPPING
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4 — ORDER ITEMS */}
                    <div className="bg-slate-950 p-5 border border-slate-800 space-y-4">
                      <div className="flex items-center space-x-2 text-xs font-bold text-blue-500 uppercase tracking-widest border-b border-slate-850 pb-2">
                        <Box size={14} />
                        <span>Order Items ({richOrderDetails.items.length})</span>
                      </div>

                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {richOrderDetails.items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between bg-slate-900 p-3 border border-slate-850 text-xs">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
                                <img src={item.thumbnail || "/uploads/product_placeholder.jpg"} alt={item.product_name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-100">{item.product_name}</p>
                                <p className="text-[10px] text-slate-400">
                                  Qty: {item.quantity} • SKU: {item.sku} {item.variant ? `• Variant: ${item.variant}` : ""}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-100">₹{item.subtotal}</p>
                              <p className="text-[10px] text-slate-400">MRP: ₹{item.mrp} x {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* SECTION 5 — PRICE BREAKDOWN */}
                      <div className="bg-slate-950 p-5 border border-slate-800 space-y-3">
                        <div className="flex items-center space-x-2 text-xs font-bold text-blue-500 uppercase tracking-widest border-b border-slate-850 pb-2">
                          <CreditCard size={14} />
                          <span>Price Breakdown</span>
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-300">
                          <div className="flex justify-between">
                            <span className="text-slate-400">MRP Total</span>
                            <span>₹{richOrderDetails.pricing.mrp_total}</span>
                          </div>
                          {richOrderDetails.pricing.product_discount > 0 && (
                            <div className="flex justify-between text-blue-400">
                              <span>Product Discount</span>
                              <span>-₹{richOrderDetails.pricing.product_discount}</span>
                            </div>
                          )}
                          {richOrderDetails.pricing.voucher_discount > 0 && (
                            <div className="flex justify-between text-emerald-400">
                              <span>Voucher Discount</span>
                              <span>-₹{richOrderDetails.pricing.voucher_discount}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-slate-400">Subtotal</span>
                            <span>₹{richOrderDetails.pricing.subtotal}</span>
                          </div>
                          <div className="flex justify-between text-emerald-400">
                            <span>Shipping</span>
                            <span className="font-bold">FREE</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Tax / GST</span>
                            <span>Included</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-slate-100">
                            <span>TOTAL PAID</span>
                            <span>₹{richOrderDetails.pricing.total}</span>
                          </div>
                          {richOrderDetails.pricing.customer_saved > 0 && (
                            <div className="pt-1 text-[11px] text-emerald-400 font-bold text-right">
                              Customer Saved: ₹{richOrderDetails.pricing.customer_saved}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* SECTION 6 — PAYMENT DETAILS */}
                      <div className="bg-slate-950 p-5 border border-slate-800 space-y-3">
                        <div className="flex items-center space-x-2 text-xs font-bold text-blue-500 uppercase tracking-widest border-b border-slate-850 pb-2">
                          <FileText size={14} />
                          <span>Payment Details</span>
                        </div>
                        <div className="space-y-1 text-xs text-slate-300">
                          <p><span className="text-slate-400">Payment Method:</span> <strong className="text-slate-100">{richOrderDetails.payment_id || "UPI"}</strong></p>
                          <p>
                            <span className="text-slate-400">Status:</span>{" "}
                            <span className={`font-bold ${richOrderDetails.payment_status === "PAYMENT_CONFIRMED" || richOrderDetails.payment_status === "paid" ? "text-emerald-400" : "text-blue-400"}`}>
                              {richOrderDetails.payment_status}
                            </span>
                          </p>
                          {richOrderDetails.payment_confirmed_at && (
                            <p><span className="text-slate-400">Confirmed At:</span> {new Date(richOrderDetails.payment_confirmed_at).toLocaleString()}</p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-850 flex gap-2">
                          {richOrderDetails.payment_status === "PAYMENT_PENDING" ? (
                            <button
                              onClick={() => {
                                handleConfirmPaymentClick(richOrderDetails);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider"
                            >
                              Confirm Payment
                            </button>
                          ) : (
                            <button
                              onClick={() => handleResendConfirmation(richOrderDetails.order_number)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1"
                            >
                              <RefreshCw size={12} />
                              <span>Resend Email</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* SECTION 7 — VOUCHER DETAILS */}
                    <div className="bg-slate-950 p-5 border border-slate-800 space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-blue-500 uppercase tracking-widest border-b border-slate-850 pb-2">
                        <Tag size={14} />
                        <span>Voucher / Offer Details</span>
                      </div>
                      {richOrderDetails.voucher.code ? (
                        <div className="flex items-center justify-between text-xs pt-1">
                          <div>
                            <p className="font-mono font-bold text-emerald-400 text-sm">✓ Voucher Applied: {richOrderDetails.voucher.code}</p>
                            <p className="text-[10px] text-slate-400">Discount Given: ₹{richOrderDetails.voucher.discount_amount}</p>
                          </div>
                          <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900 px-2 py-0.5 text-[10px] font-bold uppercase">
                            Applied
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic pt-1">No voucher code used for this order.</p>
                      )}
                    </div>

                    {/* SECTION 8 — ORDER TIMELINE & STATUS UPDATE */}
                    <div className="bg-slate-950 p-5 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <div className="flex items-center space-x-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
                          <Clock size={14} />
                          <span>Order Status Timeline</span>
                        </div>
                      </div>

                      {/* Status update controls */}
                      <div className="bg-slate-900 p-3 border border-slate-800 space-y-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Update Order Status</span>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <select
                            value={selectedStatusUpdate}
                            onChange={(e) => setSelectedStatusUpdate(e.target.value)}
                            className="bg-slate-950 border border-slate-800 p-2 text-xs text-slate-100 focus:outline-none"
                          >
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="PACKED">PACKED</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="REFUNDED">REFUNDED</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Optional notes..."
                            value={statusUpdateNotes}
                            onChange={(e) => setStatusUpdateNotes(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-800 p-2 text-xs text-slate-100 focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdateOrderStatus(richOrderDetails.order_number)}
                            className="bg-blue-600 hover:bg-blue-500 text-slate-950 text-xs font-bold uppercase px-4 py-2"
                          >
                            Update Status
                          </button>
                        </div>
                      </div>

                      {/* Event timeline feed */}
                      <div className="space-y-2 max-h-44 overflow-y-auto">
                        {richOrderDetails.timeline.map((evt: any) => (
                          <div key={evt.id} className="flex items-center justify-between bg-slate-900 p-2.5 border border-slate-850 text-xs">
                            <div className="flex items-center space-x-2">
                              <CheckCircle2 size={14} className="text-emerald-400" />
                              <div>
                                <span className="font-bold text-slate-200">{evt.status}</span>
                                {evt.notes && <p className="text-[10px] text-slate-400">{evt.notes}</p>}
                              </div>
                            </div>
                            <div className="text-right text-[10px] text-slate-500">
                              <span>{evt.created_by}</span> • {new Date(evt.created_at).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 9 — CUSTOMER COMMUNICATION */}
                    <div className="bg-slate-950 p-5 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <div className="flex items-center space-x-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
                          <Mail size={14} />
                          <span>Customer Communication History</span>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-36 overflow-y-auto text-xs">
                        {richOrderDetails.email_logs.map((log: any) => (
                          <div key={log.id} className="flex justify-between items-center bg-slate-900 p-2.5 border border-slate-850">
                            <div className="flex items-center space-x-2">
                              <CheckCircle2 size={14} className="text-emerald-400" />
                              <div>
                                <p className="font-semibold text-slate-200">{log.email_type}</p>
                                <p className="text-[10px] text-slate-400">To: {log.recipient_email}</p>
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 font-bold uppercase bg-emerald-950/40 text-emerald-400 border border-emerald-900">
                              {log.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 10 — INTERNAL ADMIN NOTES */}
                    <div className="bg-slate-950 p-5 border border-slate-800 space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-bold text-blue-500 uppercase tracking-widest border-b border-slate-850 pb-2">
                        <FileText size={14} />
                        <span>Internal Admin Notes (Private Staff Notes)</span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add internal note for staff..."
                          value={newAdminNoteText}
                          onChange={(e) => setNewAdminNoteText(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 p-2 text-xs text-slate-100 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddAdminNote(richOrderDetails.order_number)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 text-xs font-bold uppercase"
                        >
                          Add Note
                        </button>
                      </div>

                      <div className="space-y-2 max-h-36 overflow-y-auto text-xs pt-1">
                        {richOrderDetails.admin_notes.length === 0 ? (
                          <p className="text-slate-500 italic text-xs">No internal notes added yet.</p>
                        ) : (
                          richOrderDetails.admin_notes.map((n: any) => (
                            <div key={n.id} className="bg-slate-900 p-2.5 border border-slate-850">
                              <p className="text-slate-200">{n.note}</p>
                              <p className="text-[9px] text-slate-500 mt-1">By {n.admin_name} on {new Date(n.created_at).toLocaleString()}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-800">
                      <button
                        onClick={() => setRichOrderDetails(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-2.5 text-xs font-bold uppercase tracking-widest"
                      >
                        Close Drawer
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* ORDERS TABLE */}
              <div className="bg-slate-950 border border-slate-800 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4">Order Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 italic">No orders found in database.</td>
                      </tr>
                    ) : (
                      orders
                        .filter((o) => {
                          const matchesSearch = !orderSearch || 
                            o.order_number.toLowerCase().includes(orderSearch.toLowerCase());
                          const matchesPayment = filterPaymentStatus === "ALL" || o.payment_status === filterPaymentStatus;
                          const matchesOrder = filterOrderStatus === "ALL" || o.order_status === filterOrderStatus;
                          return matchesSearch && matchesPayment && matchesOrder;
                        })
                        .map((ord) => {
                          const isPending = ord.payment_status === "PAYMENT_PENDING" || ord.payment_status === "pending";
                          const isConfirmed = ord.payment_status === "PAYMENT_CONFIRMED" || ord.payment_status === "paid";
                          
                          return (
                            <tr key={ord.id} className="border-b border-slate-850 hover:bg-slate-900/50">
                              <td className="p-4 font-mono font-bold text-slate-200">#{ord.order_number}</td>
                              <td className="p-4 text-slate-400 font-mono text-[11px]">{new Date(ord.created_at).toLocaleDateString()}</td>
                              <td className="p-4 text-slate-300 font-medium">Customer #{ord.customer_id}</td>
                              <td className="p-4 font-bold text-slate-100">₹{ord.total}</td>
                              
                              <td className="p-4">
                                {isConfirmed ? (
                                  <span className="text-emerald-400 bg-emerald-950/40 px-2.5 py-1 border border-emerald-900 font-bold text-[10px] tracking-wider uppercase inline-flex items-center gap-1">
                                    <Check size={10} /> PAYMENT CONFIRMED
                                  </span>
                                ) : isPending ? (
                                  <span className="text-blue-400 bg-blue-950/40 px-2.5 py-1 border border-blue-900 font-bold text-[10px] tracking-wider uppercase inline-flex items-center gap-1">
                                    <Clock size={10} /> PAYMENT PENDING
                                  </span>
                                ) : (
                                  <span className="text-red-400 bg-red-950/40 px-2.5 py-1 border border-red-900 font-bold text-[10px] tracking-wider uppercase">
                                    {ord.payment_status}
                                  </span>
                                )}
                              </td>

                              <td className="p-4">
                                <span className="text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
                                  {ord.order_status}
                                </span>
                              </td>

                              <td className="p-4 text-right space-x-2">
                                {isPending && (
                                  <button
                                    onClick={() => handleConfirmPaymentClick(ord)}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider inline-flex items-center gap-1"
                                    title="Confirm UPI Payment"
                                  >
                                    <Check size={12} /> Confirm Payment
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    fetchRichOrderDetails(ord.order_number);
                                  }}
                                  className="border border-blue-800 text-blue-400 hover:bg-blue-950/40 px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider"
                                >
                                  Full 10-Sec Details
                                </button>
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SHIPPING ANALYTICS */}
          {activeTab === "shipping" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                    <Truck className="text-blue-500" size={22} />
                    <span>Shipping Analytics & Regional Revenue</span>
                  </h2>
                  <p className="text-xs text-slate-400">Track regional distribution, state-level shipping revenue, and order breakdown (Tamil Nadu ₹80 vs Outside TN ₹150).</p>
                </div>
                <button
                  onClick={loadAdminData}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 text-xs font-semibold uppercase flex items-center space-x-1.5"
                >
                  <RefreshCw size={14} />
                  <span>Refresh Analytics</span>
                </button>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-5 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Orders Processed</span>
                  <p className="text-2xl font-bold text-slate-100">{shippingAnalytics.total_orders}</p>
                  <p className="text-[11px] text-slate-500">All regions</p>
                </div>

                <div className="bg-slate-950 p-5 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold">Tamil Nadu Orders (₹80)</span>
                  <p className="text-2xl font-bold text-blue-400">{shippingAnalytics.tn_orders}</p>
                  <p className="text-[11px] text-slate-400">TN Revenue: ₹{(shippingAnalytics.tn_orders * 80).toLocaleString("en-IN")}</p>
                </div>

                <div className="bg-slate-950 p-5 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Outside TN Orders (₹150)</span>
                  <p className="text-2xl font-bold text-emerald-400">{shippingAnalytics.outside_tn_orders}</p>
                  <p className="text-[11px] text-slate-400">Outside TN Revenue: ₹{(shippingAnalytics.outside_tn_orders * 150).toLocaleString("en-IN")}</p>
                </div>

                <div className="bg-slate-950 p-5 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Shipping Revenue</span>
                  <p className="text-2xl font-bold text-slate-100">₹{shippingAnalytics.total_shipping_revenue.toLocaleString("en-IN")}</p>
                  <p className="text-[11px] text-slate-500">Avg per order: ₹{shippingAnalytics.avg_shipping_charge}</p>
                </div>
              </div>

              {/* State Breakdown Table */}
              <div className="bg-slate-950 p-6 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Shipping Revenue & Orders by State</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">State</th>
                        <th className="py-3 px-4">Orders Count</th>
                        <th className="py-3 px-4">Applicable Rate</th>
                        <th className="py-3 px-4 text-right">Shipping Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {shippingAnalytics.revenue_by_state && shippingAnalytics.revenue_by_state.length > 0 ? (
                        shippingAnalytics.revenue_by_state.map((row: any, idx: number) => {
                          const isTN = row.state.toLowerCase().includes("tamil");
                          return (
                            <tr key={idx} className="hover:bg-slate-900/60">
                              <td className="py-3 px-4 font-semibold text-slate-100">{row.state}</td>
                              <td className="py-3 px-4">{row.orders}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isTN ? "bg-blue-950/60 text-blue-400 border border-blue-800" : "bg-emerald-950/60 text-emerald-400 border border-emerald-800"}`}>
                                  {isTN ? "₹80 (Tamil Nadu)" : "₹150 (Outside TN)"}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right font-bold text-slate-100">₹{row.revenue.toLocaleString("en-IN")}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-500 font-sans">No shipping revenue recorded yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: OFFERS & VOUCHERS CMS */}
          {activeTab === "offers" && (

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                    <Tag className="text-blue-500" size={22} />
                    <span>Offers & Vouchers Management</span>
                  </h2>
                  <p className="text-xs text-slate-400">Control promotional vouchers, percentage discounts, flat offers, and free shipping codes.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingOffer(null);
                    setNewOffer({
                      name: "", code: "", description: "", offer_type: "percentage",
                      discount_value: 10, minimum_order_value: 0, maximum_discount: null,
                      start_date: null, end_date: null, usage_limit: null, per_customer_limit: 1,
                      first_order_only: false, exclude_sale_products: false, active: true
                    });
                    setShowAddOfferModal(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-400 text-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
                >
                  <Plus size={14} />
                  <span>Create Offer</span>
                </button>
              </div>

              {/* ANALYTICS WIDGETS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-5 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Total Offers</span>
                  <p className="text-2xl font-bold text-slate-100">{offerAnalytics.total_offers}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Active Offers</span>
                  <p className="text-2xl font-bold text-emerald-400">{offerAnalytics.active_offers}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Expired Offers</span>
                  <p className="text-2xl font-bold text-red-400">{offerAnalytics.expired_offers}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Total Voucher Uses</span>
                  <p className="text-2xl font-bold text-blue-400">{offerAnalytics.total_uses}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Total Discount Given</span>
                  <p className="text-2xl font-bold text-blue-400">₹{offerAnalytics.total_discount}</p>
                </div>
              </div>

              {/* CREATE / EDIT OFFER MODAL */}
              {showAddOfferModal && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
                  <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-lg font-bold text-slate-100">
                        {editingOffer ? "Edit Promotional Offer" : "Create New Promotional Offer"}
                      </h3>
                      <button onClick={() => setShowAddOfferModal(false)} className="text-slate-400 hover:text-slate-100">
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveOffer} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Offer Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Qura First Order Offer"
                            value={newOffer.name}
                            onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Voucher Code *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. QURA10"
                            value={newOffer.code}
                            onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value.toUpperCase() })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-100 font-mono font-bold uppercase focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Description</label>
                        <input
                          type="text"
                          placeholder="e.g. Get 10% off on your first order."
                          value={newOffer.description || ""}
                          onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Offer Type *</label>
                          <select
                            value={newOffer.offer_type}
                            onChange={(e) => setNewOffer({ ...newOffer, offer_type: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none"
                          >
                            <option value="percentage">Percentage Discount (%)</option>
                            <option value="flat">Flat Amount Discount (₹)</option>
                            <option value="free_shipping">Free Shipping</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Discount Value *</label>
                          <input
                            type="number"
                            required
                            value={newOffer.discount_value}
                            onChange={(e) => setNewOffer({ ...newOffer, discount_value: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Minimum Order (₹)</label>
                          <input
                            type="number"
                            value={newOffer.minimum_order_value}
                            onChange={(e) => setNewOffer({ ...newOffer, minimum_order_value: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Usage Limit</label>
                          <input
                            type="number"
                            placeholder="e.g. 100 (Leave empty for unlimited)"
                            value={newOffer.usage_limit || ""}
                            onChange={(e) => setNewOffer({ ...newOffer, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Per Customer Limit</label>
                          <input
                            type="number"
                            value={newOffer.per_customer_limit || 1}
                            onChange={(e) => setNewOffer({ ...newOffer, per_customer_limit: parseInt(e.target.value) || 1 })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-100 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 pt-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newOffer.first_order_only}
                            onChange={(e) => setNewOffer({ ...newOffer, first_order_only: e.target.checked })}
                            className="rounded bg-slate-950 border-slate-800"
                          />
                          <span className="text-slate-300">First Order Only</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newOffer.active}
                            onChange={(e) => setNewOffer({ ...newOffer, active: e.target.checked })}
                            className="rounded bg-slate-950 border-slate-800"
                          />
                          <span className="text-slate-300">Active</span>
                        </label>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setShowAddOfferModal(false)}
                          className="border border-slate-700 hover:bg-slate-800 text-slate-300 px-5 py-2.5 font-bold uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-400 text-slate-950 px-6 py-2.5 font-bold uppercase tracking-wider"
                        >
                          Save Offer
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* OFFERS TABLE */}
              <div className="bg-slate-950 border border-slate-800 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                      <th className="p-4">Offer Name</th>
                      <th className="p-4">Code</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Value</th>
                      <th className="p-4">Min Order</th>
                      <th className="p-4">Usage</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500 italic">No offers found. Create your first promotional voucher.</td>
                      </tr>
                    ) : (
                      offers.map((off) => (
                        <tr key={off.id} className="border-b border-slate-850 hover:bg-slate-900/50">
                          <td className="p-4 font-bold text-slate-100">{off.name}</td>
                          <td className="p-4 font-mono font-bold text-emerald-400">{off.code}</td>
                          <td className="p-4 text-slate-300 uppercase text-[10px]">{off.offer_type}</td>
                          <td className="p-4 font-bold text-slate-100">
                            {off.offer_type === "percentage" ? `${off.discount_value}%` : `₹${off.discount_value}`}
                          </td>
                          <td className="p-4 text-slate-400">₹{off.minimum_order_value}</td>
                          <td className="p-4 text-slate-300 font-mono">{off.used_count} / {off.usage_limit || "∞"}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase border ${off.active ? "bg-emerald-950/40 text-emerald-400 border-emerald-900" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                              {off.active ? "ACTIVE" : "DISABLED"}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleOfferActive(off)}
                              className="border border-slate-700 text-slate-300 hover:bg-slate-800 px-2.5 py-1 text-[10px] uppercase font-bold"
                            >
                              {off.active ? "Disable" : "Enable"}
                            </button>
                            <button
                              onClick={() => {
                                setEditingOffer(off);
                                setNewOffer({ ...off });
                                setShowAddOfferModal(true);
                              }}
                              className="border border-blue-800 text-blue-400 hover:bg-blue-950/40 px-2.5 py-1 text-[10px] uppercase font-bold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteOffer(off.id)}
                              className="border border-red-900 text-red-400 hover:bg-red-950/40 px-2.5 py-1 text-[10px] uppercase font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CONTENT & MEDIA CMS */}
          {activeTab === "content" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Image size={20} className="text-blue-500" />
                    <span>Content & Media Manager</span>
                  </h2>
                  <p className="text-xs text-slate-400">Manage hero banners, floating results gallery, and founder story without touching code.</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1">
                  <button
                    onClick={() => setContentSubTab("banners")}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                      contentSubTab === "banners" ? "bg-blue-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Hero Banners ({heroBanners.length})
                  </button>
                  <button
                    onClick={() => setContentSubTab("results")}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                      contentSubTab === "results" ? "bg-blue-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Results Gallery ({resultGalleryItems.length})
                  </button>
                  <button
                    onClick={() => setContentSubTab("founder")}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                      contentSubTab === "founder" ? "bg-blue-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Founder Story
                  </button>
                </div>
              </div>

              {/* SUB-TAB 1: HERO BANNERS */}
              {contentSubTab === "banners" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Active Landing Banners</h3>
                    <button
                      onClick={() => {
                        setEditingBanner(null);
                        setNewBanner({
                          desktop_image: "/uploads/hero_main.jpg",
                          mobile_image: "/uploads/hero_main.jpg",
                          heading: "",
                          subheading: "",
                          cta_text: "EXPLORE PRODUCTS",
                          cta_link: "/shop",
                          display_order: heroBanners.length + 1,
                          active: true
                        });
                        setShowAddBannerModal(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-bold px-4 py-2 uppercase flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Hero Banner
                    </button>
                  </div>

                  {/* HERO BANNER MODAL */}
                  {showAddBannerModal && (
                    <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
                      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <h3 className="text-base font-bold text-slate-100">
                            {editingBanner ? "Edit Hero Banner" : "Create New Hero Banner"}
                          </h3>
                          <button onClick={() => setShowAddBannerModal(false)} className="text-slate-400 hover:text-slate-200"><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSaveHeroBanner} className="space-y-4 text-xs">
                          <div>
                            <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Banner Desktop Image URL / File</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                required
                                value={newBanner.desktop_image}
                                onChange={(e) => setNewBanner({ ...newBanner, desktop_image: e.target.value })}
                                className="flex-1 bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                              />
                              <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 cursor-pointer font-bold flex items-center gap-1">
                                <Upload size={14} />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                      const url = await handleFileUpload(e.target.files[0]);
                                      setNewBanner({ ...newBanner, desktop_image: url });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Banner Heading</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Healthy Skin, Naturally."
                              value={newBanner.heading}
                              onChange={(e) => setNewBanner({ ...newBanner, heading: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Subheading / Description</label>
                            <textarea
                              rows={3}
                              placeholder="Thoughtfully crafted skincare inspired by nature..."
                              value={newBanner.subheading || ""}
                              onChange={(e) => setNewBanner({ ...newBanner, subheading: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">CTA Button Text</label>
                              <input
                                type="text"
                                value={newBanner.cta_text}
                                onChange={(e) => setNewBanner({ ...newBanner, cta_text: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">CTA Button Link</label>
                              <input
                                type="text"
                                value={newBanner.cta_link}
                                onChange={(e) => setNewBanner({ ...newBanner, cta_link: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 items-center pt-2">
                            <div>
                              <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Display Order</label>
                              <input
                                type="number"
                                value={newBanner.display_order}
                                onChange={(e) => setNewBanner({ ...newBanner, display_order: parseInt(e.target.value) || 1 })}
                                className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div className="flex items-center space-x-2 pt-4">
                              <input
                                type="checkbox"
                                id="active_banner"
                                checked={newBanner.active}
                                onChange={(e) => setNewBanner({ ...newBanner, active: e.target.checked })}
                                className="w-4 h-4 accent-blue-500"
                              />
                              <label htmlFor="active_banner" className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">Banner Active</label>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                            <button
                              type="button"
                              onClick={() => setShowAddBannerModal(false)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 uppercase font-bold"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="bg-blue-500 hover:bg-blue-400 text-slate-950 px-6 py-2 uppercase font-bold"
                            >
                              Save Banner
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* BANNERS TABLE */}
                  <div className="bg-slate-950 border border-slate-800 overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                          <th className="p-4">Preview</th>
                          <th className="p-4">Heading</th>
                          <th className="p-4">CTA</th>
                          <th className="p-4">Order</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {heroBanners.length === 0 ? (
                          <tr><td colSpan={6} className="p-8 text-center text-slate-500 italic">No hero banners created yet.</td></tr>
                        ) : (
                          heroBanners.map((b) => (
                            <tr key={b.id} className="border-b border-slate-850 hover:bg-slate-900/50">
                              <td className="p-4">
                                <div className="w-16 h-10 bg-slate-900 border border-slate-800 rounded overflow-hidden">
                                  <img src={b.desktop_image} alt={b.heading} className="w-full h-full object-cover" />
                                </div>
                              </td>
                              <td className="p-4 font-bold text-slate-200">{b.heading}</td>
                              <td className="p-4 text-slate-400">{b.cta_text} ({b.cta_link})</td>
                              <td className="p-4 font-mono font-bold text-blue-500">#{b.display_order}</td>
                              <td className="p-4">
                                {b.active ? (
                                  <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-900 font-bold text-[9px] uppercase">ACTIVE</span>
                                ) : (
                                  <span className="text-slate-500 bg-slate-900 px-2 py-0.5 border border-slate-800 font-bold text-[9px] uppercase">DISABLED</span>
                                )}
                              </td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingBanner(b);
                                    setNewBanner({ ...b });
                                    setShowAddBannerModal(true);
                                  }}
                                  className="text-slate-300 hover:text-blue-400 p-1.5 bg-slate-900 border border-slate-800"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteHeroBanner(b.id)}
                                  className="text-slate-400 hover:text-red-400 p-1.5 bg-slate-900 border border-slate-800"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: RESULTS GALLERY */}
              {contentSubTab === "results" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 font-mono">Floating Routine Results Items</h3>
                    <button
                      onClick={() => {
                        setEditingResult(null);
                        setNewResult({
                          image: "/uploads/product_placeholder.jpg",
                          title: "",
                          description: "",
                          product_used: "",
                          customer_name: "",
                          duration: "",
                          display_order: resultGalleryItems.length + 1,
                          active: true
                        });
                        setShowAddResultModal(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-bold px-4 py-2 uppercase flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Result Item
                    </button>
                  </div>

                  {/* RESULT ITEM MODAL */}
                  {showAddResultModal && (
                    <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
                      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <h3 className="text-base font-bold text-slate-100">
                            {editingResult ? "Edit Result Item" : "Create New Result Gallery Item"}
                          </h3>
                          <button onClick={() => setShowAddResultModal(false)} className="text-slate-400 hover:text-slate-200"><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSaveResultItem} className="space-y-4 text-xs">
                          <div>
                            <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Result Image URL / File</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                required
                                value={newResult.image}
                                onChange={(e) => setNewResult({ ...newResult, image: e.target.value })}
                                className="flex-1 bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                              />
                              <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 cursor-pointer font-bold flex items-center gap-1">
                                <Upload size={14} />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                      const url = await handleFileUpload(e.target.files[0]);
                                      setNewResult({ ...newResult, image: url });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Result Title</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Overnight Hydration & Barrier Repair"
                              value={newResult.title}
                              onChange={(e) => setNewResult({ ...newResult, title: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Description / Observations</label>
                            <textarea
                              rows={3}
                              placeholder="Noticeable improvement in skin texture..."
                              value={newResult.description || ""}
                              onChange={(e) => setNewResult({ ...newResult, description: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Product Used</label>
                              <input
                                type="text"
                                placeholder="Avocado Pro Nourish Night Cream"
                                value={newResult.product_used || ""}
                                onChange={(e) => setNewResult({ ...newResult, product_used: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Duration / Period</label>
                              <input
                                type="text"
                                placeholder="4 Weeks Daily Use"
                                value={newResult.duration || ""}
                                onChange={(e) => setNewResult({ ...newResult, duration: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                            <button
                              type="button"
                              onClick={() => setShowAddResultModal(false)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 uppercase font-bold"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="bg-blue-500 hover:bg-blue-400 text-slate-950 px-6 py-2 uppercase font-bold"
                            >
                              Save Result Item
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* RESULTS TABLE */}
                  <div className="bg-slate-950 border border-slate-800 overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                          <th className="p-4">Preview</th>
                          <th className="p-4">Title</th>
                          <th className="p-4">Product Used</th>
                          <th className="p-4">Duration</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultGalleryItems.length === 0 ? (
                          <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic">No result items added yet.</td></tr>
                        ) : (
                          resultGalleryItems.map((r) => (
                            <tr key={r.id} className="border-b border-slate-850 hover:bg-slate-900/50">
                              <td className="p-4">
                                <div className="w-14 h-10 bg-slate-900 border border-slate-800 rounded overflow-hidden">
                                  <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
                                </div>
                              </td>
                              <td className="p-4 font-bold text-slate-200">{r.title}</td>
                              <td className="p-4 text-slate-400">{r.product_used || "General Routine"}</td>
                              <td className="p-4 text-blue-500 font-bold">{r.duration || "N/A"}</td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingResult(r);
                                    setNewResult({ ...r });
                                    setShowAddResultModal(true);
                                  }}
                                  className="text-slate-300 hover:text-blue-400 p-1.5 bg-slate-900 border border-slate-800"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteResultItem(r.id)}
                                  className="text-slate-400 hover:text-red-400 p-1.5 bg-slate-900 border border-slate-800"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: FOUNDER STORY */}
              {contentSubTab === "founder" && (
                <div className="bg-slate-950 border border-slate-800 p-6 max-w-2xl space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500">Founder & Brand Story CMS</h3>

                  <form onSubmit={handleSaveFounderStory} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Founder Name</label>
                      <input
                        type="text"
                        value={founderStory.name || ""}
                        onChange={(e) => setFounderStory({ ...founderStory, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Founder Title</label>
                      <input
                        type="text"
                        value={founderStory.title || ""}
                        onChange={(e) => setFounderStory({ ...founderStory, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Founder Photo URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={founderStory.image || ""}
                          onChange={(e) => setFounderStory({ ...founderStory, image: e.target.value })}
                          className="flex-1 bg-slate-900 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                        />
                        <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 cursor-pointer font-bold flex items-center gap-1">
                          <Upload size={14} />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files?.[0]) {
                                const url = await handleFileUpload(e.target.files[0]);
                                setFounderStory({ ...founderStory, image: url });
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Brand Philosophy Quote</label>
                      <input
                        type="text"
                        value={founderStory.quote || ""}
                        onChange={(e) => setFounderStory({ ...founderStory, quote: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Story Description</label>
                      <textarea
                        rows={4}
                        value={founderStory.description || ""}
                        onChange={(e) => setFounderStory({ ...founderStory, description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-400 text-slate-950 px-6 py-2.5 text-xs font-bold uppercase tracking-widest"
                    >
                      Save Founder Story
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB: REAL RESULTS MANAGEMENT */}
          {activeTab === "real-results" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="text-amber-500" size={22} />
                    <span>Real Results Management</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Manage customer before/after transformations, skin concerns, and product ritual stories visible on the website.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingRealResult(null);
                    setRealResultForm({
                      customer_name: "",
                      customer_location: "",
                      before_image: "/uploads/product_placeholder.jpg",
                      after_image: "/uploads/product_placeholder.jpg",
                      description: "",
                      product_used: "",
                      duration: "",
                      skin_concern: "",
                      display_order: realResults.length + 1,
                      active: true,
                    });
                    setShowRealResultModal(true);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors rounded"
                >
                  <Plus size={16} />
                  <span>Add New Result</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-950 p-4 border border-slate-800 rounded">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search by customer, concern, or product..."
                    value={realResultsSearch}
                    onChange={(e) => setRealResultsSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-2 pl-9 text-xs text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                  />
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Status:</span>
                  <select
                    value={realResultsFilterStatus}
                    onChange={(e: any) => setRealResultsFilterStatus(e.target.value)}
                    className="bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                  >
                    <option value="all">All Results ({realResults.length})</option>
                    <option value="published">Published Only ({realResults.filter(r => r.active).length})</option>
                    <option value="hidden">Hidden Only ({realResults.filter(r => !r.active).length})</option>
                  </select>
                </div>
              </div>

              {/* Real Results Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realResults
                  .filter((item) => {
                    const matchesSearch =
                      (item.customer_name || "").toLowerCase().includes(realResultsSearch.toLowerCase()) ||
                      (item.skin_concern || "").toLowerCase().includes(realResultsSearch.toLowerCase()) ||
                      (item.product_used || "").toLowerCase().includes(realResultsSearch.toLowerCase());
                    const matchesStatus =
                      realResultsFilterStatus === "all"
                        ? true
                        : realResultsFilterStatus === "published"
                        ? item.active
                        : !item.active;
                    return matchesSearch && matchesStatus;
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-3">
                        {/* Before / After Image Split */}
                        <div className="grid grid-cols-2 gap-2 h-36">
                          <div className="relative border border-slate-800 overflow-hidden rounded bg-slate-900 flex flex-col items-center justify-center">
                            <span className="absolute top-1.5 left-1.5 bg-slate-950/80 text-slate-200 text-[9px] font-mono uppercase px-1.5 py-0.5 z-10 rounded">
                              Before
                            </span>
                            <img src={item.before_image || "/uploads/product_placeholder.jpg"} alt="Before" className="w-full h-full object-cover" />
                          </div>
                          <div className="relative border border-slate-800 overflow-hidden rounded bg-slate-900 flex flex-col items-center justify-center">
                            <span className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 font-bold text-[9px] font-mono uppercase px-1.5 py-0.5 z-10 rounded">
                              After
                            </span>
                            <img src={item.after_image || "/uploads/product_placeholder.jpg"} alt="After" className="w-full h-full object-cover" />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-slate-100 text-sm">{item.customer_name}</h3>
                            <button
                              onClick={() => handleToggleRealResult(item.id)}
                              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 font-bold rounded transition-colors ${
                                item.active
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                                  : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                              }`}
                            >
                              {item.active ? "Published" : "Hidden"}
                            </button>
                          </div>
                          {item.customer_location && (
                            <p className="text-[11px] text-slate-400">{item.customer_location}</p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          {item.skin_concern && (
                            <span className="bg-slate-900 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                              Concern: {item.skin_concern}
                            </span>
                          )}
                          {item.product_used && (
                            <span className="bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                              Ritual: {item.product_used}
                            </span>
                          )}
                          {item.duration && (
                            <span className="bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                              Timeline: {item.duration}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 italic line-clamp-3 leading-relaxed border-t border-slate-800/80 pt-2">
                          &ldquo;{item.description}&rdquo;
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                        <span className="text-[10px] text-slate-500 font-mono">Display Order: #{item.display_order}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingRealResult(item);
                              setRealResultForm({
                                customer_name: item.customer_name || "",
                                customer_location: item.customer_location || "",
                                before_image: item.before_image || "/uploads/product_placeholder.jpg",
                                after_image: item.after_image || "/uploads/product_placeholder.jpg",
                                description: item.description || "",
                                product_used: item.product_used || "",
                                duration: item.duration || "",
                                skin_concern: item.skin_concern || "",
                                display_order: item.display_order || 1,
                                active: item.active ?? true,
                              });
                              setShowRealResultModal(true);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-200 p-2 text-xs font-semibold rounded border border-slate-800 transition-colors"
                            title="Edit Result"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            onClick={() => setRealResultDeleteId(item.id)}
                            className="bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 p-2 text-xs font-semibold rounded border border-slate-800 transition-colors"
                            title="Delete Result"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Add / Edit Real Result Modal */}
              {showRealResultModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-lg font-semibold text-slate-100">
                        {editingRealResult ? "Edit Real Result" : "Add New Real Result"}
                      </h3>
                      <button
                        onClick={() => setShowRealResultModal(false)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveRealResult} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Customer Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ananya S."
                            value={realResultForm.customer_name}
                            onChange={(e) => setRealResultForm({ ...realResultForm, customer_name: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Customer Location (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Coimbatore, TN"
                            value={realResultForm.customer_location}
                            onChange={(e) => setRealResultForm({ ...realResultForm, customer_location: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Skin Concern</label>
                          <input
                            type="text"
                            placeholder="e.g. Hyperpigmentation"
                            value={realResultForm.skin_concern}
                            onChange={(e) => setRealResultForm({ ...realResultForm, skin_concern: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Product Used</label>
                          <input
                            type="text"
                            placeholder="e.g. Glow Radiant Plus"
                            value={realResultForm.product_used}
                            onChange={(e) => setRealResultForm({ ...realResultForm, product_used: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Duration / Timeline</label>
                          <input
                            type="text"
                            placeholder="e.g. 4 Weeks"
                            value={realResultForm.duration}
                            onChange={(e) => setRealResultForm({ ...realResultForm, duration: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>
                      </div>

                      {/* Before Image & After Image Upload Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Before Image */}
                        <div className="space-y-2 border border-slate-800 bg-slate-950 p-3 rounded">
                          <label className="block text-slate-400 font-bold uppercase tracking-wider">Before Image *</label>
                          <div className="h-32 border border-slate-800 bg-slate-900 rounded overflow-hidden relative flex items-center justify-center">
                            {realResultForm.before_image ? (
                              <img src={realResultForm.before_image} alt="Before Preview" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-slate-600">No Image Uploaded</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <label className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 text-center cursor-pointer font-bold rounded flex items-center justify-center gap-1">
                              <Upload size={14} />
                              <span>Upload Before</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  if (e.target.files?.[0]) {
                                    const url = await handleFileUpload(e.target.files[0]);
                                    setRealResultForm({ ...realResultForm, before_image: url });
                                  }
                                }}
                              />
                            </label>
                            {realResultForm.before_image && (
                              <button
                                type="button"
                                onClick={() => setRealResultForm({ ...realResultForm, before_image: "" })}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded"
                                title="Remove Image"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* After Image */}
                        <div className="space-y-2 border border-slate-800 bg-slate-950 p-3 rounded">
                          <label className="block text-slate-400 font-bold uppercase tracking-wider">After Image *</label>
                          <div className="h-32 border border-slate-800 bg-slate-900 rounded overflow-hidden relative flex items-center justify-center">
                            {realResultForm.after_image ? (
                              <img src={realResultForm.after_image} alt="After Preview" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-slate-600">No Image Uploaded</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <label className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 p-2 text-center cursor-pointer font-bold rounded flex items-center justify-center gap-1">
                              <Upload size={14} />
                              <span>Upload After</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  if (e.target.files?.[0]) {
                                    const url = await handleFileUpload(e.target.files[0]);
                                    setRealResultForm({ ...realResultForm, after_image: url });
                                  }
                                }}
                              />
                            </label>
                            {realResultForm.after_image && (
                              <button
                                type="button"
                                onClick={() => setRealResultForm({ ...realResultForm, after_image: "" })}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded"
                                title="Remove Image"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Customer Story / Result Description *</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Describe the transformation story, skin feel, and results..."
                          value={realResultForm.description}
                          onChange={(e) => setRealResultForm({ ...realResultForm, description: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Display Order</label>
                          <input
                            type="number"
                            value={realResultForm.display_order}
                            onChange={(e) => setRealResultForm({ ...realResultForm, display_order: parseInt(e.target.value) || 1 })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-4">
                          <input
                            type="checkbox"
                            id="realResultActiveCheck"
                            checked={realResultForm.active}
                            onChange={(e) => setRealResultForm({ ...realResultForm, active: e.target.checked })}
                            className="w-4 h-4 accent-amber-500"
                          />
                          <label htmlFor="realResultActiveCheck" className="text-slate-200 font-bold uppercase tracking-wider cursor-pointer">
                            Publish on Website
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setShowRealResultModal(false)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-wider rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider rounded"
                        >
                          {editingRealResult ? "Update Result" : "Save Result"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {realResultDeleteId && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-md w-full p-6 space-y-4 text-center">
                    <AlertCircle size={36} className="text-red-400 mx-auto" />
                    <h3 className="text-base font-semibold text-slate-100">Delete Real Result?</h3>
                    <p className="text-xs text-slate-400">
                      Are you sure you want to permanently delete this Real Result entry? This action cannot be undone.
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        onClick={() => setRealResultDeleteId(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteRealResult(realResultDeleteId)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded"
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: BOTANICAL ROUTINE JOURNEYS MANAGEMENT */}
          {activeTab === "botanical-journeys" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                    <Sparkles className="text-amber-500" size={22} />
                    <span>Botanical Routine Journeys Management</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Manage customer skincare routine journeys, morning & night rituals, progress logs, and homepage interactive gallery.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingBotanicalJourney(null);
                    setBotanicalJourneyForm({
                      title: "",
                      customer_name: "",
                      skin_type: "",
                      skin_concern: "",
                      products_used: "",
                      routine_description: "",
                      morning_routine: "",
                      night_routine: "",
                      duration: "",
                      result_description: "",
                      before_image: "",
                      progress_images: [],
                      final_image: "/uploads/product_placeholder.jpg",
                      display_order: botanicalJourneys.length + 1,
                      active: true,
                    });
                    setShowBotanicalJourneyModal(true);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors rounded"
                >
                  <Plus size={16} />
                  <span>Add New Journey</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-950 p-4 border border-slate-800 rounded">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search by title, profile, or skin type..."
                    value={botanicalJourneysSearch}
                    onChange={(e) => setBotanicalJourneysSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-2 pl-9 text-xs text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                  />
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Status:</span>
                  <select
                    value={botanicalJourneysStatusFilter}
                    onChange={(e: any) => setBotanicalJourneysStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                  >
                    <option value="all">All Journeys ({botanicalJourneys.length})</option>
                    <option value="published">Published Only ({botanicalJourneys.filter(j => j.active).length})</option>
                    <option value="hidden">Hidden Only ({botanicalJourneys.filter(j => !j.active).length})</option>
                  </select>
                </div>
              </div>

              {/* Botanical Journeys Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {botanicalJourneys
                  .filter((item) => {
                    const matchesSearch =
                      (item.title || "").toLowerCase().includes(botanicalJourneysSearch.toLowerCase()) ||
                      (item.customer_name || "").toLowerCase().includes(botanicalJourneysSearch.toLowerCase()) ||
                      (item.skin_type || "").toLowerCase().includes(botanicalJourneysSearch.toLowerCase()) ||
                      (item.products_used || "").toLowerCase().includes(botanicalJourneysSearch.toLowerCase());
                    const matchesStatus =
                      botanicalJourneysStatusFilter === "all"
                        ? true
                        : botanicalJourneysStatusFilter === "published"
                        ? item.active
                        : !item.active;
                    return matchesSearch && matchesStatus;
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-3">
                        {/* Main Final Result Image Thumbnail */}
                        <div className="relative h-44 border border-slate-800 overflow-hidden rounded bg-slate-900">
                          <img
                            src={item.final_image || "/uploads/product_placeholder.jpg"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleToggleBotanicalJourney(item.id)}
                            className={`absolute top-2 right-2 text-[10px] uppercase tracking-wider px-2 py-0.5 font-bold rounded z-10 transition-colors ${
                              item.active
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                            }`}
                          >
                            {item.active ? "Published" : "Hidden"}
                          </button>
                        </div>

                        {/* Details */}
                        <div>
                          <h3 className="font-semibold text-slate-100 text-base">{item.title}</h3>
                          <span className="text-xs text-amber-400 font-mono font-medium block">
                            Profile: {item.customer_name || "Community Member"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          {item.skin_type && (
                            <span className="bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                              Skin: {item.skin_type}
                            </span>
                          )}
                          {item.skin_concern && (
                            <span className="bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                              Concern: {item.skin_concern}
                            </span>
                          )}
                          {item.duration && (
                            <span className="bg-slate-900 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                              Duration: {item.duration}
                            </span>
                          )}
                        </div>

                        {item.products_used && (
                          <p className="text-xs text-slate-400">
                            Products: <strong className="text-slate-200">{item.products_used}</strong>
                          </p>
                        )}

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 border-t border-slate-800/80 pt-2">
                          {item.result_description || item.routine_description}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                        <span className="text-[10px] text-slate-500 font-mono">Display Order: #{item.display_order}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingBotanicalJourney(item);
                              setBotanicalJourneyForm({
                                title: item.title || "",
                                customer_name: item.customer_name || "",
                                skin_type: item.skin_type || "",
                                skin_concern: item.skin_concern || "",
                                products_used: item.products_used || "",
                                routine_description: item.routine_description || "",
                                morning_routine: item.morning_routine || "",
                                night_routine: item.night_routine || "",
                                duration: item.duration || "",
                                result_description: item.result_description || "",
                                before_image: item.before_image || "",
                                progress_images: item.progress_images || [],
                                final_image: item.final_image || "/uploads/product_placeholder.jpg",
                                display_order: item.display_order || 1,
                                active: item.active ?? true,
                              });
                              setShowBotanicalJourneyModal(true);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-200 p-2 text-xs font-semibold rounded border border-slate-800 transition-colors"
                            title="Edit Journey"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            onClick={() => setBotanicalJourneyDeleteId(item.id)}
                            className="bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 p-2 text-xs font-semibold rounded border border-slate-800 transition-colors"
                            title="Delete Journey"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Add / Edit Botanical Journey Modal */}
              {showBotanicalJourneyModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-lg font-semibold text-slate-100">
                        {editingBotanicalJourney ? "Edit Botanical Routine Journey" : "Add New Botanical Routine Journey"}
                      </h3>
                      <button
                        onClick={() => setShowBotanicalJourneyModal(false)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveBotanicalJourney} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Journey Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Overnight Hydration & Barrier Repair"
                            value={botanicalJourneyForm.title}
                            onChange={(e) => setBotanicalJourneyForm({ ...botanicalJourneyForm, title: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Customer / Profile Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Verified Routine Progress"
                            value={botanicalJourneyForm.customer_name}
                            onChange={(e) => setBotanicalJourneyForm({ ...botanicalJourneyForm, customer_name: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Skin Type</label>
                          <input
                            type="text"
                            placeholder="e.g. Dry to Combination"
                            value={botanicalJourneyForm.skin_type}
                            onChange={(e) => setBotanicalJourneyForm({ ...botanicalJourneyForm, skin_type: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Skin Concern</label>
                          <input
                            type="text"
                            placeholder="e.g. Dehydration & Dull Skin"
                            value={botanicalJourneyForm.skin_concern}
                            onChange={(e) => setBotanicalJourneyForm({ ...botanicalJourneyForm, skin_concern: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Duration / Timeline</label>
                          <input
                            type="text"
                            placeholder="e.g. 4 Weeks Daily Use"
                            value={botanicalJourneyForm.duration}
                            onChange={(e) => setBotanicalJourneyForm({ ...botanicalJourneyForm, duration: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Products Used in Routine</label>
                        <input
                          type="text"
                          placeholder="e.g. Avocado Pro Nourish Night Cream & Hydrosol Toner"
                          value={botanicalJourneyForm.products_used}
                          onChange={(e) => setBotanicalJourneyForm({ ...botanicalJourneyForm, products_used: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Morning Ritual Steps</label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Saffron Cleanser & Kumkumadi Drops"
                            value={botanicalJourneyForm.morning_routine}
                            onChange={(e) => setBotanicalJourneyForm({ ...botanicalJourneyForm, morning_routine: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Night Ritual Steps</label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Avocado Night Cream & Moisture Lock Balm"
                            value={botanicalJourneyForm.night_routine}
                            onChange={(e) => setBotanicalJourneyForm({ ...botanicalJourneyForm, night_routine: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Progress & Result Summary *</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Noticeable improvement in skin texture and moisture retention after incorporating..."
                          value={botanicalJourneyForm.result_description}
                          onChange={(e) => setBotanicalJourneyForm({ ...botanicalJourneyForm, result_description: e.target.value, routine_description: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                        />
                      </div>

                      {/* Image Uploads */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Main Final Result Image */}
                        <div className="space-y-2 border border-slate-800 bg-slate-950 p-3 rounded">
                          <label className="block text-slate-400 font-bold uppercase tracking-wider">Main / Final Result Image *</label>
                          <div className="h-36 border border-slate-800 bg-slate-900 rounded overflow-hidden relative flex items-center justify-center">
                            {botanicalJourneyForm.final_image ? (
                              <img src={botanicalJourneyForm.final_image} alt="Final Preview" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-slate-600">No Image Uploaded</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <label className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 p-2 text-center cursor-pointer font-bold rounded flex items-center justify-center gap-1">
                              <Upload size={14} />
                              <span>Upload Main Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  if (e.target.files?.[0]) {
                                    const url = await handleFileUpload(e.target.files[0]);
                                    setBotanicalJourneyForm({ ...botanicalJourneyForm, final_image: url });
                                  }
                                }}
                              />
                            </label>
                            {botanicalJourneyForm.final_image && (
                              <button
                                type="button"
                                onClick={() => setBotanicalJourneyForm({ ...botanicalJourneyForm, final_image: "" })}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded"
                                title="Remove Image"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Optional Before Image */}
                        <div className="space-y-2 border border-slate-800 bg-slate-950 p-3 rounded">
                          <label className="block text-slate-400 font-bold uppercase tracking-wider">Before Image (Optional)</label>
                          <div className="h-36 border border-slate-800 bg-slate-900 rounded overflow-hidden relative flex items-center justify-center">
                            {botanicalJourneyForm.before_image ? (
                              <img src={botanicalJourneyForm.before_image} alt="Before Preview" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-slate-600">No Before Image</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <label className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 text-center cursor-pointer font-bold rounded flex items-center justify-center gap-1">
                              <Upload size={14} />
                              <span>Upload Before</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  if (e.target.files?.[0]) {
                                    const url = await handleFileUpload(e.target.files[0]);
                                    setBotanicalJourneyForm({ ...botanicalJourneyForm, before_image: url });
                                  }
                                }}
                              />
                            </label>
                            {botanicalJourneyForm.before_image && (
                              <button
                                type="button"
                                onClick={() => setBotanicalJourneyForm({ ...botanicalJourneyForm, before_image: "" })}
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded"
                                title="Remove Image"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div>
                          <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Display Order</label>
                          <input
                            type="number"
                            value={botanicalJourneyForm.display_order}
                            onChange={(e) => setBotanicalJourneyForm({ ...botanicalJourneyForm, display_order: parseInt(e.target.value) || 1 })}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 rounded"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-4">
                          <input
                            type="checkbox"
                            id="botanicalJourneyActiveCheck"
                            checked={botanicalJourneyForm.active}
                            onChange={(e) => setBotanicalJourneyForm({ ...botanicalJourneyForm, active: e.target.checked })}
                            className="w-4 h-4 accent-amber-500"
                          />
                          <label htmlFor="botanicalJourneyActiveCheck" className="text-slate-200 font-bold uppercase tracking-wider cursor-pointer">
                            Publish on Website
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setShowBotanicalJourneyModal(false)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-wider rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider rounded"
                        >
                          {editingBotanicalJourney ? "Update Journey" : "Save Journey"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {botanicalJourneyDeleteId && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-md w-full p-6 space-y-4 text-center">
                    <AlertCircle size={36} className="text-red-400 mx-auto" />
                    <h3 className="text-base font-semibold text-slate-100">Delete Botanical Journey?</h3>
                    <p className="text-xs text-slate-400">
                      Are you sure you want to permanently delete this Botanical Routine Journey entry?
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        onClick={() => setBotanicalJourneyDeleteId(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteBotanicalJourney(botanicalJourneyDeleteId)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded"
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ABOUT PAGE & FOUNDER STORY CMS */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                    <UserCheck className="text-blue-500" size={22} />
                    <span>About Page & Founder Story CMS</span>
                  </h2>
                  <p className="text-xs text-slate-400">Manage brand heritage story, laboratory background, about page hero visuals, and founder bio.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setAboutSubTab("about")}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded ${
                      aboutSubTab === "about" ? "bg-blue-500 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    About Brand
                  </button>
                  <button
                    onClick={() => setAboutSubTab("founder")}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded ${
                      aboutSubTab === "founder" ? "bg-blue-500 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    About Founder
                  </button>
                  <button
                    onClick={() => setAboutSubTab("ceo")}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded ${
                      aboutSubTab === "ceo" ? "bg-blue-500 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    About CEO
                  </button>
                </div>
              </div>

              {/* SUB-TAB 1: ABOUT PAGE EDIT CMS */}
              {aboutSubTab === "about" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-6 space-y-6 rounded">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500">Edit About Page Content</h3>
                    <form onSubmit={handleSaveAboutContent} className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Page Subtitle Tagline</label>
                          <input
                            type="text"
                            value={aboutContent.subtitle || ""}
                            onChange={(e) => setAboutContent({ ...aboutContent, subtitle: e.target.value })}
                            className="bg-slate-900 border border-slate-800 p-2.5 text-slate-100 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Main Page Title</label>
                          <input
                            type="text"
                            value={aboutContent.title || ""}
                            onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                            className="bg-slate-900 border border-slate-800 p-2.5 text-slate-100 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Hero Story Heading</label>
                        <input
                          type="text"
                          value={aboutContent.hero_heading || ""}
                          onChange={(e) => setAboutContent({ ...aboutContent, hero_heading: e.target.value })}
                          className="bg-slate-900 border border-slate-800 p-2.5 text-slate-100 focus:outline-none"
                        />
                      </div>

                      <ProductDescriptionTool
                        label="Story Paragraph 1 (Brand Mission & Origin)"
                        value={aboutContent.hero_paragraph1 || ""}
                        onChange={(val) => setAboutContent({ ...aboutContent, hero_paragraph1: val })}
                        rows={3}
                        placeholder="Write story paragraph 1..."
                      />

                      <ProductDescriptionTool
                        label="Story Paragraph 2 (Phytomedical Active Science)"
                        value={aboutContent.hero_paragraph2 || ""}
                        onChange={(val) => setAboutContent({ ...aboutContent, hero_paragraph2: val })}
                        rows={3}
                        placeholder="Write story paragraph 2..."
                      />

                      <div className="space-y-1">
                        <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Hero Banner Visual (URL or Upload)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Paste image URL or Drive link"
                            value={aboutContent.hero_image || ""}
                            onChange={(e) => setAboutContent({ ...aboutContent, hero_image: e.target.value })}
                            className="flex-1 bg-slate-900 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                          />
                          <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 cursor-pointer font-bold flex items-center gap-1">
                            <Upload size={14} />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  const url = await handleFileUpload(e.target.files[0]);
                                  setAboutContent({ ...aboutContent, hero_image: url });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* 3 Pillars / Standards */}
                      <div className="border-t border-slate-800 pt-4 space-y-4">
                        <span className="text-blue-500 font-bold uppercase tracking-widest text-[10px] block">3 Brand Standards & Quality Pillars</span>
                        
                        <div className="space-y-2 border border-slate-800 p-3 bg-slate-900/50 rounded">
                          <input
                            type="text"
                            value={aboutContent.pillar1_title || ""}
                            onChange={(e) => setAboutContent({ ...aboutContent, pillar1_title: e.target.value })}
                            placeholder="Pillar 1 Title"
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 font-bold text-xs"
                          />
                          <textarea
                            rows={2}
                            value={aboutContent.pillar1_desc || ""}
                            onChange={(e) => setAboutContent({ ...aboutContent, pillar1_desc: e.target.value })}
                            placeholder="Pillar 1 Description"
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 text-xs"
                          />
                        </div>

                        <div className="space-y-2 border border-slate-800 p-3 bg-slate-900/50 rounded">
                          <input
                            type="text"
                            value={aboutContent.pillar2_title || ""}
                            onChange={(e) => setAboutContent({ ...aboutContent, pillar2_title: e.target.value })}
                            placeholder="Pillar 2 Title"
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 font-bold text-xs"
                          />
                          <textarea
                            rows={2}
                            value={aboutContent.pillar2_desc || ""}
                            onChange={(e) => setAboutContent({ ...aboutContent, pillar2_desc: e.target.value })}
                            placeholder="Pillar 2 Description"
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 text-xs"
                          />
                        </div>

                        <div className="space-y-2 border border-slate-800 p-3 bg-slate-900/50 rounded">
                          <input
                            type="text"
                            value={aboutContent.pillar3_title || ""}
                            onChange={(e) => setAboutContent({ ...aboutContent, pillar3_title: e.target.value })}
                            placeholder="Pillar 3 Title"
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 font-bold text-xs"
                          />
                          <textarea
                            rows={2}
                            value={aboutContent.pillar3_desc || ""}
                            onChange={(e) => setAboutContent({ ...aboutContent, pillar3_desc: e.target.value })}
                            placeholder="Pillar 3 Description"
                            className="w-full bg-slate-950 border border-slate-800 p-2 text-slate-100 text-xs"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-400 text-slate-950 py-3 text-xs font-bold uppercase tracking-widest rounded"
                      >
                        Save About Page Content
                      </button>
                    </form>
                  </div>

                  {/* Live Store About Page Preview (Right) */}
                  <div className="lg:col-span-5 bg-slate-950 border border-slate-800 p-6 space-y-4 rounded">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Website Preview</h3>
                      <a href="/about" target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline">
                        Open /about Live ↗
                      </a>
                    </div>

                    <div className="bg-[#FDFBF7] border border-[#EFE8D8] p-6 text-[#3D261D] font-sans text-xs space-y-6 rounded shadow-lg">
                      <div className="text-center space-y-2 border-b border-[#EFE8D8] pb-4">
                        <span className="text-[9px] tracking-[0.2em] font-semibold text-[#A47148] uppercase block">
                          {aboutContent.subtitle || "OUR STORY"}
                        </span>
                        <h4 className="font-serif text-xl font-light text-[#2C1A14]">
                          {aboutContent.title || "About Qura Herbs"}
                        </h4>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-serif text-sm font-light text-[#2C1A14]">
                          {aboutContent.hero_heading}
                        </h5>
                        <p className="text-[#3D261D]/80 leading-relaxed text-[11px] whitespace-pre-wrap">
                          {aboutContent.hero_paragraph1}
                        </p>
                        <p className="text-[#3D261D]/80 leading-relaxed text-[11px] whitespace-pre-wrap">
                          {aboutContent.hero_paragraph2}
                        </p>
                      </div>

                      {aboutContent.hero_image && (
                        <div className="h-40 rounded overflow-hidden border border-[#EFE8D8]">
                          <img src={aboutContent.hero_image} alt="Laboratory" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="space-y-2 border-t border-[#EFE8D8] pt-4">
                        <h6 className="font-bold text-[10px] uppercase text-[#2C1A14]">{aboutContent.pillar1_title}</h6>
                        <p className="text-[10px] text-[#3D261D]/70">{aboutContent.pillar1_desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: FOUNDER PROFILE EDIT */}
              {aboutSubTab === "founder" && (
                <div className="bg-slate-950 border border-slate-800 p-6 max-w-2xl space-y-6 rounded">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500">Founder & Formulation Scientist CMS</h3>

                  <form onSubmit={handleSaveFounderStory} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Founder Name</label>
                      <input
                        type="text"
                        value={founderStory.name || ""}
                        onChange={(e) => setFounderStory({ ...founderStory, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 p-2.5 text-slate-100 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Founder Title / Designation</label>
                      <input
                        type="text"
                        value={founderStory.title || ""}
                        onChange={(e) => setFounderStory({ ...founderStory, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 p-2.5 text-slate-100 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Founder Photo URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={founderStory.image || ""}
                          onChange={(e) => setFounderStory({ ...founderStory, image: e.target.value })}
                          className="flex-1 bg-slate-900 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                        />
                        <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 cursor-pointer font-bold flex items-center gap-1">
                          <Upload size={14} />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files?.[0]) {
                                const url = await handleFileUpload(e.target.files[0]);
                                setFounderStory({ ...founderStory, image: url });
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Brand Philosophy Quote</label>
                      <input
                        type="text"
                        value={founderStory.quote || ""}
                        onChange={(e) => setFounderStory({ ...founderStory, quote: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Detailed Founder Bio</label>
                      <textarea
                        rows={4}
                        value={founderStory.description || ""}
                        onChange={(e) => setFounderStory({ ...founderStory, description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-400 text-slate-950 px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded"
                    >
                      Save Founder Story
                    </button>
                  </form>
                </div>
              )}

              {/* SUB-TAB 3: CEO PROFILE EDIT */}
              {aboutSubTab === "ceo" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-6 space-y-6 rounded">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500">Chief Executive Officer (CEO) CMS</h3>

                    <form onSubmit={handleSaveCeoStory} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">CEO Name</label>
                        <input
                          type="text"
                          value={ceoStory.name || ceoStory.ceo_name || ""}
                          onChange={(e) => setCeoStory({ ...ceoStory, name: e.target.value, ceo_name: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 text-slate-100 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">CEO Title / Designation</label>
                        <input
                          type="text"
                          value={ceoStory.title || ceoStory.ceo_designation || ""}
                          onChange={(e) => setCeoStory({ ...ceoStory, title: e.target.value, ceo_designation: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 text-slate-100 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">CEO Photo URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={ceoStory.image || ceoStory.ceo_image || ""}
                            onChange={(e) => setCeoStory({ ...ceoStory, image: e.target.value, ceo_image: e.target.value })}
                            className="flex-1 bg-slate-900 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                          />
                          <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 cursor-pointer font-bold flex items-center gap-1">
                            <Upload size={14} />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  const url = await handleFileUpload(e.target.files[0]);
                                  setCeoStory({ ...ceoStory, image: url, ceo_image: url });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Leadership & Growth Quote</label>
                        <input
                          type="text"
                          value={ceoStory.quote || ceoStory.ceo_quote || ""}
                          onChange={(e) => setCeoStory({ ...ceoStory, quote: e.target.value, ceo_quote: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 uppercase tracking-widest text-[10px] mb-1 font-bold">Detailed CEO Bio & Strategic Vision</label>
                        <textarea
                          rows={4}
                          value={ceoStory.description || ceoStory.ceo_bio || ""}
                          onChange={(e) => setCeoStory({ ...ceoStory, description: e.target.value, ceo_bio: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 p-2.5 text-slate-200 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-400 text-slate-950 px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded"
                      >
                        Save CEO Story
                      </button>
                    </form>
                  </div>

                  {/* Live CEO Preview */}
                  <div className="lg:col-span-5 bg-slate-950 border border-slate-800 p-6 space-y-4 rounded">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">CEO Live Preview</h3>
                      <a href="/about?tab=ceo" target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline">
                        Open CEO Story Live ↗
                      </a>
                    </div>

                    <div className="bg-[#FDFBF7] border border-[#EFE8D8] p-6 text-[#3D261D] font-sans text-xs space-y-4 rounded shadow-lg">
                      <div className="border-b border-[#EFE8D8] pb-3">
                        <span className="text-[9px] tracking-[0.2em] font-semibold text-[#A47148] uppercase block">EXECUTIVE LEADERSHIP</span>
                        <h4 className="font-serif text-lg font-light text-[#2C1A14]">{ceoStory.name || ceoStory.ceo_name || "Pranavi G"}</h4>
                        <p className="text-[10px] text-[#A47148] uppercase tracking-wider">{ceoStory.title || ceoStory.ceo_designation || "Chief Executive Officer (CEO)"}</p>
                      </div>

                      {(ceoStory.image || ceoStory.ceo_image) && (
                        <div className="h-44 rounded overflow-hidden border border-[#EFE8D8]">
                          <img src={ceoStory.image || ceoStory.ceo_image} alt="CEO" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {(ceoStory.quote || ceoStory.ceo_quote) && (
                        <div className="bg-brand-light border-l-2 border-[#A47148] p-3 italic text-[11px] text-[#2C1A14]">
                          &ldquo;{ceoStory.quote || ceoStory.ceo_quote}&rdquo;
                        </div>
                      )}

                      <p className="text-[#3D261D]/80 leading-relaxed text-[11px] whitespace-pre-wrap">
                        {ceoStory.description || ceoStory.ceo_bio}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Products Catalog CMS</h2>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-950 text-xs font-semibold px-4 py-2 uppercase flex items-center gap-2"
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>

              {/* Create Product Modal */}
              {showAddProduct && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
                  <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-lg font-bold text-slate-100">Create New Skincare Product</h3>
                      <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-slate-100"><X size={18} /></button>
                    </div>

                    <form onSubmit={createProduct} className="grid grid-cols-2 gap-4 text-xs">
                      <div className="col-span-2 flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Product Name *</label>
                        <input required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Slug *</label>
                        <input required value={newProduct.slug} onChange={(e) => setNewProduct({...newProduct, slug: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">SKU *</label>
                        <input required value={newProduct.SKU} onChange={(e) => setNewProduct({...newProduct, SKU: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Price (₹) *</label>
                        <input required type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Sale Price (₹)</label>
                        <input type="number" placeholder="Optional" value={newProduct.sale_price || ""} onChange={(e) => setNewProduct({...newProduct, sale_price: e.target.value ? Number(e.target.value) : null})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Stock *</label>
                        <input required type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="col-span-2 flex flex-col space-y-2 border border-slate-800 p-3 bg-slate-950">
                        <div className="flex justify-between items-center">
                          <label className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">
                            CATEGORY / SKIN CONCERNS (SELECT ALL THAT APPLY) *
                          </label>
                          <span className="text-[10px] text-blue-400 font-mono">
                            {(newProduct.category_ids || []).length} Selected
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {categories.map((cat) => {
                            const currentIds = newProduct.category_ids || (newProduct.category_id ? [newProduct.category_id] : []);
                            const isSelected = currentIds.includes(cat.id);
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  const next = isSelected
                                    ? currentIds.filter((id) => id !== cat.id)
                                    : [...currentIds, cat.id];
                                  setNewProduct({
                                    ...newProduct,
                                    category_ids: next,
                                    category_id: next[0] || cat.id
                                  });
                                }}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all duration-200 border ${
                                  isSelected
                                    ? "bg-blue-600 border-blue-400 text-white shadow-sm"
                                    : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 flex items-center justify-center rounded-sm text-[10px] border ${
                                  isSelected ? "border-white bg-white text-blue-600 font-bold" : "border-slate-600"
                                }`}>
                                  {isSelected ? "✓" : ""}
                                </span>
                                <span>{cat.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="col-span-2 flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Skin Type</label>
                        <input value={newProduct.skin_type} onChange={(e) => setNewProduct({...newProduct, skin_type: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>

                      {/* 5-SLOT PRODUCT IMAGES GALLERY MANAGER */}
                      <div className="col-span-2 border border-slate-800 p-4 bg-slate-950 space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <div>
                            <span className="text-blue-500 font-bold text-xs uppercase tracking-widest block">PRODUCT IMAGES GALLERY (UP TO 5 IMAGES)</span>
                            <span className="text-[10px] text-slate-400">Upload files from computer, paste file paths, or paste Google Drive links (auto-converts instantly).</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                          {[0, 1, 2, 3, 4].map((slotIdx) => {
                            const isPrimary = slotIdx === 0;
                            const slotLabel = isPrimary ? "1. Primary Thumbnail" : `Image ${slotIdx + 1}`;
                            const currentVal = isPrimary
                              ? newProduct.thumbnail
                              : (newProduct.product_images[slotIdx - 1] || "");

                            return (
                              <div key={slotIdx} className="bg-slate-900 border border-slate-800 p-2 rounded flex flex-col justify-between space-y-2">
                                <div className="space-y-1">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 block truncate">{slotLabel}</span>
                                  <div className="relative aspect-square w-full bg-slate-950 border border-slate-800 rounded overflow-hidden flex items-center justify-center">
                                    {currentVal ? (
                                      <img src={currentVal} alt={`Slot ${slotIdx + 1}`} className="w-full h-full object-contain" />
                                    ) : (
                                      <span className="text-slate-600 text-[9px] italic">Slot {slotIdx + 1} Empty</span>
                                    )}
                                    {currentVal && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isPrimary) {
                                            setNewProduct({ ...newProduct, thumbnail: "" });
                                          } else {
                                            const updated = [...newProduct.product_images];
                                            updated[slotIdx - 1] = "";
                                            setNewProduct({ ...newProduct, product_images: updated.filter(Boolean) });
                                          }
                                        }}
                                        className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-600 text-white p-1 rounded"
                                        title="Remove Image"
                                      >
                                        <X size={10} />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <input
                                    type="text"
                                    placeholder="Paste URL or Drive link"
                                    value={currentVal}
                                    onBlur={async (e) => {
                                      const imported = await handleUrlOrDriveImport(e.target.value);
                                      if (imported) {
                                        if (isPrimary) {
                                          setNewProduct({ ...newProduct, thumbnail: imported });
                                        } else {
                                          const updated = [...newProduct.product_images];
                                          updated[slotIdx - 1] = imported;
                                          setNewProduct({ ...newProduct, product_images: updated });
                                        }
                                      }
                                    }}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (isPrimary) {
                                        setNewProduct({ ...newProduct, thumbnail: val });
                                      } else {
                                        const updated = [...newProduct.product_images];
                                        updated[slotIdx - 1] = val;
                                        setNewProduct({ ...newProduct, product_images: updated });
                                      }
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 p-1 text-slate-200 text-[10px] focus:outline-none"
                                  />

                                  <label className="w-full cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 py-1 px-1.5 text-[9px] uppercase font-bold flex items-center justify-center space-x-1 rounded">
                                    <Upload size={10} />
                                    <span>Upload File</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async (e) => {
                                        if (e.target.files?.[0]) {
                                          const url = await handleFileUpload(e.target.files[0]);
                                          if (url) {
                                            if (isPrimary) {
                                              setNewProduct({ ...newProduct, thumbnail: url });
                                            } else {
                                              const updated = [...newProduct.product_images];
                                              updated[slotIdx - 1] = url;
                                              setNewProduct({ ...newProduct, product_images: updated });
                                            }
                                          }
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="col-span-2">
                        <SingleCopyPasteDescriptionEditor
                          productData={{
                            short_description: newProduct.short_description,
                            full_description: newProduct.full_description,
                            benefits: newProduct.benefits,
                            ingredients: newProduct.ingredients,
                            how_to_use: newProduct.how_to_use,
                          }}
                          onChange={(updated) => {
                            setNewProduct((prev) => ({
                              ...prev,
                              short_description: updated.short_description,
                              full_description: updated.full_description,
                              benefits: updated.benefits ?? "",
                              ingredients: updated.ingredients ?? "",
                              how_to_use: updated.how_to_use ?? "",
                            }));
                          }}
                        />
                      </div>

                      <div className="col-span-2 flex gap-4 pt-4 border-t border-slate-800">
                        <button type="submit" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-950 py-2.5 font-bold uppercase tracking-widest">Save Product</button>
                        <button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 border border-slate-700 hover:bg-slate-800 py-2.5 font-bold uppercase tracking-widest text-slate-400">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Product Modal */}
              {editingProduct && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
                  <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-lg font-bold text-slate-100">Edit Product: {editingProduct.name}</h3>
                      <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-100"><X size={18} /></button>
                    </div>

                    <form onSubmit={updateProduct} className="grid grid-cols-2 gap-4 text-xs">
                      <div className="col-span-2 flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Product Name *</label>
                        <input required value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Slug *</label>
                        <input required value={editingProduct.slug} onChange={(e) => setEditingProduct({...editingProduct, slug: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">SKU *</label>
                        <input required value={editingProduct.SKU} onChange={(e) => setEditingProduct({...editingProduct, SKU: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Price (₹) *</label>
                        <input required type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Sale Price (₹)</label>
                        <input type="number" placeholder="None" value={editingProduct.sale_price || ""} onChange={(e) => setEditingProduct({...editingProduct, sale_price: e.target.value ? Number(e.target.value) : null})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Stock *</label>
                        <input required type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="col-span-2 flex flex-col space-y-2 border border-slate-800 p-3 bg-slate-950">
                        <div className="flex justify-between items-center">
                          <label className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">
                            CATEGORY / SKIN CONCERNS (SELECT ALL THAT APPLY) *
                          </label>
                          <span className="text-[10px] text-blue-400 font-mono">
                            {(editingProduct.category_ids || (editingProduct.category_id ? [editingProduct.category_id] : [])).length} Selected
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {categories.map((cat) => {
                            const currentIds = editingProduct.category_ids && editingProduct.category_ids.length > 0
                              ? editingProduct.category_ids
                              : (editingProduct.category_id ? [editingProduct.category_id] : []);
                            const isSelected = currentIds.includes(cat.id);
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  const next = isSelected
                                    ? currentIds.filter((id) => id !== cat.id)
                                    : [...currentIds, cat.id];
                                  setEditingProduct({
                                    ...editingProduct,
                                    category_ids: next,
                                    category_id: next[0] || cat.id
                                  });
                                }}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all duration-200 border ${
                                  isSelected
                                    ? "bg-blue-600 border-blue-400 text-white shadow-sm"
                                    : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 flex items-center justify-center rounded-sm text-[10px] border ${
                                  isSelected ? "border-white bg-white text-blue-600 font-bold" : "border-slate-600"
                                }`}>
                                  {isSelected ? "✓" : ""}
                                </span>
                                <span>{cat.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="col-span-2 flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Skin Type</label>
                        <input value={editingProduct.skin_type} onChange={(e) => setEditingProduct({...editingProduct, skin_type: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>

                      {/* 5-SLOT PRODUCT IMAGES GALLERY MANAGER */}
                      <div className="col-span-2 border border-slate-800 p-4 bg-slate-950 space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <div>
                            <span className="text-blue-500 font-bold text-xs uppercase tracking-widest block">PRODUCT IMAGES GALLERY (UP TO 5 IMAGES)</span>
                            <span className="text-[10px] text-slate-400">Upload files from computer, paste file paths, or paste Google Drive links (auto-converts instantly).</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                          {[0, 1, 2, 3, 4].map((slotIdx) => {
                            const isPrimary = slotIdx === 0;
                            const slotLabel = isPrimary ? "1. Primary Thumbnail" : `Image ${slotIdx + 1}`;
                            const galleryImgs = editingProduct.product_images || [];
                            const currentVal = isPrimary
                              ? (editingProduct.thumbnail || "")
                              : (galleryImgs[slotIdx - 1] || "");

                            return (
                              <div key={slotIdx} className="bg-slate-900 border border-slate-800 p-2 rounded flex flex-col justify-between space-y-2">
                                <div className="space-y-1">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 block truncate">{slotLabel}</span>
                                  <div className="relative aspect-square w-full bg-slate-950 border border-slate-800 rounded overflow-hidden flex items-center justify-center">
                                    {currentVal ? (
                                      <img src={currentVal} alt={`Slot ${slotIdx + 1}`} className="w-full h-full object-contain" />
                                    ) : (
                                      <span className="text-slate-600 text-[9px] italic">Slot {slotIdx + 1} Empty</span>
                                    )}
                                    {currentVal && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isPrimary) {
                                            setEditingProduct({ ...editingProduct, thumbnail: "" });
                                          } else {
                                            const updated = [...galleryImgs];
                                            updated[slotIdx - 1] = "";
                                            setEditingProduct({ ...editingProduct, product_images: updated.filter(Boolean) });
                                          }
                                        }}
                                        className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-600 text-white p-1 rounded"
                                        title="Remove Image"
                                      >
                                        <X size={10} />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <input
                                    type="text"
                                    placeholder="Paste URL or Drive link"
                                    value={currentVal}
                                    onBlur={async (e) => {
                                      const imported = await handleUrlOrDriveImport(e.target.value);
                                      if (imported) {
                                        if (isPrimary) {
                                          setEditingProduct({ ...editingProduct, thumbnail: imported });
                                        } else {
                                          const updated = [...galleryImgs];
                                          updated[slotIdx - 1] = imported;
                                          setEditingProduct({ ...editingProduct, product_images: updated });
                                        }
                                      }
                                    }}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (isPrimary) {
                                        setEditingProduct({ ...editingProduct, thumbnail: val });
                                      } else {
                                        const updated = [...galleryImgs];
                                        updated[slotIdx - 1] = val;
                                        setEditingProduct({ ...editingProduct, product_images: updated });
                                      }
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 p-1 text-slate-200 text-[10px] focus:outline-none"
                                  />

                                  <label className="w-full cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 py-1 px-1.5 text-[9px] uppercase font-bold flex items-center justify-center space-x-1 rounded">
                                    <Upload size={10} />
                                    <span>Upload File</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async (e) => {
                                        if (e.target.files?.[0]) {
                                          const url = await handleFileUpload(e.target.files[0]);
                                          if (url) {
                                            if (isPrimary) {
                                              setEditingProduct({ ...editingProduct, thumbnail: url });
                                            } else {
                                              const updated = [...galleryImgs];
                                              updated[slotIdx - 1] = url;
                                              setEditingProduct({ ...editingProduct, product_images: updated });
                                            }
                                          }
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="col-span-2">
                        <SingleCopyPasteDescriptionEditor
                          productData={{
                            short_description: editingProduct.short_description,
                            full_description: editingProduct.full_description,
                            benefits: editingProduct.benefits,
                            ingredients: editingProduct.ingredients,
                            how_to_use: editingProduct.how_to_use,
                          }}
                          onChange={(updated) => {
                            setEditingProduct((prev) => prev ? ({
                              ...prev,
                              short_description: updated.short_description,
                              full_description: updated.full_description,
                              benefits: updated.benefits ?? "",
                              ingredients: updated.ingredients ?? "",
                              how_to_use: updated.how_to_use ?? "",
                            }) : null);
                          }}
                        />
                      </div>

                      <div className="col-span-2 flex gap-4 pt-4 border-t border-slate-800">
                        <button type="submit" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-950 py-2.5 font-bold uppercase tracking-widest">Save Changes</button>
                        <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 border border-slate-700 hover:bg-slate-800 py-2.5 font-bold uppercase tracking-widest text-slate-400">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-slate-950 border border-slate-800 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-bold uppercase">
                      <th className="p-4">SKU</th>
                      <th className="p-4">Thumbnail</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id} className="border-b border-slate-850 hover:bg-slate-900/50">
                        <td className="p-4 font-mono">{prod.SKU}</td>
                        <td className="p-4">
                          <div className="w-10 h-10 border border-slate-800 bg-slate-900 overflow-hidden">
                            {prod.thumbnail ? (
                              <img src={prod.thumbnail} alt={prod.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-700 text-[8px]">N/A</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-semibold">{prod.name}</td>
                        <td className="p-4">₹{prod.price}</td>
                        <td className="p-4">{prod.stock}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="text-slate-400 hover:text-slate-100 p-1.5 border border-slate-800 hover:border-slate-650 bg-slate-900/40"
                            title="Edit product"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="text-red-400 hover:text-red-300 p-1.5 border border-slate-800 hover:border-red-950 bg-slate-900/40"
                            title="Delete product"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES CRUD */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Categories Catalog</h2>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-950 text-xs font-semibold px-4 py-2 uppercase flex items-center gap-2"
                >
                  <Plus size={14} /> Add Category
                </button>
              </div>

              {/* Add Category Modal */}
              {showAddCategory && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50">
                  <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-lg font-bold text-slate-100">Add New Category</h3>
                      <button onClick={() => setShowAddCategory(false)} className="text-slate-400 hover:text-slate-100"><X size={18} /></button>
                    </div>

                    <form onSubmit={createCategory} className="space-y-3 text-xs">
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Category Name *</label>
                        <input required value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Slug *</label>
                        <input required value={newCategory.slug} onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Description</label>
                        <textarea rows={3} value={newCategory.description} onChange={(e) => setNewCategory({...newCategory, description: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      
                      {/* Image Upload Category Banner */}
                      <div className="grid grid-cols-3 gap-3 border border-slate-800 p-2 bg-slate-950">
                        <div className="col-span-2 flex flex-col space-y-2">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Banner / Thumbnail</label>
                          <input type="text" placeholder="URL Address" value={newCategory.image} onChange={(e) => setNewCategory({...newCategory, image: e.target.value})} className="bg-slate-900 border border-slate-800 p-1.5 text-slate-100 focus:outline-none text-[10px]" />
                          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 text-[9px] uppercase font-bold text-center self-start flex items-center space-x-1">
                            <Upload size={10} />
                            <span>Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const url = await handleFileUpload(e.target.files[0]);
                                if (url) setNewCategory({ ...newCategory, image: url });
                              }
                            }} />
                          </label>
                        </div>
                        <div className="flex items-center justify-center border border-slate-850 bg-slate-900 overflow-hidden h-20 w-full">
                          {newCategory.image ? (
                            <img src={newCategory.image} alt="Preview" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-slate-700 text-[8px]">No Image</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-4 pt-3 border-t border-slate-800">
                        <button type="submit" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-950 py-2 font-bold uppercase tracking-widest">Save</button>
                        <button type="button" onClick={() => setShowAddCategory(false)} className="flex-1 border border-slate-700 hover:bg-slate-800 py-2 font-bold uppercase tracking-widest text-slate-400">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Category Modal */}
              {editingCategory && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50">
                  <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-lg font-bold text-slate-100">Edit Category</h3>
                      <button onClick={() => setEditingCategory(null)} className="text-slate-400 hover:text-slate-100"><X size={18} /></button>
                    </div>

                    <form onSubmit={updateCategory} className="space-y-3 text-xs">
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Category Name *</label>
                        <input required value={editingCategory.name} onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Slug *</label>
                        <input required value={editingCategory.slug} onChange={(e) => setEditingCategory({...editingCategory, slug: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Description</label>
                        <textarea rows={3} value={editingCategory.description} onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>

                      {/* Image Upload Category Banner */}
                      <div className="grid grid-cols-3 gap-3 border border-slate-800 p-2 bg-slate-955">
                        <div className="col-span-2 flex flex-col space-y-2">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Banner / Thumbnail</label>
                          <input type="text" placeholder="URL Address" value={editingCategory.image || ""} onChange={(e) => setEditingCategory({...editingCategory, image: e.target.value})} className="bg-slate-900 border border-slate-800 p-1.5 text-slate-100 focus:outline-none text-[10px]" />
                          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 text-[9px] uppercase font-bold text-center self-start flex items-center space-x-1">
                            <Upload size={10} />
                            <span>Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const url = await handleFileUpload(e.target.files[0]);
                                if (url) setEditingCategory({ ...editingCategory, image: url });
                              }
                            }} />
                          </label>
                        </div>
                        <div className="flex items-center justify-center border border-slate-850 bg-slate-900 overflow-hidden h-20 w-full">
                          {editingCategory.image ? (
                            <img src={editingCategory.image} alt="Preview" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-slate-700 text-[8px]">No Image</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-4 pt-3 border-t border-slate-800">
                        <button type="submit" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-950 py-2 font-bold uppercase tracking-widest">Save Changes</button>
                        <button type="button" onClick={() => setEditingCategory(null)} className="flex-1 border border-slate-700 hover:bg-slate-800 py-2 font-bold uppercase tracking-widest text-slate-400">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Categories Table */}
              <div className="bg-slate-950 border border-slate-800 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-bold uppercase">
                      <th className="p-4">Slug / ID</th>
                      <th className="p-4">Banner</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Product Count</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => {
                      const prodCount = products.filter((p) => p.category_id === cat.id).length;
                      return (
                        <tr key={cat.id} className="border-b border-slate-850 hover:bg-slate-900/50">
                          <td className="p-4 font-mono">{cat.slug}</td>
                          <td className="p-4">
                            <div className="w-12 h-8 border border-slate-800 bg-slate-900 overflow-hidden">
                              {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-700 text-[7px]">No Image</div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-slate-200">{cat.name}</td>
                          <td className="p-4 font-semibold text-slate-350">{prodCount} Products</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingCategory(cat)}
                              className="text-slate-400 hover:text-slate-100 p-1.5 border border-slate-800 bg-slate-900/40"
                              title="Edit category"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={() => deleteCategory(cat.id)}
                              className="text-red-400 hover:text-red-300 p-1.5 border border-slate-800 bg-slate-900/40"
                              title="Delete category"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS CRUD */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Customer Reviews Moderation</h2>
                <button
                  onClick={() => setShowAddReview(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-950 text-xs font-semibold px-4 py-2 uppercase flex items-center gap-2 animate-pulse"
                >
                  <Plus size={14} /> + Add New Review
                </button>
              </div>

              {/* Add Review Modal */}
              {showAddReview && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50">
                  <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-lg font-bold text-slate-100">Add Customer Review</h3>
                      <button onClick={() => setShowAddReview(false)} className="text-slate-400 hover:text-slate-100"><X size={18} /></button>
                    </div>

                    <form onSubmit={createReview} className="space-y-3 text-xs">
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Select Product *</label>
                        <select required value={newReview.product_id} onChange={(e) => setNewReview({...newReview, product_id: Number(e.target.value)})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none">
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Reviewer Name *</label>
                          <input required value={newReview.customer_name} onChange={(e) => setNewReview({...newReview, customer_name: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Reviewer Email</label>
                          <input type="email" value={newReview.customer_email} onChange={(e) => setNewReview({...newReview, customer_email: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Rating *</label>
                        <div className="flex space-x-2 pt-1">
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <button
                              key={starVal}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: starVal })}
                              className="text-slate-400 hover:scale-125 transition-transform"
                            >
                              <Star size={20} className={starVal <= newReview.rating ? "fill-blue-400 text-blue-400" : "text-slate-600"} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Review Text *</label>
                        <textarea required rows={3} value={newReview.review} onChange={(e) => setNewReview({...newReview, review: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>

                      {/* Image Upload Review Image */}
                      <div className="grid grid-cols-3 gap-3 border border-slate-800 p-2 bg-slate-950">
                        <div className="col-span-2 flex flex-col space-y-2">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Review Attachment Image</label>
                          <input type="text" placeholder="URL Address" value={newReview.image} onChange={(e) => setNewReview({...newReview, image: e.target.value})} className="bg-slate-900 border border-slate-800 p-1.5 text-slate-100 focus:outline-none text-[10px]" />
                          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 text-[9px] uppercase font-bold text-center self-start flex items-center space-x-1">
                            <Upload size={10} />
                            <span>Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const url = await handleFileUpload(e.target.files[0]);
                                if (url) setNewReview({ ...newReview, image: url });
                              }
                            }} />
                          </label>
                        </div>
                        <div className="flex items-center justify-center border border-slate-855 bg-slate-900 overflow-hidden h-20 w-full">
                          {newReview.image ? (
                            <img src={newReview.image} alt="Preview" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-slate-700 text-[8px]">No Attachment</span>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-4 pt-1">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" checked={newReview.featured} onChange={(e) => setNewReview({ ...newReview, featured: e.target.checked })} className="rounded bg-slate-950 border-slate-800 text-slate-100" />
                          <span className="text-[10px] text-slate-400 uppercase">Featured Review</span>
                        </label>
                      </div>

                      <div className="flex gap-4 pt-3 border-t border-slate-800">
                        <button type="submit" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-950 py-2 font-bold uppercase tracking-widest">Save Review</button>
                        <button type="button" onClick={() => setShowAddReview(false)} className="flex-1 border border-slate-700 hover:bg-slate-800 py-2 font-bold uppercase tracking-widest text-slate-400">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Review Modal */}
              {editingReview && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50">
                  <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-lg font-bold text-slate-100">Edit Customer Review</h3>
                      <button onClick={() => setEditingReview(null)} className="text-slate-400 hover:text-slate-100"><X size={18} /></button>
                    </div>

                    <form onSubmit={updateReview} className="space-y-3 text-xs">
                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Select Product *</label>
                        <select required value={editingReview.product_id} onChange={(e) => setEditingReview({...editingReview, product_id: Number(e.target.value)})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none">
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Reviewer Name *</label>
                          <input required value={editingReview.customer_name || ""} onChange={(e) => setEditingReview({...editingReview, customer_name: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Reviewer Email</label>
                          <input type="email" value={editingReview.customer_email || ""} onChange={(e) => setEditingReview({...editingReview, customer_email: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Rating *</label>
                        <div className="flex space-x-2 pt-1">
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <button
                              key={starVal}
                              type="button"
                              onClick={() => setEditingReview({ ...editingReview, rating: starVal })}
                              className="text-slate-400 hover:scale-125 transition-transform"
                            >
                              <Star size={20} className={starVal <= editingReview.rating ? "fill-blue-400 text-blue-400" : "text-slate-600"} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-slate-400 uppercase tracking-widest text-[9px]">Review Text *</label>
                        <textarea required rows={3} value={editingReview.review} onChange={(e) => setEditingReview({...editingReview, review: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                      </div>

                      {/* Image Upload Review Image */}
                      <div className="grid grid-cols-3 gap-3 border border-slate-800 p-2 bg-slate-950">
                        <div className="col-span-2 flex flex-col space-y-2">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Review Attachment Image</label>
                          <input type="text" placeholder="URL Address" value={editingReview.image || ""} onChange={(e) => setEditingReview({...editingReview, image: e.target.value})} className="bg-slate-900 border border-slate-800 p-1.5 text-slate-100 focus:outline-none text-[10px]" />
                          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 text-[9px] uppercase font-bold text-center self-start flex items-center space-x-1">
                            <Upload size={10} />
                            <span>Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const url = await handleFileUpload(e.target.files[0]);
                                if (url) setEditingReview({ ...editingReview, image: url });
                              }
                            }} />
                          </label>
                        </div>
                        <div className="flex items-center justify-center border border-slate-855 bg-slate-900 overflow-hidden h-20 w-full">
                          {editingReview.image ? (
                            <img src={editingReview.image} alt="Preview" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-slate-700 text-[8px]">No Attachment</span>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-4 pt-1">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" checked={editingReview.featured || false} onChange={(e) => setEditingReview({ ...editingReview, featured: e.target.checked })} className="rounded bg-slate-950 border-slate-800 text-slate-100" />
                          <span className="text-[10px] text-slate-400 uppercase">Featured Review</span>
                        </label>
                      </div>

                      <div className="flex gap-4 pt-3 border-t border-slate-800">
                        <button type="submit" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-950 py-2 font-bold uppercase tracking-widest">Save Changes</button>
                        <button type="button" onClick={() => setEditingReview(null)} className="flex-1 border border-slate-700 hover:bg-slate-800 py-2 font-bold uppercase tracking-widest text-slate-400">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Reviews Table */}
              <div className="bg-slate-950 border border-slate-800 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-light">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Product Associated</th>
                      <th className="p-4">Star Rating</th>
                      <th className="p-4">Review Excerpt</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((rev) => {
                      const linkedProd = products.find((p) => p.id === rev.product_id);
                      return (
                        <tr key={rev.id} className="border-b border-slate-850 hover:bg-slate-900/50">
                          <td className="p-4 font-semibold text-slate-200">
                            {rev.customer_name || "Unknown Customer"}
                          </td>
                          <td className="p-4 text-slate-350 italic">
                            {linkedProd ? linkedProd.name : "Product ID: " + rev.product_id}
                          </td>
                          <td className="p-4">{renderStars(rev.rating)}</td>
                          <td className="p-4 max-w-xs truncate text-slate-400" title={rev.review}>
                            {rev.review}
                          </td>
                          <td className="p-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked={rev.featured || false} onChange={() => toggleReviewFeatured(rev)} className="sr-only peer" />
                              <div className="w-7 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-slate-100 peer-checked:after:bg-slate-950"></div>
                            </label>
                          </td>
                          <td className="p-4">
                            {rev.approved ? (
                              <span className="text-green-500 bg-green-950/20 px-2 py-0.5 border border-green-900/35">Approved</span>
                            ) : (
                              <span className="text-blue-500 bg-blue-950/20 px-2 py-0.5 border border-blue-900/35">Pending</span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-2 whitespace-nowrap">
                            {!rev.approved && (
                              <button
                                onClick={() => approveReview(rev.id)}
                                className="text-green-400 hover:text-green-300 p-1.5 border border-slate-800 bg-slate-900/40"
                                title="Approve Review"
                              >
                                <Check size={12} />
                              </button>
                            )}
                            <button
                              onClick={() => setEditingReview(rev)}
                              className="text-slate-400 hover:text-slate-100 p-1.5 border border-slate-800 bg-slate-900/40"
                              title="Edit Review"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={() => deleteReview(rev.id)}
                              className="text-red-400 hover:text-red-300 p-1.5 border border-slate-800 bg-slate-900/40"
                              title="Delete Review"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BLOGS JOURNAL */}
          {activeTab === "blogs" && (
            <div className="space-y-6 font-sans">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Editorial Blogs Journal</h2>
                <button
                  onClick={() => setShowAddBlog(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-950 text-xs font-semibold px-4 py-2 uppercase flex items-center gap-2"
                >
                  <Plus size={14} /> Add Blog Post
                </button>
              </div>

              {/* Add Blog Modal */}
              {showAddBlog && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
                  <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-lg font-bold text-slate-100">Create New Article</h3>
                      <button onClick={() => setShowAddBlog(false)} className="text-slate-400 hover:text-slate-100"><X size={18} /></button>
                    </div>

                    {/* Tabs for Editor vs Live Preview */}
                    <div className="flex space-x-4 border-b border-slate-800">
                      <button type="button" onClick={() => setBlogTab("write")} className={`pb-2 text-xs uppercase tracking-widest font-semibold ${blogTab === "write" ? "border-b border-slate-100 text-slate-100" : "text-slate-400"}`}>Write</button>
                      <button type="button" onClick={() => setBlogTab("preview")} className={`pb-2 text-xs uppercase tracking-widest font-semibold ${blogTab === "preview" ? "border-b border-slate-100 text-slate-100" : "text-slate-400"}`}>Responsive Preview</button>
                    </div>

                    {blogTab === "write" ? (
                      <form onSubmit={createBlog} className="grid grid-cols-2 gap-4 text-xs">
                        <div className="col-span-2 flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Post Title *</label>
                          <input required value={newBlog.title} onChange={(e) => setNewBlog({...newBlog, title: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Slug *</label>
                          <input required value={newBlog.slug} onChange={(e) => setNewBlog({...newBlog, slug: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Author Name *</label>
                          <input required value={newBlog.author} onChange={(e) => setNewBlog({...newBlog, author: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>

                        {/* Image Upload Cover Image */}
                        <div className="col-span-2 grid grid-cols-3 gap-4 border border-slate-800 p-3 bg-slate-950">
                          <div className="col-span-2 flex flex-col space-y-2">
                            <label className="text-slate-400 uppercase tracking-widest text-[9px]">Cover Image (Featured Image)</label>
                            <input type="text" placeholder="URL Address" value={newBlog.featured_image} onChange={(e) => setNewBlog({...newBlog, featured_image: e.target.value})} className="bg-slate-900 border border-slate-800 p-2 text-slate-100 focus:outline-none text-[11px]" />
                            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-[10px] uppercase font-bold flex items-center space-x-1 self-start">
                              <Upload size={10} />
                              <span>Upload</span>
                              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const url = await handleFileUpload(e.target.files[0]);
                                  if (url) setNewBlog({ ...newBlog, featured_image: url });
                                }
                              }} />
                            </label>
                          </div>
                          <div className="flex items-center justify-center border border-slate-855 bg-slate-900 overflow-hidden h-24 w-full">
                            {newBlog.featured_image ? (
                              <img src={newBlog.featured_image} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-slate-700 text-[9px]">No Cover Image</span>
                            )}
                          </div>
                        </div>

                        <div className="col-span-2 flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Meta Description (SEO)</label>
                          <input value={newBlog.meta_description} onChange={(e) => setNewBlog({...newBlog, meta_description: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>
                        <div className="col-span-2 flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Excerpt / Short Description *</label>
                          <textarea required rows={2} value={newBlog.excerpt} onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>
                        <div className="col-span-2 flex flex-col space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-slate-400 uppercase tracking-widest text-[9px]">Article Body Content (Markdown supported) *</label>
                            {/* Toolbar Buttons */}
                            <div className="flex space-x-2 text-[8px] bg-slate-950 p-1 border border-slate-800 font-mono">
                              <button type="button" onClick={() => setNewBlog({...newBlog, content: newBlog.content + "\n# Heading 1"})} className="px-1 py-0.5 hover:bg-slate-855 border border-slate-800 font-mono">H1</button>
                              <button type="button" onClick={() => setNewBlog({...newBlog, content: newBlog.content + "\n## Heading 2"})} className="px-1 py-0.5 hover:bg-slate-855 border border-slate-800 font-mono">H2</button>
                              <button type="button" onClick={() => setNewBlog({...newBlog, content: newBlog.content + " **Bold Text** "})} className="px-1 py-0.5 hover:bg-slate-855 border border-slate-800 font-mono">B</button>
                              <button type="button" onClick={() => setNewBlog({...newBlog, content: newBlog.content + "\n> Blockquote"})} className="px-1 py-0.5 hover:bg-slate-855 border border-slate-800 font-mono">Quote</button>
                              <button type="button" onClick={() => setNewBlog({...newBlog, content: newBlog.content + "\n- List Item"})} className="px-1 py-0.5 hover:bg-slate-855 border border-slate-800 font-mono">List</button>
                            </div>
                          </div>
                          <textarea required rows={8} value={newBlog.content} onChange={(e) => setNewBlog({...newBlog, content: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none font-mono text-[11px]" />
                        </div>

                        <div className="col-span-2 flex items-center space-x-2">
                          <input type="checkbox" checked={newBlog.published} onChange={(e) => setNewBlog({...newBlog, published: e.target.checked})} className="rounded bg-slate-950 border-slate-800 text-slate-100" />
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Publish Immediately</label>
                        </div>

                        <div className="col-span-2 flex gap-4 pt-4 border-t border-slate-800">
                          <button type="submit" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-950 py-2.5 font-bold uppercase tracking-widest">Save Post</button>
                          <button type="button" onClick={() => setShowAddBlog(false)} className="flex-1 border border-slate-700 hover:bg-slate-800 py-2.5 font-bold uppercase tracking-widest text-slate-400">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      // Live Responsive Preview
                      <div className="space-y-4">
                        <div className="flex justify-center space-x-2 bg-slate-950 p-2 border border-slate-850">
                          <button type="button" onClick={() => setBlogPreviewDevice("desktop")} className={`p-1.5 hover:bg-slate-900 border border-slate-800 ${blogPreviewDevice === "desktop" ? "bg-slate-800 text-white" : "text-slate-500"}`} title="Desktop Preview"><Monitor size={14} /></button>
                          <button type="button" onClick={() => setBlogPreviewDevice("mobile")} className={`p-1.5 hover:bg-slate-900 border border-slate-800 ${blogPreviewDevice === "mobile" ? "bg-slate-800 text-white" : "text-slate-500"}`} title="Mobile Preview"><Smartphone size={14} /></button>
                        </div>

                        {blogPreviewDevice === "desktop" ? (
                          <div className="bg-slate-950 p-8 border border-slate-850 w-full overflow-y-auto max-h-[50vh] scrollbar-thin">
                            <div className="max-w-2xl mx-auto space-y-4 text-left">
                              {newBlog.featured_image && (
                                <img src={newBlog.featured_image} alt="Cover" className="w-full h-64 object-cover border border-slate-800" />
                              )}
                              <h1 className="text-3xl font-serif font-light text-slate-100">{newBlog.title || "Post Title Goes Here"}</h1>
                              <div className="text-slate-500 text-[10px] tracking-widest uppercase border-b border-slate-900 pb-3">By {newBlog.author || "Author"} &bull; {new Date().toLocaleDateString()}</div>
                              <div className="font-serif italic text-slate-400 text-base font-light border-l-2 border-slate-700 pl-4 py-1">{newBlog.excerpt || "Excerpt short description here."}</div>
                              <div className="pt-2">{renderRichContent(newBlog.content)}</div>
                            </div>
                          </div>
                        ) : (
                          // Mobile device wrapper frame
                          <div className="w-[360px] h-[550px] border-[10px] border-slate-800 rounded-3xl overflow-y-auto mx-auto shadow-2xl bg-slate-950 scrollbar-thin p-4">
                            <div className="space-y-4 text-left">
                              {newBlog.featured_image && (
                                <img src={newBlog.featured_image} alt="Cover" className="w-full h-40 object-cover border border-slate-850" />
                              )}
                              <h1 className="text-xl font-serif font-light text-slate-100 leading-tight">{newBlog.title || "Post Title"}</h1>
                              <div className="text-slate-500 text-[9px] tracking-widest uppercase">By {newBlog.author || "Author"}</div>
                              <div className="font-serif italic text-slate-400 text-xs font-light border-l border-slate-700 pl-2">{newBlog.excerpt}</div>
                              <div className="pt-2">{renderRichContent(newBlog.content)}</div>
                            </div>
                          </div>
                        )}

                        <div className="flex pt-4 justify-end">
                          <button type="button" onClick={() => setBlogTab("write")} className="bg-slate-100 hover:bg-slate-200 text-slate-950 px-6 py-2.5 font-bold uppercase tracking-widest text-xs">Return to Editor</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Edit Blog Modal */}
              {editingBlog && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
                  <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-lg font-bold text-slate-100">Edit Article</h3>
                      <button onClick={() => setEditingBlog(null)} className="text-slate-400 hover:text-slate-100"><X size={18} /></button>
                    </div>

                    {/* Tabs for Editor vs Live Preview */}
                    <div className="flex space-x-4 border-b border-slate-800">
                      <button type="button" onClick={() => setBlogTab("write")} className={`pb-2 text-xs uppercase tracking-widest font-semibold ${blogTab === "write" ? "border-b border-slate-100 text-slate-100" : "text-slate-400"}`}>Write</button>
                      <button type="button" onClick={() => setBlogTab("preview")} className={`pb-2 text-xs uppercase tracking-widest font-semibold ${blogTab === "preview" ? "border-b border-slate-100 text-slate-100" : "text-slate-400"}`}>Responsive Preview</button>
                    </div>

                    {blogTab === "write" ? (
                      <form onSubmit={updateBlog} className="grid grid-cols-2 gap-4 text-xs">
                        <div className="col-span-2 flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Post Title *</label>
                          <input required value={editingBlog.title} onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Slug *</label>
                          <input required value={editingBlog.slug} onChange={(e) => setEditingBlog({...editingBlog, slug: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Author Name *</label>
                          <input required value={editingBlog.author} onChange={(e) => setEditingBlog({...editingBlog, author: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>

                        {/* Image Upload Cover Image */}
                        <div className="col-span-2 grid grid-cols-3 gap-4 border border-slate-800 p-3 bg-slate-950">
                          <div className="col-span-2 flex flex-col space-y-2">
                            <label className="text-slate-400 uppercase tracking-widest text-[9px]">Cover Image (Featured Image)</label>
                            <input type="text" placeholder="URL Address" value={editingBlog.featured_image || ""} onChange={(e) => setEditingBlog({...editingBlog, featured_image: e.target.value})} className="bg-slate-900 border border-slate-800 p-2 text-slate-100 focus:outline-none text-[11px]" />
                            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-[10px] uppercase font-bold flex items-center space-x-1 self-start">
                              <Upload size={10} />
                              <span>Upload</span>
                              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const url = await handleFileUpload(e.target.files[0]);
                                  if (url) setEditingBlog({ ...editingBlog, featured_image: url });
                                }
                              }} />
                            </label>
                          </div>
                          <div className="flex items-center justify-center border border-slate-855 bg-slate-900 overflow-hidden h-24 w-full">
                            {editingBlog.featured_image ? (
                              <img src={editingBlog.featured_image} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-slate-700 text-[9px]">No Cover Image</span>
                            )}
                          </div>
                        </div>

                        <div className="col-span-2 flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Meta Description (SEO)</label>
                          <input value={editingBlog.meta_description || ""} onChange={(e) => setEditingBlog({...editingBlog, meta_description: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>
                        <div className="col-span-2 flex flex-col space-y-1">
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Excerpt / Short Description *</label>
                          <textarea required rows={2} value={editingBlog.excerpt} onChange={(e) => setEditingBlog({...editingBlog, excerpt: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none" />
                        </div>
                        <div className="col-span-2 flex flex-col space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-slate-400 uppercase tracking-widest text-[9px]">Article Body Content (Markdown supported) *</label>
                            {/* Toolbar Buttons */}
                            <div className="flex space-x-2 text-[8px] bg-slate-950 p-1 border border-slate-800 font-mono">
                              <button type="button" onClick={() => setEditingBlog({...editingBlog, content: editingBlog.content + "\n# Heading 1"})} className="px-1 py-0.5 hover:bg-slate-855 border border-slate-800 font-mono">H1</button>
                              <button type="button" onClick={() => setEditingBlog({...editingBlog, content: editingBlog.content + "\n## Heading 2"})} className="px-1 py-0.5 hover:bg-slate-855 border border-slate-800 font-mono">H2</button>
                              <button type="button" onClick={() => setEditingBlog({...editingBlog, content: editingBlog.content + " **Bold Text** "})} className="px-1 py-0.5 hover:bg-slate-855 border border-slate-800 font-mono">B</button>
                              <button type="button" onClick={() => setEditingBlog({...editingBlog, content: editingBlog.content + "\n> Blockquote"})} className="px-1 py-0.5 hover:bg-slate-855 border border-slate-800 font-mono">Quote</button>
                              <button type="button" onClick={() => setEditingBlog({...editingBlog, content: editingBlog.content + "\n- List Item"})} className="px-1 py-0.5 hover:bg-slate-855 border border-slate-800 font-mono">List</button>
                            </div>
                          </div>
                          <textarea required rows={8} value={editingBlog.content} onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})} className="bg-slate-950 border border-slate-800 p-2 text-slate-100 focus:outline-none font-mono text-[11px]" />
                        </div>

                        <div className="col-span-2 flex items-center space-x-2">
                          <input type="checkbox" checked={editingBlog.published} onChange={(e) => setEditingBlog({...editingBlog, published: e.target.checked})} className="rounded bg-slate-950 border-slate-800 text-slate-100" />
                          <label className="text-slate-400 uppercase tracking-widest text-[9px]">Published</label>
                        </div>

                        <div className="col-span-2 flex gap-4 pt-4 border-t border-slate-800">
                          <button type="submit" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-950 py-2.5 font-bold uppercase tracking-widest">Save Changes</button>
                          <button type="button" onClick={() => setEditingBlog(null)} className="flex-1 border border-slate-700 hover:bg-slate-800 py-2.5 font-bold uppercase tracking-widest text-slate-400">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      // Live Responsive Preview
                      <div className="space-y-4">
                        <div className="flex justify-center space-x-2 bg-slate-950 p-2 border border-slate-855">
                          <button type="button" onClick={() => setBlogPreviewDevice("desktop")} className={`p-1.5 hover:bg-slate-900 border border-slate-800 ${blogPreviewDevice === "desktop" ? "bg-slate-800 text-white" : "text-slate-500"}`} title="Desktop Preview"><Monitor size={14} /></button>
                          <button type="button" onClick={() => setBlogPreviewDevice("mobile")} className={`p-1.5 hover:bg-slate-900 border border-slate-800 ${blogPreviewDevice === "mobile" ? "bg-slate-800 text-white" : "text-slate-500"}`} title="Mobile Preview"><Smartphone size={14} /></button>
                        </div>

                        {blogPreviewDevice === "desktop" ? (
                          <div className="bg-slate-950 p-8 border border-slate-855 w-full overflow-y-auto max-h-[50vh] scrollbar-thin">
                            <div className="max-w-2xl mx-auto space-y-4 text-left">
                              {editingBlog.featured_image && (
                                <img src={editingBlog.featured_image} alt="Cover" className="w-full h-64 object-cover border border-slate-800" />
                              )}
                              <h1 className="text-3xl font-serif font-light text-slate-100">{editingBlog.title || "Post Title Goes Here"}</h1>
                              <div className="text-slate-500 text-[10px] tracking-widest uppercase border-b border-slate-900 pb-3">By {editingBlog.author || "Author"} &bull; {editingBlog.published_at ? new Date(editingBlog.published_at).toLocaleDateString() : "Draft"}</div>
                              <div className="font-serif italic text-slate-400 text-base font-light border-l-2 border-slate-700 pl-4 py-1">{editingBlog.excerpt || "Excerpt short description here."}</div>
                              <div className="pt-2">{renderRichContent(editingBlog.content)}</div>
                            </div>
                          </div>
                        ) : (
                          // Mobile device wrapper frame
                          <div className="w-[360px] h-[550px] border-[10px] border-slate-800 rounded-3xl overflow-y-auto mx-auto shadow-2xl bg-slate-950 scrollbar-thin p-4">
                            <div className="space-y-4 text-left">
                              {editingBlog.featured_image && (
                                <img src={editingBlog.featured_image} alt="Cover" className="w-full h-40 object-cover border border-slate-855" />
                              )}
                              <h1 className="text-xl font-serif font-light text-slate-100 leading-tight">{editingBlog.title || "Post Title"}</h1>
                              <div className="text-slate-500 text-[9px] tracking-widest uppercase text-slate-400 font-semibold">By {editingBlog.author || "Author"}</div>
                              <div className="font-serif italic text-slate-400 text-xs font-light border-l border-slate-700 pl-2">{editingBlog.excerpt}</div>
                              <div className="pt-2">{renderRichContent(editingBlog.content)}</div>
                            </div>
                          </div>
                        )}

                        <div className="flex pt-4 justify-end">
                          <button type="button" onClick={() => setBlogTab("write")} className="bg-slate-100 hover:bg-slate-200 text-slate-950 px-6 py-2.5 font-bold uppercase tracking-widest text-xs">Return to Editor</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Compact Horizontal Journal Cards */}
              {blogs.length === 0 ? (
                <div className="bg-slate-950 border border-slate-800 p-8 text-center text-slate-500 text-xs">
                  No blog articles found. Click "Add Blog Post" to create one.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {blogs.map((b) => (
                    <div
                      key={b.id}
                      className="bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all p-3.5 flex flex-col sm:flex-row gap-4 items-stretch group"
                    >
                      {/* LEFT: Compact Cover Image (30-35% width) */}
                      <div className="w-full sm:w-[32%] sm:min-w-[120px] sm:max-w-[150px] aspect-[4/3] bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                        {b.featured_image ? (
                          <img
                            src={b.featured_image}
                            alt={b.title}
                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-slate-600 text-[10px] uppercase tracking-wider font-mono">No Image</span>
                        )}
                      </div>

                      {/* RIGHT: Article Content & Actions (65-70% width) */}
                      <div className="flex-1 flex flex-col justify-between space-y-2 min-w-0">
                        <div className="space-y-1.5 min-w-0">
                          {/* Tag / Category / Status Badge */}
                          <div className="flex items-center justify-between gap-2 text-[9px] uppercase tracking-widest font-mono">
                            <span className="text-amber-400/90 font-semibold truncate">
                              JOURNAL &bull; {b.author || "Qura Herbs"}
                            </span>
                            {b.published ? (
                              <span className="text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 border border-emerald-800/40 shrink-0">
                                Published
                              </span>
                            ) : (
                              <span className="text-slate-400 bg-slate-800/40 px-1.5 py-0.5 border border-slate-700/40 shrink-0">
                                Draft
                              </span>
                            )}
                          </div>

                          {/* Journal Title */}
                          <h3
                            className="font-serif text-sm font-medium text-slate-100 line-clamp-1 group-hover:text-amber-400 transition-colors"
                            title={b.title}
                          >
                            {b.title}
                          </h3>

                          {/* Short Description / Excerpt */}
                          <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                            {b.excerpt || b.meta_description || "No excerpt provided."}
                          </p>
                        </div>

                        {/* Footer: Date & Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono mt-auto">
                          <span>
                            {b.published_at ? new Date(b.published_at).toLocaleDateString() : "Not Published"}
                          </span>

                          <div className="flex items-center space-x-1.5">
                            {/* View / Preview Link */}
                            <a
                              href={`/journal/${b.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1 font-sans text-[10px]"
                              title="View Article Page"
                            >
                              <ExternalLink size={11} />
                              <span>View</span>
                            </a>

                            {/* Edit Article */}
                            <button
                              onClick={() => {
                                setEditingBlog(b);
                                setBlogTab("write");
                              }}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1 font-sans text-[10px]"
                              title="Edit Article"
                            >
                              <Edit3 size={11} />
                              <span>Edit</span>
                            </button>

                            {/* Delete Article */}
                            <button
                              onClick={() => deleteBlog(b.id)}
                              className="px-2 py-1 bg-slate-950 hover:bg-red-950/40 border border-slate-800 hover:border-red-900/50 text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 font-sans text-[10px]"
                              title="Delete Article"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-lg">
              <h2 className="text-xl font-semibold">Dashboard Configurations</h2>
              <div className="bg-slate-950 border border-slate-800 p-6 space-y-4 text-xs">
                <div className="flex flex-col space-y-1">
                  <label className="text-slate-400 font-bold">Allowed Admin Emails (Comma separated)</label>
                  <input readOnly value={allowedAdminEmails.join(", ")} className="bg-slate-900 border border-slate-700 p-3 text-slate-300 select-all focus:outline-none" />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  These emails correspond to approved admin roles for Google OAuth access. Modifying settings requires changing the database backend roles.
                </p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
