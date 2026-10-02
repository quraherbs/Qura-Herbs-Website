import AnnouncementBar from "../../../components/AnnouncementBar";
import Navbar from "../../../components/Navbar";
import CartDrawer from "../../../components/CartDrawer";
import CategoryProductList from "./CategoryProductList";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <CategoryProductList slug={slug} />
      </main>

      <CartDrawer />
    </div>
  );
}
