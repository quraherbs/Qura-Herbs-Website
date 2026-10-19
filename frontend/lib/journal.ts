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
    id: 3,
    title: "How to Use Your Night Cream",
    slug: "how-to-use-your-night-cream",
    excerpt: "A simple nighttime ritual for fresh, radiant-looking skin.",
    featured_image: "/uploads/how_to_use_your_night_cream_ritual.jpg",
    author: "BY QURA HERBS | SKINCARE JOURNAL",
    published: true,
    published_at: "2026-10-19T00:00:00.000Z",
    content: `## 01 — CLEANSE

Start with a clean face. Wash away dirt, oil and impurities with a gentle face wash.

## 02 — APPLY

Take a small amount of **Night Cream** and apply an even, thin layer over your **face and neck**. Massage gently until absorbed.

## 03 — LEAVE OVERNIGHT

Let the cream work while you sleep. Leave it on overnight for intensive nighttime care.

## 04 — RINSE IN THE MORNING

Wash your face with clean water in the morning and enjoy skin that feels **fresh, soft and nourished**.

## YOUR 4-WEEK RITUAL

**Consistency makes the difference.**

With regular use, the Night Cream helps improve the appearance of dullness, uneven-looking tone and dark spots, leaving skin looking brighter and more radiant over time.

## FOR BETTER RESULTS

### CLEANSE DAILY
Use a gentle face wash every day. You can choose a suitable cleanser from **Qura Herbs**.

### STAY HYDRATED
Aim for around **3 litres of water daily**, depending on your individual needs.

### NOURISH YOUR SKIN FROM WITHIN
Choose balanced, nutritious meals and make healthy food choices part of your everyday routine.

## YOUR SKINCARE IS MORE THAN A CREAM.

**Consistency • Hydration • Cleansing • Healthy Choices**

Together, they create your best-looking skin.`
  },
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
  return undefined;
}
