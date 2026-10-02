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
    <div className="w-full bg-brand-dark text-brand-cream text-xs uppercase tracking-widest py-2 px-4 text-center font-medium relative z-50">
      <div className="overflow-hidden whitespace-nowrap scroll-smooth">
        <span className="inline-block animate-pulse duration-1000">
          {announcement}
        </span>
      </div>
    </div>
  );
}
