"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState("✨ DISCOVER YOUR SKIN RITUAL | FREE SHIPPING ABOVE ₹1999");

  useEffect(() => {
    // Dynamic fetch from backend setting
    fetch(getApiUrl("/api/v1/admin/settings/homepage"))
      .then((res) => res.json())
      .then((data) => {
        if (data && data.value && data.value.announcement_bar) {
          setAnnouncement(data.value.announcement_bar);
        }
      })
      .catch((err) => console.log("Failed to load announcement:", err));
  }, []);

  return (
    <div className="w-full max-w-full overflow-hidden bg-brand-dark text-brand-cream text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest py-2 px-2 sm:px-4 text-center font-medium relative z-50">
      <div className="w-full max-w-full overflow-hidden whitespace-nowrap">
        <span className="inline-block animate-pulse duration-1000 max-w-full truncate sm:overflow-visible">
          {announcement}
        </span>
      </div>
    </div>
  );
}
