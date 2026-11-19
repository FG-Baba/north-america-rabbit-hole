import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders one cinematic three-act rabbit hole", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>How Did So Much of North America Become Just Two Countries\?/);
  assert.match(html, /One fire question later, we were 300 million years deep\./);
  assert.equal((html.match(/class="scroll-chapter/g) ?? []).length, 3);
  assert.match(html, /id="land"[^>]*data-scene="land"/);
  assert.match(html, /id="water"[^>]*data-scene="water"/);
  assert.match(html, /id="people"[^>]*data-scene="people"/);
  assert.doesNotMatch(html, /role="tablist"|earth-explorer|process-explorer|country-switch/);

  assert.match(html, /The Pangaea instinct was right\. The earthquake story was not\./);
  assert.match(html, /Earthquakes are evidence of plate motion, not one giant hammer/);
  assert.match(html, /There may be no cleaner answer than: Earth assembled it this way\./);
  assert.match(html, /A mountain is also a decision for water\./);
  assert.match(html, /Pacific/);
  assert.match(html, /Atlantic.*Gulf/s);
  assert.match(html, /Hudson Bay/);
  assert.match(html, /Ice can make water change its mind\./);
  assert.match(html, /Fire changes landscapes\. It does not explain the two-country map\./);
  assert.match(html, /Low population density did not mean vacant land\./);
  assert.match(html, /Darkness is not emptiness/);
  assert.match(html, /Claim ≠ control ≠ consent/);
  assert.match(html, /Rock made the landmass/);
  assert.match(html, /Could the land split again\?/);
  assert.match(html, /Could the countries split\?/);
});

test("makes scroll, water, and sharing useful without hiding the story", async () => {
  const html = await (await render()).text();

  assert.match(html, /src="\/og\.png"/);
  assert.match(html, /src="\/usgs-north-america-terrain\.jpg"/);
  assert.match(html, /src="\/nasa-americas-night\.jpg"/);
  assert.match(html, /USGS.*Tapestry of Time and Terrain/s);
  assert.match(html, /NASA.*night lights/s);
  assert.match(html, /Schematic.*not a territory map/i);
  assert.match(html, /type="range"[^>]*aria-label="Move a raindrop across the mountain divide"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /<details[^>]*class="sources-drawer"/);
  assert.match(html, /Share the rabbit hole/);
  assert.match(html, /rel="noopener noreferrer"/);

  const externalLinks = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];
  assert.ok(externalLinks.length > 0);
  for (const link of externalLinks) assert.match(link, /rel="noopener noreferrer"/);
});

test("grounds every visual layer in authoritative sources", async () => {
  const html = await (await render()).text();
  const requiredSources = [
    "https://pubs.usgs.gov/imap/i2781/",
    "https://www.usgs.gov/faqs/what-was-pangea",
    "https://www.usgs.gov/geology-and-ecology-of-national-parks/geology-great-smoky-mountains-national-park",
    "https://www.nps.gov/glac/learn/education/continental_divide.htm",
    "https://pubs.usgs.gov/gip/continents/",
    "https://americanindian.si.edu/nk360/about/essential-understandings",
    "https://www.nps.gov/subjects/archeology/traders-and-travelers.htm",
    "https://science.nasa.gov/image-detail/amf-gsfc_20171208_archive_e001587/",
    "https://www.census.gov/data/tables/time-series/dec/population-density/2020.html",
    "https://www12.statcan.gc.ca/census-recensement/2021/geo/maps-cartes/thematicmaps-cartesthematiques/index2021-eng.cfm",
    "https://history.state.gov/milestones/all",
    "https://www.canada.ca/en/canadian-heritage/services/historical-boundaries-canada.html",
    "https://open.canada.ca/data/en/dataset/f281b150-0645-48e4-9c30-01f55f93f78e",
    "https://www.nps.gov/subjects/fire/indigenous-fire-practices-shape-our-land.htm",
  ];

  for (const source of requiredSources) {
    assert.ok(html.includes(source), `Missing source: ${source}`);
  }
});

test("keeps the rich motion progressive, responsive, and durable", async () => {
  const [page, layout, report, foundationCss, landCss, waterCss, peopleCss, responsiveCss] =
    await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/Report.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/styles/foundation.css", import.meta.url), "utf8"),
      readFile(new URL("../app/styles/deep-time.css", import.meta.url), "utf8"),
      readFile(new URL("../app/styles/stewardship.css", import.meta.url), "utf8"),
      readFile(new URL("../app/styles/fire-and-footer.css", import.meta.url), "utf8"),
      readFile(new URL("../app/styles/responsive.css", import.meta.url), "utf8"),
    ]);

  assert.match(page, /openGraph/);
  assert.match(page, /twitter/);
  assert.match(page, /\/og\.png/);
  assert.doesNotMatch(layout, /Starter Project|Fire, Land & Deep Time/);
  assert.match(report, /useScrollProgress/);
  assert.match(report, /requestAnimationFrame/);
  assert.match(report, /devicePixelRatio/);
  assert.match(report, /<canvas/);
  assert.doesNotMatch(report, /<svg/);
  assert.doesNotMatch(report, /dangerouslySetInnerHTML/);
  assert.match(report, /How Did So Much of North America Become Just Two Countries\?/);
  assert.match(report, /navigator\.clipboard\.writeText/);
  assert.match(foundationCss, /position:\s*sticky/);
  assert.match(foundationCss, /:focus-visible/);
  assert.match(landCss, /\.cover-mountain-layer/);
  assert.match(landCss, /mix-blend-mode/);
  assert.match(waterCss, /\.water-canvas/);
  assert.match(peopleCss, /\.people-canvas/);
  assert.match(responsiveCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(responsiveCss, /@media print/);

  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/usgs-north-america-terrain.jpg", import.meta.url));
  await access(new URL("../public/nasa-americas-night.jpg", import.meta.url));
});
