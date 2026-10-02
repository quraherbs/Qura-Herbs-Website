"use client";

import React from "react";
import { LogOut, CheckCircle2, AlertCircle, Sparkles, X, Info } from "lucide-react";

export interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  message: React.ReactNode;
  iconType?: "logout" | "success" | "warning" | "info" | "sparkles";
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
}

export default function ThemeModal({
  isOpen,
  onClose,
  title,
  subtitle,
  message,
  iconType = "info",
  primaryButtonText = "Close",
  onPrimaryClick,
  secondaryButtonText,
  onSecondaryClick,
}: ThemeModalProps) {
  if (!isOpen) return null;

  const handlePrimary = () => {
    if (onPrimaryClick) onPrimaryClick();
    onClose();
  };

  const handleSecondary = () => {
    if (onSecondaryClick) onSecondaryClick();
    onClose();
  };

  const renderIcon = () => {
    switch (iconType) {
      case "logout":
        return <LogOut size={22} className="text-[#A47148]" />;
      case "success":
        return <CheckCircle2 size={22} className="text-[#A47148]" />;
      case "warning":
        return <AlertCircle size={22} className="text-[#A47148]" />;
      case "sparkles":
        return <Sparkles size={22} className="text-[#A47148]" />;
      case "info":
      default:
        return <Info size={22} className="text-[#A47148]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C1A14]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] border border-[#EFE8D8] p-8 max-w-md w-full shadow-2xl relative text-center space-y-6 animate-in zoom-in-95 duration-200 rounded-none">
        
        {/* Close icon at top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#3D261D]/40 hover:text-[#2C1A14] transition-colors p-1"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Soft gold accent icon badge */}
        <div className="w-14 h-14 rounded-full bg-[#A47148]/10 border border-[#A47148]/20 flex items-center justify-center mx-auto">
          {renderIcon()}
        </div>

        {/* Header Titles */}
        <div className="space-y-2">
          {subtitle && (
            <span className="text-[10px] tracking-[0.25em] font-sans font-semibold text-[#A47148] uppercase block">
              {subtitle}
            </span>
          )}
          <h3 className="font-serif text-2xl font-light text-[#2C1A14] leading-snug">
            {title}
          </h3>
          <div className="w-10 h-[1px] bg-[#A47148] mx-auto opacity-40"></div>
        </div>

        {/* Body Message */}
        <div className="text-sm font-sans font-light text-[#3D261D]/85 leading-relaxed">
          {message}
        </div>

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {secondaryButtonText && (
            <button
              onClick={handleSecondary}
              className="w-full sm:w-auto border border-[#EFE8D8] hover:border-[#2C1A14] text-[#3D261D] hover:text-[#2C1A14] text-xs uppercase tracking-widest font-semibold py-3 px-6 transition-all duration-300 rounded-none font-sans"
            >
              {secondaryButtonText}
            </button>
          )}

          <button
            onClick={handlePrimary}
            className="w-full sm:w-auto bg-[#2C1A14] hover:bg-[#A47148] text-[#FAF7F2] text-xs uppercase tracking-widest font-bold py-3 px-7 transition-all duration-300 shadow-md rounded-none font-sans"
          >
            {primaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
