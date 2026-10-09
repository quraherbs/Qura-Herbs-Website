export interface JournalArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  published: boolean;
  published_at: string;
}

export const CANONICAL_JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 2,
    title: "How to Use Our Avocado Night Cream for Maximum Hydration",
    slug: "how-to-use-our-avocado-night-cream-for-maximum-hydration",
    excerpt: "Discover a simple nighttime ritual to nourish your skin, maintain moisture, and wake up to soft, healthy-looking skin.",
    featured_image: "/uploads/the_glow_guide_journal.jpg",
    author: "BY QURA HERBS | SKINCARE JOURNAL",
    published: true,
    published_at: "2026-10-10T00:00:00.000Z",
    content: `## Your Nighttime Ritual for Naturally Nourished Skin

Your skin deserves gentle care at the end of the day. A consistent nighttime skincare routine helps maintain hydration and leaves your skin feeling soft, smooth, and refreshed.

Qura Herbs Avocado Pro Nourish Night Cream combines avocado, sweet almond oil, honey, seaweed, milk protein, and wheat germ extract in a nourishing skincare formula designed to complement your nighttime routine.

Follow these four simple steps to make the most of your skincare ritual.

## Step 01 — Cleanse Your Skin

Begin by cleansing your face with a gentle cleanser to remove makeup, sunscreen, excess oil, and everyday impurities. Rinse thoroughly with lukewarm water and pat your skin dry with a clean towel.

Clean skin provides the ideal starting point for your nighttime skincare routine.

## Step 02 — Apply the Night Cream

Take a small amount of Qura Herbs Avocado Pro Nourish Night Cream onto your fingertips. Gently distribute it across your forehead, cheeks, chin, and neck, avoiding direct contact with your eyes.

Apply an even layer without using excessive product.

## Step 03 — Massage Gently

Using your fingertips, massage the cream into your skin with gentle, circular movements until it is evenly distributed. Pay attention to areas that tend to feel dry or tight.

Keep the application gentle to maintain a comfortable and relaxing skincare experience.

## Step 04 — Let Your Skin Rest Overnight

Allow the cream to settle into your skin before going to bed. Overnight, your regular skincare routine can support your skin's moisture needs while you rest.

For best results, follow the product directions consistently and maintain a routine suited to your skin type.

## The Nourishing Ingredients Behind Your Routine

**Avocado** helps condition the skin and maintain a soft, moisturised feel.

**Sweet Almond Oil** helps nourish the skin and reduce the feeling of dryness.

**Honey** supports moisture retention and helps leave the skin feeling soft.

**Seaweed, Milk Protein, and Wheat Germ Extract** complement the formula with a blend of skin-conditioning ingredients.

## Tips for a Better Nighttime Skincare Routine

- Cleanse your face before applying the cream to remove daily impurities.
- Use an appropriate amount and spread it evenly across your skin.
- Follow your routine consistently rather than applying excessive product.
- Apply broad-spectrum sunscreen during the day to help protect your skin from UV exposure.
- Patch-test new skincare products before regular use. Discontinue use if irritation occurs.

## Wake Up to a Nourished-Looking Glow

Beautiful skin begins with consistent care. A gentle nighttime routine, adequate rest, and suitable skincare products can help maintain soft, comfortable, and healthy-looking skin over time.

Make Qura Herbs Avocado Pro Nourish Night Cream part of your evening ritual and give your skin the care it deserves.

Qura Herbs — Beauty Rooted in Care, Confidence, and Authenticity.`
  }
];

export function getArticleBySlug(slug: string): JournalArticle | undefined {
  if (!slug) return CANONICAL_JOURNAL_ARTICLES[0];
  const normalized = slug.toLowerCase().trim();
  const decoded = decodeURIComponent(slug).toLowerCase().trim();
  const found = CANONICAL_JOURNAL_ARTICLES.find(
    (a) => a.slug.toLowerCase().trim() === normalized || a.slug.toLowerCase().trim() === decoded
  );
  if (found) return found;
  return CANONICAL_JOURNAL_ARTICLES[0];
}
