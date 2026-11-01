"use client";

import React, { useState } from "react";
import { Sparkles, Check } from "lucide-react";

interface CustomizerPreviewProps {
  customText: string;
  onTextChange: (text: string) => void;
  selectedColor?: string;
  placeholder?: string;
  category: string;
}

export const CustomizerPreview: React.FC<CustomizerPreviewProps> = ({
  customText,
  onTextChange,
  selectedColor = "Obsidian Black",
  placeholder = "കവറിൽ പ്രിന്റ് ചെയ്യേണ്ട പേര് നൽകുക",
  category
}) => {
  const [fontStyle, setFontStyle] = useState<"serif" | "cursive" | "sans">("serif");
  const [foilEffect, setFoilEffect] = useState<"silver" | "gold" | "white">("silver");

  const getCoverBg = () => {
    switch (selectedColor) {
      case "Obsidian Black":
        return "#111111";
      case "Slate Grey":
        return "#262626";
      case "Chalk White":
        return "#f5f5f5";
      default:
        return "#171717";
    }
  };

  const getFoilStyle = () => {
    if (selectedColor === "Chalk White") {
      return {
        color: "#111111",
        textShadow: "0 1px 1px rgba(0,0,0,0.1)",
      };
    }

    switch (foilEffect) {
      case "silver":
        return {
          background: "linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #a3a3a3 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
        };
      case "gold":
        return {
          background: "linear-gradient(135deg, #fffbeb 0%, #fef08a 50%, #ca8a04 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
        };
      case "white":
        return {
          color: "#ffffff",
          textShadow: "0 1px 3px rgba(0,0,0,0.9)",
        };
    }
  };

  const getFontFamily = () => {
    switch (fontStyle) {
      case "serif":
        return "Georgia, 'Times New Roman', serif";
      case "cursive":
        return "'Brush Script MT', 'Segoe Script', cursive";
      case "sans":
        return "'Segoe UI', Roboto, sans-serif";
    }
  };

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>കവറിൽ പേര് നൽകുക (Live Name Preview)</span>
        </div>
        <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-mono uppercase">
          Free Customization
        </span>
      </div>

      {/* Realistic Mockup Box in B&W */}
      <div
        className="relative overflow-hidden rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px] border border-neutral-300 shadow-inner"
        style={{ backgroundColor: getCoverBg() }}
      >
        <div className="absolute inset-2.5 border border-white/10 rounded-lg pointer-events-none" />

        <div className="text-white/30 text-[10px] tracking-[4px] uppercase mb-4 font-mono">
          NEXT TASK • BESPOKE EDITION
        </div>

        {/* Live Embossed Custom Text */}
        <div
          className="text-center px-4 py-2 transition-all duration-300 tracking-wider font-semibold max-w-full break-words"
          style={{
            ...getFoilStyle(),
            fontFamily: getFontFamily(),
            fontSize: customText.length > 20 ? "1.2rem" : "1.5rem",
            letterSpacing: fontStyle === "serif" ? "2px" : "1px",
          }}
        >
          {customText.trim() ? customText : (
            <span className="opacity-25 italic font-normal text-sm text-neutral-400">
              (നിങ്ങളുടെ പേര് ഇവിടെ തെളിയും)
            </span>
          )}
        </div>

        <div className="text-white/20 text-[9px] uppercase tracking-widest mt-6 font-mono">
          Handcrafted in India
        </div>
      </div>

      {/* Input Field */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
          പ്രിന്റ് ചെയ്യേണ്ട പേര് അല്ലെങ്കിൽ വരികൾ നൽകുക:
        </label>
        <div className="relative">
          <input
            type="text"
            value={customText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={placeholder}
            maxLength={35}
            className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-black text-black placeholder:text-neutral-400"
          />
          <span className="absolute right-3 top-2 text-[10px] text-neutral-400 font-mono">
            {customText.length}/35
          </span>
        </div>
      </div>

      {/* Font & Foil Options */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            ഫോണ്ട് സ്റ്റൈൽ (Font):
          </label>
          <div className="flex gap-1.5">
            {[
              { id: "serif", label: "Serif", font: "Georgia" },
              { id: "cursive", label: "Script", font: "cursive" },
              { id: "sans", label: "Sans", font: "sans-serif" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFontStyle(f.id as any)}
                className={`flex-1 text-xs py-1.5 rounded border text-center transition-all ${
                  fontStyle === f.id
                    ? "bg-black text-white border-black font-bold"
                    : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                }`}
                style={{ fontFamily: f.font }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
            പ്രിന്റ് ഫോയിൽ (Foil):
          </label>
          <div className="flex gap-1.5">
            {[
              { id: "silver", label: "Silver" },
              { id: "gold", label: "Gold" },
              { id: "white", label: "Matte" },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFoilEffect(c.id as any)}
                className={`flex-1 text-xs py-1.5 rounded border text-center transition-all ${
                  foilEffect === c.id
                    ? "bg-black text-white border-black font-bold"
                    : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 bg-white p-2 rounded-lg border border-neutral-200">
        <Check className="w-3.5 h-3.5 text-black shrink-0" />
        <span>ഓർഡർ ചെയ്യുമ്പോൾ ഈ പേര് കൃത്യമായി പ്രിന്റ് ചെയ്ത് അയച്ചു നൽകും.</span>
      </div>
    </div>
  );
};
