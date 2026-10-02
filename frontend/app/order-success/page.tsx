import { Suspense } from "react";
import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import SuccessDetails from "./SuccessDetails";

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C1A14]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Suspense fallback={<div className="text-sm font-sans animate-pulse text-center py-10">Loading Details...</div>}>
          <SuccessDetails />
        </Suspense>
      </main>
    </div>
  );
}
