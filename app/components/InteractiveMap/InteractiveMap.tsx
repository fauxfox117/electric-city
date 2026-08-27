import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useIdleRedirect } from "~/hooks/useIdleRedirect";
import type { Animal } from "~/utils/types";
import { withBase } from "~/utils/publicPath";
import "./InteractiveMap.css";

const ARROW_ICON_DEFAULT = withBase("/round-arrow-back.png");
const CATEGORY_ICONS: Record<MapCategory, string> = {
  fish: withBase("/images/fish.png"),
  reptiles: withBase("/images/reptiles.png"),
  amphibians: withBase("/images/amphibians.png"),
  birds: withBase("/images/birds.png"),
  mammals: withBase("/images/mammals.png"),
  invertebrates: withBase("/images/invertebrates.png"),
};
const CATEGORY_ACTIVE_ICONS: Record<MapCategory, string> = {
  fish: withBase("/images/fish.png"),
  reptiles: withBase("/images/reptiles.png"),
  amphibians: withBase("/images/amphibians.png"),
  birds: withBase("/images/birds.png"),
  mammals: withBase("/images/mammals.png"),
  invertebrates: withBase("/images/invertebrates.png"),
};
const PLUS_ICON = withBase("/plus-icon.svg");
const MINUS_ICON = withBase("/minus-icon.svg");

type MapCategory =
  | "fish"
  | "reptiles"
  | "amphibians"
  | "birds"
  | "mammals"
  | "invertebrates";

type MarkerPoint = {
  x: number;
  y: number;
};

type AnimalMarker = {
  animal: Animal;
  category: MapCategory;
  position: MarkerPoint;
};

type InteractiveMapProps = {
  animals: Animal[];
};

const CATEGORY_LABELS: Record<MapCategory, string> = {
  fish: "Fish",
  reptiles: "Reptiles",
  amphibians: "Amphibians",
  birds: "Birds",
  mammals: "Mammals",
  invertebrates: "Invertebrates",
};

const DEFAULT_FILTERS: MapCategory[] = Object.keys(CATEGORY_LABELS) as MapCategory[];

const ID_POSITIONS: Record<string, MarkerPoint> = {
  "Cardinal-Tetra-001": { x: 31, y: 68   },             // Orinoco River, Venezuela
  "orinoco-crocodile-001": { x: 31, y: 56 },          // Orinoco basin, Venezuela and Colombia
  "venezuelan-harlequin-frog-001": { x: 33, y: 75  },  // Coastal Cordillera, Venezuela
  "spectacled-bear-001": { x: 34, y: 63 },            // Andes Mountains, Venezuela
  "venezuelan-troupial-001": { x: 28, y: 63 },        // Llanos, Venezuela
  "cheetah-001": { x: 55, y: 56 },                    // Sub-Saharan Africa
  "red-panda-001": { x: 76, y: 48 },                  // Himalayas and southwestern China
  "zebra-shark-001": { x: 82, y: 57 },                // Indo-Pacific, northern Australia
  "pancake-tortoise-001": { x: 61, y: 76 },  // Madagascar
  "hyacinth-macaw-001": { x: 37, y: 72 }  // South America, Pantanal, Brazil
};

const REGION_POSITIONS: Array<{ keywords: string[]; position: MarkerPoint }> = [
  { keywords: ["greenland", "arctic", "north pole"], position: { x: 34, y: 18 } },
  { keywords: ["alaska", "canada", "north america", "united states", "usa"], position: { x: 22, y: 36 } },
  { keywords: ["mexico", "central america", "caribbean", "cuba", "bahamas"], position: { x: 28, y: 50 } },
  { keywords: ["south america", "amazon", "brazil", "colombia", "venezuela", "ecuador", "peru", "bolivia", "andes", "orinoco", "llanos"], position: { x: 31, y: 62 } },
  { keywords: ["europe", "united kingdom", "uk", "ireland", "france", "germany", "italy", "spain", "scandinavia", "mediterranean"], position: { x: 48, y: 34 } },
  { keywords: ["north africa", "sahara", "morocco", "algeria", "egypt", "libya", "tunisia"], position: { x: 53, y: 43 } },
  { keywords: ["sub-saharan africa", "central africa", "east africa", "west africa", "south africa", "africa", "kenya", "tanzania", "nigeria", "congo", "madagascar"], position: { x: 55, y: 57 } },
  { keywords: ["middle east", "arabia", "iran", "iraq", "israel", "jordan", "turkey"], position: { x: 61, y: 41 } },
  { keywords: ["india", "indian subcontinent", "himalaya", "nepal", "bhutan", "bangladesh", "pakistan"], position: { x: 70, y: 47 } },
  { keywords: ["china", "east asia", "japan", "korea", "mongolia", "tibet"], position: { x: 78, y: 41 } },
  { keywords: ["southeast asia", "indonesia", "philippines", "malaysia", "thailand", "vietnam", "cambodia", "borneo"], position: { x: 79, y: 54 } },
  { keywords: ["indo-pacific", "indian ocean", "pacific ocean", "coral triangle", "red sea"], position: { x: 82, y: 56 } },
  { keywords: ["australia", "new zealand", "oceania", "melanesia", "micronesia", "polynesia"], position: { x: 85, y: 68 } },
  { keywords: ["antarctica", "antarctic"], position: { x: 55, y: 94 } },
];

function mapCategory(group: Animal["taxonomicGroup"]): MapCategory {
  if (group === "fish") return "fish";
  if (group === "mammal") return "mammals";
  if (group === "bird") return "birds";
  if (group === "reptile") return "reptiles";
  if (group === "amphibian") return "amphibians";
  return "invertebrates";
}

function fallbackPosition(nativeRegion: string): MarkerPoint {
  const region = nativeRegion.toLowerCase();

  const matchingRegion = REGION_POSITIONS.find(({ keywords }) =>
    keywords.some((keyword) => region.includes(keyword))
  );

  if (matchingRegion) return matchingRegion.position;

  return { x: 50, y: 50 };
}

function markerIcon(category: MapCategory): string {
  return CATEGORY_ICONS[category];
}

export function InteractiveMap({ animals }: InteractiveMapProps) {

  useIdleRedirect(120000);

  const [searchParams] = useSearchParams();

  const [activeFilters, setActiveFilters] = useState<Set<MapCategory>>(() => {
    const categoryParam = searchParams.get("category") as MapCategory | null;
    if (categoryParam && DEFAULT_FILTERS.includes(categoryParam)) {
      return new Set([categoryParam]);
    }
    return new Set(DEFAULT_FILTERS);
  });

  useEffect(() => {
    const categoryParam = searchParams.get("category") as MapCategory | null;
    if (categoryParam && DEFAULT_FILTERS.includes(categoryParam)) {
      setActiveFilters(new Set([categoryParam]));
    }
  }, [searchParams]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef({ active: false, startX: 0, startY: 0, fromX: 0, fromY: 0 });

  const ovalRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  const markers = useMemo<AnimalMarker[]>(() => {
    return animals.map((animal) => {
      const id = animal.id.trim();
      return {
        animal,
        category: mapCategory(animal.taxonomicGroup),
        position: id && ID_POSITIONS[id] ? ID_POSITIONS[id] : fallbackPosition(animal.nativeRegion),
      };
    });
  }, [animals]);

  const counts = useMemo<Record<MapCategory, number>>(() => {
    const categoryCounts = Object.fromEntries(
      DEFAULT_FILTERS.map((category) => [category, 0])
    ) as Record<MapCategory, number>;

    for (const marker of markers) {
      categoryCounts[marker.category] += 1;
    }

    return categoryCounts;
  }, [markers]);

  const visibleMarkers = useMemo(
    () => markers.filter((marker) => activeFilters.has(marker.category)),
    [markers, activeFilters]
  );

  function toggleFilter(category: MapCategory) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function zoomIn() {
    setZoom((value) => Math.min(2, Number((value + 0.1).toFixed(2))));
  }

  function zoomOut() {
    setZoom((value) => {
      const next = Math.max(1, Number((value - 0.1).toFixed(2)));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (zoom <= 1 || (e.target instanceof Element && e.target.closest("button, a"))) return;
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, fromX: pan.x, fromY: pan.y };
    e.currentTarget.setPointerCapture(e.pointerId);
}

function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
  if (!drag.current.active) return;

  const nextX = drag.current.fromX + (e.clientX - drag.current.startX);
  const nextY = drag.current.fromY + (e.clientY - drag.current.startY);

  if (!ovalRef.current || !imageRef.current) {
    setPan({ x: 0, y: 0 });
    return;
  }

  const vw = ovalRef.current.clientWidth;
  const vh = ovalRef.current.clientHeight;
  const contentW = vw;
  const contentH = vh;

  const scaledW = contentW * zoom;
  const scaledH = contentH * zoom;

  const minX = scaledW <= vw ? (vw - scaledW) / 2 : vw - scaledW;
  const maxX = scaledW <= vw ? minX : 0;
  const minY = scaledH <= vh ? (vh - scaledH) / 2 : vh - scaledH;
  const maxY = scaledH <= vh ? minY : 0;

  const clampedX = Math.max(minX, Math.min(maxX, nextX));
  const clampedY = Math.max(minY, Math.min(maxY, nextY));

  setPan({ x: clampedX, y: clampedY });
}

function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
  drag.current.active = false;
  if (e.currentTarget.hasPointerCapture(e.pointerId)) {
    e.currentTarget.releasePointerCapture(e.pointerId);
  }
}

return (
  <section className="imap-screen">
    <header className="imap-topbar">
      <Link to="/" className="imap-back-btn" aria-label="Back to home">
        <img src={ARROW_ICON_DEFAULT} alt="" className="imap-back-btn-icon" />
      </Link>
      <h1 className="imap-title">World Wildlife Map</h1>
      <p className="imap-total">Total species: {animals.length}</p>
    </header>

    <div className="imap-stage">   {/* ← restore this, remove the comment */}

      <div
        className={zoom > 1 ? "imap-map-pan imap-map-pan-active" : "imap-map-pan"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >

        {/* imap-map} */} 
        
        <div className="imap-map">
          <div className="imap-map-oval" ref={ovalRef}>
            <div
              className="imap-map-inner"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "top left" }}
            >
              <img ref={imageRef} className="imap-map-image" src={withBase("/world-map.png")} alt="World map" />
              <div className="imap-map-marker-layer">
                {visibleMarkers.map((marker, index) => {
                  const id = marker.animal.id.trim();
                  const key = id || marker.animal.commonName + "-" + index;
                  
                  const selected = selectedId === marker.animal.id;
                  return (
                    <Link
                      key={key}
                      to={id ? "/map/" + id : "/map"}
                      className={`${selected ? "imap-marker imap-marker-selected" : "imap-marker"}${zoom >= 1.5 ? " imap-marker-named" : ""}`}
                      style={{
                        left: marker.position.x + "%",
                        top: marker.position.y + "%",
                        transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                        transformOrigin: "center",
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => setSelectedId(marker.animal.id)}
                      aria-label={"Select " + marker.animal.commonName}
                    >
                      <span
                        className="imap-marker-visual"
                        aria-hidden="true"
                      >
                        <img src={markerIcon(marker.category)} alt="" />
                      </span>
                      <span className="imap-marker-name">{marker.animal.commonName}</span>
                    </Link>
                  );
                })}
              </div>

            </div>
          </div>

          <aside className="imap-categories" onPointerDown={(e) => e.stopPropagation()}>
            <h2 className="imap-panel-title">Categories</h2>
            <p className="imap-panel-note">Toggle icons to filter map view</p>

            <ul className="imap-category-list">
              {(Object.keys(CATEGORY_LABELS) as MapCategory[]).map((category) => {
                const active = activeFilters.has(category);
                return (
                  <li key={category}>
                    <button
                      type="button"
                      className={active ? "imap-category-btn imap-category-btn-active" : "imap-category-btn"}
                      onClick={() => toggleFilter(category)}
                      aria-pressed={active}
                    >
                      <span className="imap-category-label">
                        <span className="imap-category-icon" aria-hidden="true">
                          <img src={active ? CATEGORY_ACTIVE_ICONS[category] : markerIcon(category)} alt="" />
                        </span>
                        {CATEGORY_LABELS[category]}
                      </span>
                      <span className="imap-category-count">{counts[category]}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

        </div>   {/* ← the imap-map closing div */}
      </div>   {/* ← close imap-map-pan HERE, before categories */}

      <div className="imap-zoom-controls">
        <button type="button" onClick={zoomIn} aria-label="Zoom in">
          <img src={PLUS_ICON} alt="" />
        </button>
        <button type="button" onClick={zoomOut} aria-label="Zoom out">
          <img src={MINUS_ICON} alt="" />
        </button>
      </div>

    </div>   {/* ← close imap-stage */}
  </section>
  );
}
