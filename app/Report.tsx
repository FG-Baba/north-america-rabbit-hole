"use client";

/* eslint-disable @next/next/no-img-element -- the static atlas plates are layered and transformed directly */

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  BORDER_MOMENTS,
  REPORT_AS_OF,
  SOURCE_GROUPS,
  SOURCES,
  type SourceKey,
} from "./facts";

type Basin = {
  name: string;
  short: string;
  note: string;
};
const SHARE_TEXT = "How Did So Much of North America Become Just Two Countries? A three-act terrain and watershed story.";
const BASINS: readonly Basin[] = [
  {
    name: "Pacific Ocean",
    short: "Pacific",
    note: "West of the divide, gravity takes the drop toward the Pacific.",
  },
  {
    name: "Hudson Bay",
    short: "Hudson Bay",
    note: "Near the northern split, a small move can send water toward Hudson Bay.",
  },
  {
    name: "Atlantic Ocean or Gulf of Mexico",
    short: "Atlantic / Gulf",
    note: "East of the divide, connected rivers can carry it toward the Atlantic or Gulf.",
  },
] as const;

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}
function range(value: number, start: number, end: number) {
  return clamp((value - start) / (end - start));
}

function useScrollProgress(): readonly [RefObject<HTMLElement | null>, number] {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const next = clamp(-rect.top / travel);
      setProgress((previous) => (Math.abs(previous - next) < 0.001 ? previous : next));
    };

    const requestMeasure = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    requestMeasure();
    window.addEventListener("scroll", requestMeasure, { passive: true });
    window.addEventListener("resize", requestMeasure);
    return () => {
      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return [ref, progress] as const;
}

function SourceLink({ source, children = "source ↗" }: { source: SourceKey; children?: ReactNode }) {
  const item = SOURCES[source];
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="source-link">
      {children}
    </a>
  );
}
function StoryNav({ active }: { active: string }) {
  return (
    <nav className="story-nav" aria-label="Story chapters">
      <a href="#land" className={active === "land" ? "is-active" : ""}>
        <span>01</span> land
      </a>
      <a href="#water" className={active === "water" ? "is-active" : ""}>
        <span>02</span> water
      </a>
      <a href="#people" className={active === "people" ? "is-active" : ""}>
        <span>03</span> people
      </a>
    </nav>
  );
}
function ChapterMarker({ number, label }: { number: string; label: string }) {
  return (
    <div className="chapter-marker" aria-hidden="true">
      <span>{number}</span>
      <i />
      <strong>{label}</strong>
    </div>
  );
}
function Beat({ tone = "dark", children }: { tone?: "dark" | "paper" | "clear"; children: ReactNode }) {
  return <article className={`story-beat story-beat--${tone}`}>{children}</article>;
}
function LandStage({ progress }: { progress: number }) {
  const coverFade = 1 - range(progress, 0.19, 0.44);
  const terrainFade = range(progress, 0.23, 0.5);
  const titleLift = -40 * range(progress, 0.04, 0.36);
  const mountainShift = -90 * range(progress, 0.02, 0.42);
  const mapShift = 42 * range(progress, 0.04, 0.42);
  const seamOpen = range(progress, 0.43, 0.73);

  return (
    <div className="chapter-stage land-stage" aria-hidden="true">
      <img
        className="cover-base-layer"
        src="/og.png"
        alt=""
        fetchPriority="high"
        style={{ opacity: coverFade, transform: `scale(${1 + progress * 0.025})` }}
      />
      <img
        className="cover-map-layer"
        src="/og.png"
        alt=""
        style={{ opacity: coverFade, transform: `translate3d(${mapShift}px, 0, 0) scale(1.03)` }}
      />
      <img
        className="cover-mountain-layer"
        src="/og.png"
        alt=""
        style={{ opacity: coverFade, transform: `translate3d(${mountainShift}px, 0, 0) scale(1.045)` }}
      />
      <div className="cover-grain" />
      <div className="cover-live-title" style={{ transform: `translate3d(0, ${titleLift}px, 0)`, opacity: coverFade }}>
        <p>A three-layer rabbit hole</p>
        <div className="cover-display-title">How did so much of North America become just two countries?</div>
        <span>Rock made the land. Power drew the lines.</span>
      </div>

      <img
        className="terrain-atlas"
        src="/usgs-north-america-terrain.jpg"
        alt=""
        loading="eager"
        style={{ opacity: terrainFade, transform: `scale(${1.08 - terrainFade * 0.08})` }}
      />
      <div className="terrain-shade" style={{ opacity: terrainFade }} />
      <div className="ocean-seam" style={{ opacity: seamOpen, transform: `scaleX(${0.18 + seamOpen * 0.82})` }}>
        <span>Atlantic basin opens over millions of years</span>
      </div>
      <div className="terrain-label terrain-label--west" style={{ opacity: range(progress, 0.58, 0.78) }}>
        Pacific edge
      </div>
      <div className="terrain-label terrain-label--ridge" style={{ opacity: range(progress, 0.61, 0.81) }}>
        Cordillera
      </div>
      <div className="terrain-label terrain-label--shield" style={{ opacity: range(progress, 0.64, 0.84) }}>
        Canadian Shield
      </div>
      <div className="asset-credit" style={{ opacity: terrainFade }}>
        Relief + rock ages · USGS Tapestry of Time and Terrain
      </div>
    </div>
  );
}
function sizeCanvas(canvas: HTMLCanvasElement) {
  const bounds = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(bounds.width * ratio));
  const height = Math.max(1, Math.round(bounds.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { context, width: bounds.width, height: bounds.height };
}
function drawContour(
  context: CanvasRenderingContext2D,
  width: number,
  baseY: number,
  amplitude: number,
  phase: number,
) {
  context.beginPath();
  for (let x = -20; x <= width + 20; x += 12) {
    const y = baseY + Math.sin(x * 0.014 + phase) * amplitude + Math.sin(x * 0.037) * amplitude * 0.24;
    if (x === -20) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.stroke();
}
function drawFlow(
  context: CanvasRenderingContext2D,
  points: ReadonlyArray<readonly [number, number]>,
  reveal: number,
  color: string,
  width: number,
) {
  if (reveal <= 0) return;
  context.save();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.globalAlpha = 0.42 + reveal * 0.58;
  context.shadowColor = color;
  context.shadowBlur = 12;
  context.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();
  context.restore();
}

function WaterCanvas({ progress, drop }: { progress: number; drop: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let frame = 0;

    const draw = () => {
      const sized = sizeCanvas(canvas);
      if (!sized) return;
      const { context, width, height } = sized;
      context.clearRect(0, 0, width, height);

      const ridgeX = width * 0.49;
      const ground = height * 0.78;
      const fade = range(progress, 0.04, 0.22);

      context.save();
      context.globalAlpha = 0.2 * fade;
      context.strokeStyle = "#d8cbb1";
      context.lineWidth = 0.7;
      for (let row = 0; row < 17; row += 1) {
        drawContour(context, width, height * 0.13 + row * height * 0.047, 8 + row * 0.42, row * 0.63);
      }
      context.restore();

      const gradient = context.createLinearGradient(0, height * 0.2, 0, ground);
      gradient.addColorStop(0, "rgba(226,216,191,.8)");
      gradient.addColorStop(0.45, "rgba(94,91,76,.69)");
      gradient.addColorStop(1, "rgba(30,36,32,.76)");
      context.fillStyle = gradient;
      context.beginPath();
      context.moveTo(-30, ground);
      context.lineTo(width * 0.1, height * 0.68);
      context.lineTo(width * 0.2, height * 0.61);
      context.lineTo(width * 0.28, height * 0.51);
      context.lineTo(width * 0.36, height * 0.58);
      context.lineTo(width * 0.43, height * 0.36);
      context.lineTo(ridgeX, height * 0.17);
      context.lineTo(width * 0.54, height * 0.31);
      context.lineTo(width * 0.61, height * 0.43);
      context.lineTo(width * 0.67, height * 0.39);
      context.lineTo(width * 0.74, height * 0.56);
      context.lineTo(width * 0.86, height * 0.64);
      context.lineTo(width + 30, ground);
      context.closePath();
      context.fill();

      context.save();
      context.strokeStyle = "rgba(15,18,15,.52)";
      context.lineWidth = 1.1;
      for (let ridge = 0; ridge < 11; ridge += 1) {
        const inset = ridge * height * 0.013;
        context.beginPath();
        context.moveTo(width * 0.05, ground - inset * 0.2);
        context.lineTo(width * 0.26, height * 0.59 + inset);
        context.lineTo(ridgeX, height * 0.17 + inset);
        context.lineTo(width * 0.71, height * 0.53 + inset);
        context.lineTo(width * 0.94, ground - inset * 0.18);
        context.stroke();
      }
      context.restore();

      const origin: readonly [number, number] = [ridgeX, height * 0.21];
      const west = [origin, [width * 0.43, height * 0.4], [width * 0.3, height * 0.52], [width * 0.19, height * 0.7], [-20, height * 0.82]] as const;
      const north = [origin, [width * 0.56, height * 0.28], [width * 0.61, height * 0.17], [width * 0.72, height * 0.08], [width * 0.84, -20]] as const;
      const east = [origin, [width * 0.57, height * 0.39], [width * 0.67, height * 0.5], [width * 0.76, height * 0.7], [width + 20, height * 0.84]] as const;
      const routeReveal = range(progress, 0.02, 0.22);

      const ice = 1 - Math.abs(range(progress, 0.5, 0.88) * 2 - 1);
      if (ice > 0) {
        context.save();
        context.globalAlpha = ice * 0.52;
        context.fillStyle = "#d9eced";
        context.shadowColor = "#cae8ec";
        context.shadowBlur = 30;
        context.beginPath();
        context.moveTo(width * 0.27, -20);
        context.bezierCurveTo(width * 0.34, height * 0.2, width * 0.43, height * 0.21, width * 0.51, height * 0.43);
        context.bezierCurveTo(width * 0.63, height * 0.26, width * 0.7, height * 0.2, width * 0.78, -20);
        context.closePath();
        context.fill();
        context.restore();
      }

      drawFlow(context, west, routeReveal, "#63d6f4", 4.2);
      drawFlow(context, north, routeReveal, "#99e5db", 4.2);
      drawFlow(context, east, routeReveal, "#c2eff7", 4.2);

      const basinIndex = drop < 34 ? 0 : drop < 67 ? 1 : 2;
      const paths = [west, north, east] as const;
      const selectedPath = paths[basinIndex];
      const dotProgress = 0.12 + routeReveal * 0.78;
      const segmentFloat = dotProgress * (selectedPath.length - 1);
      const segment = Math.min(selectedPath.length - 2, Math.floor(segmentFloat));
      const local = segmentFloat - segment;
      const start = selectedPath[segment];
      const end = selectedPath[segment + 1];
      const dotX = start[0] + (end[0] - start[0]) * local;
      const dotY = start[1] + (end[1] - start[1]) * local;
      context.save();
      context.fillStyle = "#f7f3e8";
      context.shadowColor = "#76d7f1";
      context.shadowBlur = 18;
      context.beginPath();
      context.arc(dotX, dotY, 5.5, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const requestDraw = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };

    requestDraw();
    window.addEventListener("resize", requestDraw);
    return () => {
      window.removeEventListener("resize", requestDraw);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [progress, drop]);

  return <canvas ref={ref} className="water-canvas" aria-hidden="true" />;
}

function WaterStage({ progress, drop }: { progress: number; drop: number }) {
  const basinIndex = drop < 34 ? 0 : drop < 67 ? 1 : 2;
  const basin = BASINS[basinIndex];
  return (
    <div className="chapter-stage water-stage">
      <img
        src="/usgs-north-america-terrain.jpg"
        alt="USGS relief and rock-age map of North America"
        className="water-terrain"
        loading="lazy"
        style={{ transform: `scale(${1.08 + progress * 0.025}) translate3d(0, ${-progress * 15}px, 0)` }}
      />
      <div className="water-wash" />
      <img
        src="/og.png"
        alt=""
        className="water-mountain-texture"
        loading="lazy"
        style={{ transform: `translate3d(${-progress * 19}px, 0, 0) scale(2)` }}
      />
      <WaterCanvas progress={progress} drop={drop} />
      <div className="basin-label basin-label--pacific">Pacific</div>
      <div className="basin-label basin-label--hudson">Hudson Bay</div>
      <div className="basin-label basin-label--atlantic">Atlantic / Gulf</div>
      <div className="water-control">
        <div className="basin-answer" aria-live="polite">
          <strong>{basin.name}</strong>
          <span>{basin.note}</span>
        </div>
      </div>
      <div className="asset-credit">Terrain · USGS &nbsp; / &nbsp; flow paths · schematic</div>
    </div>
  );
}

function PeopleCanvas({ progress }: { progress: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let frame = 0;

    const draw = () => {
      const sized = sizeCanvas(canvas);
      if (!sized) return;
      const { context, width, height } = sized;
      context.clearRect(0, 0, width, height);

      const nodes = [
        [0.22, 0.4], [0.31, 0.28], [0.37, 0.52], [0.45, 0.37], [0.52, 0.23],
        [0.56, 0.48], [0.64, 0.32], [0.7, 0.52], [0.78, 0.38], [0.46, 0.66],
      ] as const;
      const routes = [
        [0, 1], [0, 2], [1, 3], [1, 4], [2, 3], [2, 9], [3, 4], [3, 5],
        [3, 9], [4, 6], [5, 6], [5, 7], [5, 9], [6, 8], [7, 8],
      ] as const;
      const networkReveal = range(progress, 0.05, 0.37);

      context.save();
      context.globalAlpha = 0.86 * networkReveal;
      context.strokeStyle = "#efb36f";
      context.lineWidth = 1.35;
      context.shadowColor = "#dc7c3e";
      context.shadowBlur = 10;
      routes.forEach(([from, to]) => {
        const start = nodes[from];
        const end = nodes[to];
        context.beginPath();
        context.moveTo(start[0] * width, start[1] * height);
        const midpointX = (start[0] + end[0]) * width * 0.5;
        const midpointY = (start[1] + end[1]) * height * 0.5 - height * 0.035;
        context.quadraticCurveTo(midpointX, midpointY, end[0] * width, end[1] * height);
        context.stroke();
      });
      nodes.forEach(([x, y], index) => {
        context.fillStyle = index % 3 === 0 ? "#f7dfaa" : "#e3904d";
        context.beginPath();
        context.arc(x * width, y * height, index % 3 === 0 ? 4.2 : 2.8, 0, Math.PI * 2);
        context.fill();
      });
      context.restore();

      const corridorReveal = range(progress, 0.38, 0.7);
      const corridors = [
        [[0.25, 0.55], [0.39, 0.64], [0.56, 0.62], [0.74, 0.57], [0.84, 0.49]],
        [[0.3, 0.31], [0.48, 0.42], [0.66, 0.45], [0.79, 0.38]],
      ] as const;
      context.save();
      context.globalAlpha = corridorReveal * 0.72;
      context.strokeStyle = "#f4e8c9";
      context.lineWidth = 2.2;
      context.setLineDash([8, 8]);
      corridors.forEach((corridor) => {
        context.beginPath();
        corridor.forEach(([x, y], index) => {
          if (index === 0) context.moveTo(x * width, y * height);
          else context.lineTo(x * width, y * height);
        });
        context.stroke();
      });
      context.restore();

      const borderReveal = range(progress, 0.68, 0.91);
      context.save();
      context.globalAlpha = borderReveal;
      context.strokeStyle = "#ff5a36";
      context.lineWidth = 3;
      context.shadowColor = "#ff3f1f";
      context.shadowBlur = 16;
      context.setLineDash([width * 0.7]);
      context.lineDashOffset = width * 0.7 * (1 - borderReveal);
      context.beginPath();
      context.moveTo(width * 0.18, height * 0.51);
      context.bezierCurveTo(width * 0.37, height * 0.5, width * 0.58, height * 0.53, width * 0.83, height * 0.49);
      context.stroke();
      context.restore();
    };

    const requestDraw = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    requestDraw();
    window.addEventListener("resize", requestDraw);
    return () => {
      window.removeEventListener("resize", requestDraw);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [progress]);

  return <canvas ref={ref} className="people-canvas" aria-hidden="true" />;
}

function PeopleStage({ progress }: { progress: number }) {
  const lightsFade = range(progress, 0.28, 0.56);
  const borderFade = range(progress, 0.7, 0.9);
  return (
    <div className="chapter-stage people-stage" aria-hidden="true">
      <div className="people-earth-glow" />
      <img
        src="/nasa-americas-night.jpg"
        alt=""
        className="night-lights"
        loading="lazy"
        style={{ opacity: 0.24 + lightsFade * 0.76, transform: `scale(${1.08 - lightsFade * 0.08})` }}
      />
      <div className="night-vignette" />
      <PeopleCanvas progress={progress} />
      <div className="network-key" style={{ opacity: 1 - range(progress, 0.55, 0.8) }}>
        <i /> schematic movement network
        <small>Schematic · not a territory map or route map</small>
      </div>
      <div className="border-key" style={{ opacity: borderFade }}>
        <i /> a political line arrives late
      </div>
      <div className="asset-credit">NASA Black Marble night lights · 2012 composite</div>
    </div>
  );
}

function SourcesDrawer() {
  return (
    <details className="sources-drawer">
      <summary>
        <span>Sources + honesty notes</span>
        <small>14 primary sources · open the field notes</small>
      </summary>
      <div className="sources-grid">
        {SOURCE_GROUPS.map((group) => (
          <section key={group.label}>
            <h3>{group.label}</h3>
            {group.keys.map((key) => (
              <a key={key} href={SOURCES[key].url} target="_blank" rel="noopener noreferrer">
                {SOURCES[key].label} <span>↗</span>
              </a>
            ))}
          </section>
        ))}
      </div>
      <div className="honesty-notes">
        <p><strong>Terrain:</strong> official USGS relief and rock-age image; labels and motion are editorial overlays.</p>
        <p><strong>Water:</strong> the three drainage directions are real; the animated mountain and paths are explanatory schematics.</p>
        <p><strong>People:</strong> movement lines are an illustrative network metaphor, not sourced route geometry or a map of every Nation or territory.</p>
        <p><strong>Night:</strong> NASA lights show electrified human activity and infrastructure—not a literal population map.</p>
      </div>
    </details>
  );
}

function ShareButton() {
  const [state, setState] = useState<"idle" | "copied">("idle");

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, text: SHARE_TEXT, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await navigator.clipboard.writeText(`${SHARE_TEXT}\n${url}`);
    setState("copied");
    window.setTimeout(() => setState("idle"), 2200);
  };

  return (
    <button type="button" className="share-button" onClick={share}>
      <span>{state === "copied" ? "Link copied" : "Share the rabbit hole"}</span>
      <i aria-hidden="true">↗</i>
    </button>
  );
}

export function Report() {
  const [landRef, landProgress] = useScrollProgress();
  const [waterRef, waterProgress] = useScrollProgress();
  const [peopleRef, peopleProgress] = useScrollProgress();
  const [drop, setDrop] = useState(76);
  const active = peopleProgress > 0.03 ? "people" : waterProgress > 0.03 ? "water" : "land";

  return (
    <main>
      <h1 className="sr-only">How did so much of northern North America become the United States and Canada?</h1>
      <StoryNav active={active} />

      <section ref={landRef} id="land" data-scene="land" className="scroll-chapter scroll-chapter--land">
        <LandStage progress={landProgress} />
        <ChapterMarker number="01" label="land" />
        <div className="chapter-rail chapter-rail--land">
          <Beat tone="clear">
            <p className="eyebrow">The actual opening question</p>
            <h2>One fire question later, we were 300 million years deep.</h2>
            <p>
              North America has many countries. This trail follows its two enormous northern states: the
              United States and Canada. Canada has a lot of forest. But those observations opened a better
              question: <em>what kind of story makes land this large—and a map this simple?</em>
            </p>
            <span className="scroll-cue">Scroll into the ground <i>↓</i></span>
          </Beat>

          <Beat>
            <p className="eyebrow">Deep time · about 300–200 million years ago</p>
            <h2>The Pangaea instinct was right. The earthquake story was not.</h2>
            <p>
              North America’s crust sat inside Pangaea. Rifting and plate motion slowly opened the Atlantic.
              <strong> Earthquakes are evidence of plate motion, not one giant hammer</strong> that cracked a
              supercontinent in a day.
            </p>
            <SourceLink source="pangaea">USGS on Pangaea ↗</SourceLink>
          </Beat>

          <Beat tone="paper">
            <p className="eyebrow">The satisfying non-answer</p>
            <h2>Earth kept assembling, colliding, stretching and wearing the continent down.</h2>
            <p>
              The Appalachians record ancient collisions. Western mountain systems came from a different,
              complicated tectonic history. The Canadian Shield exposes very old continental rock. No one
              designed the final expanse.
            </p>
            <blockquote>There may be no cleaner answer than: Earth assembled it this way.</blockquote>
            <div className="inline-sources">
              <SourceLink source="appalachians">USGS on the Appalachians ↗</SourceLink>
              <SourceLink source="tapestry">Open the terrain plate ↗</SourceLink>
            </div>
          </Beat>
        </div>
      </section>

      <section ref={waterRef} id="water" data-scene="water" className="scroll-chapter scroll-chapter--water">
        <WaterStage progress={waterProgress} drop={drop} />
        <ChapterMarker number="02" label="water" />
        <div className="chapter-rail chapter-rail--water">
          <Beat>
            <p className="eyebrow">Terrain is not background</p>
            <h2>A mountain is also a decision for water.</h2>
            <p>
              Rain does not see a border. It sees slope. Along the Continental Divide, nearby drops can end up
              in the Pacific, Atlantic/Gulf system or, near the northern Triple Divide, Hudson Bay.
            </p>
            <SourceLink source="divide">National Park Service on the divide ↗</SourceLink>
          </Beat>

          <Beat tone="paper">
            <p className="eyebrow">Try the ridge</p>
            <h2>Move one drop. Change an ocean.</h2>
            <p>The mountain is exaggerated so the choice is legible. The drainage logic is real.</p>
            <div className="rail-water-control">
              <label htmlFor="raindrop-rail">Drop position</label>
              <input
                id="raindrop-rail"
                type="range"
                min="0"
                max="100"
                value={drop}
                onChange={(event) => setDrop(Number(event.currentTarget.value))}
                aria-label="Move a raindrop across the mountain divide"
              />
              <div aria-live="polite">
                <strong>{BASINS[drop < 34 ? 0 : drop < 67 ? 1 : 2].short}</strong>
                <span>{BASINS[drop < 34 ? 0 : drop < 67 ? 1 : 2].note}</span>
              </div>
            </div>
          </Beat>

          <Beat>
            <p className="eyebrow">Even the routes can move</p>
            <h2>Ice can make water change its mind.</h2>
            <p>
              Ice sheets dammed, carved and redirected parts of North America’s drainage. The Great Lakes and
              river systems we inherit are not eternal plumbing; they are chapters in a moving landscape.
            </p>
            <SourceLink source="changingContinent">USGS on a changing continent ↗</SourceLink>
          </Beat>

          <Beat tone="clear">
            <div className="fire-cameo">
              <span className="fire-mark" aria-hidden="true">✦</span>
              <div>
                <p className="eyebrow">The fire cameo</p>
                <h2>Fire changes landscapes. It does not explain the two-country map.</h2>
                <p>
                  Lightning, climate and people all shape fire. Indigenous communities have long used
                  intentional burning to care for particular landscapes. Important story—different question.
                </p>
                <SourceLink source="indigenousFire">NPS on Indigenous fire practices ↗</SourceLink>
              </div>
            </div>
          </Beat>
        </div>
      </section>

      <section ref={peopleRef} id="people" data-scene="people" className="scroll-chapter scroll-chapter--people">
        <PeopleStage progress={peopleProgress} />
        <ChapterMarker number="03" label="people" />
        <div className="chapter-rail chapter-rail--people">
          <Beat>
            <p className="eyebrow">Before the two-country map</p>
            <h2>Low population density did not mean vacant land.</h2>
            <p>
              Hundreds of distinct Indigenous Nations made—and still make—homelands here. Cities, villages,
              farms, seasonal routes, diplomacy, trade and stewardship varied radically by place. This was
              never one people loosely wandering one empty expanse.
            </p>
            <div className="inline-sources">
              <SourceLink source="indigenousNations">Smithsonian NMAI ↗</SourceLink>
              <SourceLink source="traders">NPS on traders + travelers ↗</SourceLink>
            </div>
          </Beat>

          <Beat tone="paper">
            <p className="eyebrow">The lines arrive last</p>
            <h2>Two states became huge through accumulation—not geographical destiny.</h2>
            <p>
              Purchases, wars, treaties, federation and imperial transfers hardened claims over time. Those
              state-to-state transactions did not erase the peoples already living there.
            </p>
            <div className="power-rule" aria-label="Claim ≠ control ≠ consent">
              <span>Claim</span><i>≠</i><span>control</span><i>≠</i><span>consent</span>
            </div>
            <div className="border-ledger">
              {BORDER_MOMENTS.map((moment) => (
                <article key={moment.year}>
                  <time>{moment.year}</time>
                  <div><strong>{moment.title}</strong><span>{moment.text}</span></div>
                </article>
              ))}
            </div>
            <div className="inline-sources">
              <SourceLink source="usMilestones">U.S. milestones ↗</SourceLink>
              <SourceLink source="canadaBoundaries">Canada’s boundaries ↗</SourceLink>
              <SourceLink source="canadaTreaties">Treaty record ↗</SourceLink>
            </div>
          </Beat>

          <Beat>
            <p className="eyebrow">The modern pattern</p>
            <h2>People cluster along routes, coasts, lakes and milder edges.</h2>
            <p>
              The night map makes today’s concentration visible: bright corridors around southern Canada,
              the Great Lakes, the U.S. coasts and major metros. But <strong>Darkness is not emptiness</strong>.
              Night lights are a proxy for electrified activity, not a census and not a measure of belonging.
            </p>
            <div className="inline-sources">
              <SourceLink source="nightLights">NASA night lights ↗</SourceLink>
              <SourceLink source="usDensity">U.S. Census ↗</SourceLink>
              <SourceLink source="canadaDensity">Statistics Canada ↗</SourceLink>
            </div>
          </Beat>

          <Beat tone="clear">
            <div className="final-answer">
              <p className="eyebrow">So, why is North America like this?</p>
              <h2>
                Rock made the landmass.<br />
                Water shaped the routes.<br />
                Indigenous Nations made homelands.<br />
                Colonial power made the two-state map.
              </h2>
              <p>
                That is not one neat cause. It is three clocks stacked on the same terrain—and the political
                clock is by far the youngest.
              </p>
              <div className="future-questions">
                <article>
                  <span>Deep time</span>
                  <h3>Could the land split again?</h3>
                  <p>Yes, tectonic plates keep moving. But exact continents millions of years ahead are projections, not facts.</p>
                </article>
                <article>
                  <span>Human time</span>
                  <h3>Could the countries split?</h3>
                  <p>Political maps can change much faster than geology. Nothing in the rock requires these borders to last.</p>
                </article>
              </div>
              <SourcesDrawer />
              <ShareButton />
              <footer>
                <span>Built as a curiosity trail, not a textbook.</span>
                <span>Facts checked {REPORT_AS_OF}</span>
              </footer>
            </div>
          </Beat>
        </div>
      </section>
    </main>
  );
}
