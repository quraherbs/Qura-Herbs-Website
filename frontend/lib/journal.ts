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
    id: 4,
    title: "THE HAIR RESET",
    slug: "the-hair-reset",
    excerpt: "How to Use Your Anti-Frizz Hair Serum — A quick, effortless ritual for smoother, healthier-looking hair.",
    featured_image: "/uploads/the_hair_reset_before_after.jpg",
    author: "BY QURA HERBS | SKINCARE JOURNAL",
    published: true,
    published_at: "2026-10-19T01:00:00.000Z",
    content: `## 01 — TAKE 2 PUMPS

Dispense **2 pumps** of serum onto your palm. Adjust slightly depending on your hair length and volume.

## 02 — APPLY TO THE HAIR

Gently spread the serum through the **mid-lengths and ends** of your hair.

**Avoid applying directly to the scalp.**

## 03 — COMB THROUGH

Comb your hair gently and evenly to distribute the serum.

**Watch the frizz settle in just a few strokes.**

## 04 — STYLE & GO

Your hair is instantly more **smooth, manageable and polished**—without a complicated routine.

## SUPPORTING BENEFITS

Made with **natural hair-loving ingredients**, the serum helps nourish and condition the hair while keeping it smooth and manageable.

**Quick relief from everyday frizz.**

Use it whenever your hair needs a quick refresh.

## PERFECT FOR YOUR EVERYDAY MOMENTS

### Before an office meeting
Tame flyaways and look polished.

### Before a shoot or event
Get smoother, camera-ready hair.

### After a windy bike ride
Bring messy, frizzy hair back under control.

### After wearing a helmet
Refresh and smooth flattened, unruly hair.

### Anytime. Any day.
Whenever frizz shows up, **2 pumps + a quick comb = smoother-looking hair.**

## YOUR HAIR, JUST MORE MANAGEABLE.

**Smooth • Nourish • Strengthen • Style**`
  },
  {
    id: 3,
    title: "How to Use Your Night Cream",
    slug: "how-to-use-your-night-cream",
    excerpt: "A simple nighttime ritual for fresh, radiant-looking skin.",
    featured_image: "/uploads/the_glow_guide_journal.jpg",
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
