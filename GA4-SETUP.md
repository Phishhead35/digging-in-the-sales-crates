# DITSC GA4 Setup

Companion to `src/utils/analytics.js`. The code collects the data; this
document is the console configuration that makes it visible. Skipping
Step 1 or Step 3 means the events fire and you still see nothing.

Property: `G-82Y1CFP1X4`

---

## Step 1: Data retention (do this first, today)

**Admin → Data settings → Data retention → Event data retention → 14 months**, then Save.

GA4 defaults to **2 months** and silently deletes everything older. You
launched in late March. If this has been sitting at the default, your
March through June event-level data is already gone and is not
recoverable. Nothing else in this document matters until this is
changed, because you will keep losing data while you configure the rest.

Also enable **Reset user data on new activity** on the same screen.

The 14-month cap applies to event-level data used for custom
explorations. Aggregate reports (Reports → Acquisition, etc.) are
retained indefinitely regardless of this setting.

---

## Step 2: Turn off the two Enhanced Measurement options that double-count

**Admin → Data streams → DITSC Website → Enhanced measurement → gear icon**

| Setting | Set to | Why |
|---|---|---|
| Site search | **OFF** | `/search` uses `?q=`, a default site-search param. Left on, GA4 fires its own `view_search_results` on top of ours. Verified 2026-08-10 via `/g/collect` capture: a cold load produced two hits, an in-app search produced one, so the inflation varied with traffic mix. |
| Page changes based on browser history events | **OFF** | `App.jsx` now fires `page_view` manually after paint. Left on, every SPA navigation counts twice, and GA4's version fires before React updates `document.title` so it records the *previous* page's title. |

Leave the rest on (scrolls, outbound clicks, file downloads, video
engagement). The custom `scroll_depth` event fires at 25/50/75/90; GA4's
built-in only fires at 90, and they coexist fine.

---

## Step 3: Register custom dimensions

**Admin → Custom definitions → Custom dimensions → Create**

For each: Scope = **Event**, Event parameter = the exact name below,
Dimension name = whatever reads well to you.

Unregistered parameters are still collected and still land in BigQuery,
but they are invisible in every GA4 UI report. The free tier caps you at
**50 event-scoped dimensions** and this build uses **37**, leaving 13
slots. Register in this order so the highest-value ones exist first.

### Tier 1: revenue attribution (register all 9 now)

| Parameter | What it answers |
|---|---|
| `click_source` | Which surface drives outbound clicks. Homepage cards, search results, wishlist, artist pages. Previously "(not set)" on all homepage clicks. |
| `marketplace` | eBay vs Discogs vs CDandLP vs partner site, derived from the URL, consistent across every page. |
| `price_bucket` | Price band of clicked items. Seven values, safe from cardinality collapse. |
| `monetized` | `yes`, `NO_LEAK`, `n_a_discogs`, `utm_only`. **Filter for `NO_LEAK` weekly.** Any hit means a link is sending free traffic to a marketplace. |
| `store_name` | Existing dimension, keep it. |
| `item_title` | Which specific records get clicked. High cardinality, expect "(other)" in the UI, precise in BigQuery. |
| `item_price` | Exact price. High cardinality, mainly for BigQuery averages. |
| `result_position` | Rank in the result list. Tells you whether people click past result 3. |
| `item_condition` | Whether condition grade predicts click-through. |

### Tier 2: demand and content gaps (register next 8)

`result_count`, `has_results`, `results_discogs`, `results_ebay`,
`results_cdandlp`, `search_origin`, `search_source`, `filter_source`

`search_no_results` plus `search_term` is the highest-value pair on the
site: a live list of records people came here wanting that you could not
deliver. Feed it straight into artist-page and blog decisions.

### Tier 3: diagnostics, navigation, content (register when you want them)

`api_name`, `error_status`, `error_message`, `error_source`,
`search_latency_ms`, `nav_label`, `nav_destination`, `nav_location`,
`social_platform`, `post_slug`, `artist_name`, `series_name`,
`destination`, `source`, `video_title`, `video_id`, `page_number`,
`item_count`, `faq_question`, `store_url`

Full list is 37 dimensions. Tier 1 is 9, Tier 2 is 8, Tier 3 is 20.

---

## Step 4: Mark key events

**Admin → Events → Mark as key event** for:

- `store_click` — the money event
- `select_item` — item-level view of the same click
- `wishlist_add` — strongest non-click intent signal

Do **not** mark `search` or `page_view`. Marking high-volume events as
key events makes your conversion rate meaningless.

---

## Step 5: BigQuery export (this is the actual "know everything")

**Admin → Product links → BigQuery links → Link**

This is the single highest-leverage item in this document and it is free
on standard GA4.

What the GA4 UI gives you is aggregated, thresholded, capped at 14
months, and collapses high-cardinality dimensions such as `search_term`
and `item_title` into "(other)". BigQuery export gives you **one row per
event, every parameter intact, retained as long as you want, queryable
in SQL**.

- GA4 standard properties: daily export included at no cost.
- BigQuery sandbox: 10 GB storage and 1 TB of queries per month free.
- At DITSC's current volume you will not come close to either limit.

Choose **Daily** export. Streaming costs money and you do not need it.

Once linked, a query like this answers the question EPN cannot:

```sql
SELECT
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key='marketplace')  AS marketplace,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key='click_source') AS click_source,
  COUNT(*) AS clicks,
  ROUND(AVG((SELECT value.double_value FROM UNNEST(event_params) WHERE key='item_price')), 2) AS avg_price
FROM `YOUR_PROJECT.analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260601' AND '20260821'
  AND event_name = 'store_click'
GROUP BY 1, 2
ORDER BY clicks DESC
```

There is a Google Cloud BigQuery MCP connector available on claude.ai.
Connect it and I can query this directly instead of you exporting CSVs.

---

## Step 6: Verify before you trust any of it

**Admin → DebugView**, then on the live site open the console and run:

```js
localStorage.setItem('ditsc_debug', '1')
```

Every tracked event now logs to the console in amber with its full
payload, so you can confirm the shape locally before waiting on
DebugView. Turn it off with `localStorage.removeItem('ditsc_debug')`.

Walk this checklist and confirm each event appears **exactly once**:

- [ ] Load the homepage. One `page_view`, no duplicate.
- [ ] Click a "Shops We Dig" card. One `store_click` with `click_source = homepage_partner_card` and a real `marketplace`. Before this change it was `(not set)`.
- [ ] Search from the homepage box. One `search_origin` (`homepage_box`), then one `search` on `/search`, then one `view_search_results` carrying `result_count`.
- [ ] Confirm you do **not** see a second `view_search_results`. If you do, Site search is still on in Enhanced Measurement.
- [ ] Click "View Deals" on a result. One `store_click` with `item_price`, `price_bucket`, `result_position`, and `monetized = yes`, plus one `select_item`.
- [ ] Heart a record. One `wishlist_add`.
- [ ] Go to `/wishlist`, click "View Deals" on a CDandLP item. Confirm `monetized = yes`, not `NO_LEAK`. This is the bug that was fixed.
- [ ] Navigate between routes. One `page_view` per navigation with the **correct** page title, not the previous page's.
- [ ] Search something with no results. One `search_no_results`.
- [ ] Deals page, click Turntable Lab. One `store_click`, `click_source = deals_page`, `monetized = yes`.
- [ ] Deals page, click Fat Beats. One `store_click`, `monetized = not_affiliate`. That is correct, not a bug: it is a deliberately unmonetized link.
- [ ] Local shops, search a zip. One `local_shop_search` with `result_count`.
- [ ] Click a nav item. One `nav_click` with the right `nav_location` (`header_desktop`, `header_mobile`, or `footer`).
- [ ] Footer partnership email link. One `store_click` with `click_source = footer`.
- [ ] Open an FAQ question. One `faq_open`. Closing it again fires nothing.

If a step produces two events, stop and fix it before collecting a week
of inflated data.

---

## What to actually look at, once data accumulates

Give it 7 to 14 days before drawing conclusions. At current traffic
(roughly 18 eBay clicks per 60 days) most of these will be too thin to
read at first, and that thinness is itself the finding.

1. **`monetized = NO_LEAK`, any occurrence.** Check weekly. Should always be zero.
1b. **`store_click` where `click_source = deals_page` and `monetized = yes`.** Turntable Lab (`aff=56122`) and Retrolife (`tidd.ly`) are live affiliate programs on that page that had no tracking at all before this build. Check these against those programs' own dashboards the same way you check EPN.
2. **`search_no_results` by `search_term`.** Your content roadmap, written by your visitors.
3. **`store_click` by `click_source`.** Which surface actually earns. If wishlist converts at a higher rate than search, build more toward saving and returning.
4. **`store_click` by `marketplace`.** Only eBay and CDandLP pay you. Discogs clicks are goodwill, not revenue.
5. **`result_position` distribution.** If clicks cluster at positions 1 to 3, sorting quality matters far more than result volume.
6. **`api_error` by `api_name`.** You have already had one Discogs 429 incident. This makes the next one visible the same day.
7. **`price_bucket` on clicks.** eBay commission is a percentage of sale price, so a click on a $60 record is worth several clicks on a $12 one.

---

## One honest caveat about "track everything"

This instrumentation is close to the practical ceiling for GA4 on a site
like this, and it is worth being clear about what more tracking cannot
fix.

More data does not create traffic. At 18 outbound eBay clicks per 60
days, every report above is directionally interesting and statistically
meaningless. You will not find a conversion problem in this data because
there is not enough of it to contain one. What you will find is which
surfaces work, which searches fail, and whether anything is broken, and
those are the inputs to a traffic strategy rather than a substitute for
one.

The one exception, the thing that pays for itself immediately regardless
of volume, is `monetized = NO_LEAK`. That catches money already being
left on the table.

---

*Last updated: August 2026 | digginginthesalescrates.com*
