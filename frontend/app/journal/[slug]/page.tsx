import AnnouncementBar from "../../../components/AnnouncementBar";
import Navbar from "../../../components/Navbar";
import CartDrawer from "../../../components/CartDrawer";
import ArticleContent from "./ArticleContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function JournalDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-16">
        <ArticleContent slug={slug} />
      </main>

      <CartDrawer />
    </div>
  );
}
