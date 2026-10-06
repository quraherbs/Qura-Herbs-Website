"use client";

import React, { useState, useEffect } from "react";
import { Upload, X, ExternalLink, Image as ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { getImageUrl } from "@/lib/api";

interface SupabaseImageUrlInputProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  onUpload?: (file: File) => Promise<string | null>;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  folder?: string;
  disabled?: boolean;
  aspectRatio?: "square" | "video" | "wide" | "auto";
  compact?: boolean;
}

export default function SupabaseImageUrlInput({
  label = "Image URL",
  value = "",
  onChange,
  onUpload,
  placeholder = "https://slyiyvegvcefhzaeymoo.supabase.co/storage/v1/object/public/product-images/...",
  required = false,
  helpText = "Paste exact Supabase Storage public image URL or upload a file",
  folder = "general",
  disabled = false,
  aspectRatio = "video",
  compact = false,
}: SupabaseImageUrlInputProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Reset error/loaded state whenever the URL changes
  useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [value]);

  const cleanUrl = (value || "").trim();
  const hasUrl = cleanUrl.length > 0;
  const resolvedUrl = hasUrl ? getImageUrl(cleanUrl) : "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Preserve the exact URL pasted/typed by user
    onChange(e.target.value.trim());
  };

  const handleClear = () => {
    onChange("");
    setImgError(false);
    setImgLoaded(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onUpload) {
      setIsUploading(true);
      try {
        const uploadedUrl = await onUpload(file);
        if (uploadedUrl) {
          onChange(uploadedUrl);
        }
      } catch (err) {
        console.error("Upload handler failed:", err);
      } finally {
        setIsUploading(false);
        e.target.value = "";
      }
    }
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square max-h-48"
      : aspectRatio === "wide"
      ? "aspect-[21/9] max-h-44"
      : aspectRatio === "video"
      ? "aspect-video max-h-40"
      : "max-h-44";

  return (
    <div className="space-y-2 w-full text-xs">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
            <ImageIcon size={13} className="text-amber-400" />
            <span>{label}</span>
            {required && <span className="text-red-400 font-bold">*</span>}
          </label>
          {hasUrl && (
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              {imgError ? (
                <span className="text-red-400 flex items-center gap-1">
                  <AlertCircle size={11} /> Invalid image URL
                </span>
              ) : imgLoaded ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={11} /> Preview active
                </span>
              ) : null}
            </span>
          )}
        </div>
      )}

      {/* Visual Preview Box */}
      <div
        className={`w-full ${aspectClass} rounded border border-slate-800 bg-slate-950/80 relative overflow-hidden flex items-center justify-center transition-all`}
      >
        {hasUrl ? (
          <>
            {/* Image Preview */}
            <img
              src={resolvedUrl}
              alt="Preview"
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => {
                setImgLoaded(true);
                setImgError(false);
              }}
              onError={() => {
                setImgLoaded(false);
                setImgError(true);
              }}
            />

            {/* Error Overlay if image fails to load */}
            {imgError && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center space-y-1 z-10">
                <AlertCircle size={22} className="text-red-400" />
                <p className="text-xs font-semibold text-red-300">Invalid image URL</p>
                <p className="text-[10px] text-slate-400 max-w-xs truncate font-mono">
                  The URL cannot be loaded as an image. Verify the Supabase URL is public.
                </p>
              </div>
            )}

            {/* Loading indicator while loading image */}
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-[11px] animate-pulse">
                Loading image preview...
              </div>
            )}

            {/* Quick Actions (Open link, Clear) */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white p-1 rounded border border-slate-700 backdrop-blur-sm transition-colors"
                title="Open image in new tab"
              >
                <ExternalLink size={12} />
              </a>
              <button
                type="button"
                onClick={handleClear}
                disabled={disabled}
                className="bg-red-950/80 hover:bg-red-800 text-red-300 hover:text-white p-1 rounded border border-red-800/80 backdrop-blur-sm transition-colors"
                title="Clear image URL"
              >
                <X size={12} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-4 space-y-1 text-slate-500">
            <ImageIcon size={26} className="mx-auto text-slate-700" />
            <p className="text-[11px] font-medium text-slate-400">No image URL configured</p>
            <p className="text-[10px] text-slate-600">Paste a Supabase image URL below or upload a file</p>
          </div>
        )}
      </div>

      {/* Input + Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full bg-slate-900 border ${
              imgError ? "border-red-800 focus:border-red-500" : "border-slate-800 focus:border-amber-500"
            } p-2 text-slate-100 placeholder-slate-600 focus:outline-none rounded font-mono text-[11px] pr-8 transition-colors`}
          />
          {hasUrl && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              title="Clear"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {onUpload && (
          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-2 text-[11px] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 rounded transition-colors whitespace-nowrap">
            <Upload size={13} className={isUploading ? "animate-bounce" : ""} />
            <span>{isUploading ? "Uploading..." : "Upload File"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
            />
          </label>
        )}
      </div>

      {helpText && <p className="text-[10px] text-slate-500 leading-relaxed">{helpText}</p>}
    </div>
  );
}
