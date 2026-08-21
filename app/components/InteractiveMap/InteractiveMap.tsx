import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import type { Animal } from "~/utils/types";
import "./InteractiveMap.css";

// Figma back button arrow icon (default state)
const ARROW_ICON_DEFAULT = "https://www.figma.com/api/mcp/asset/648dddff-2472-4d23-9b97-50f302d71e7e.svg";
// Figma back button arrow icon (hover state)  
const ARROW_ICON_HOVER = "https://www.figma.com/api/mcp/asset/3360e184-8e39-4f1a-8542-4b46a03cdecd.svg";
// Figma back button arrow icon (on-click state)
const ARROW_ICON_ACTIVE = "https://www.figma.com/api/mcp/asset/6ae8ede4-e473-4712-83ec-241033bc82a8.svg";

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

const DISPLAY_COUNTS: Record<MapCategory, number> = {
  fish: 135,
  reptiles: 60,
  amphibians: 18,
  birds: 7,
  mammals: 5,
  invertebrates: 25,
};

const DEFAULT_FILTERS: MapCategory[] = Object.keys(CATEGORY_LABELS) as MapCategory[];

const ID_POSITIONS: Record<string, MarkerPoint> = {
  "orinoco-crocodile-001": { x: 26, y: 63 },        // Orinoco basin, Colombia/Venezuela border
  "venezuelan-harlequin-frog-001": { x: 31, y: 49 }, // Coastal Cordillera, northern Venezuela
  "spectacled-bear-001": { x: 22, y: 68 },           // Andes, Peru/Colombia range
  "venezuelan-troupial-001": { x: 35, y: 56 },       // Llanos, eastern Venezuela/Trinidad
};

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

  if (region.includes("andes")) return { x: 28, y: 60 };
  if (region.includes("coastal")) return { x: 32, y: 55 };
  if (region.includes("orinoco") || region.includes("venezuela")) return { x: 31, y: 57 };

  return { x: 50, y: 50 };
}

function markerIcon(category: MapCategory): string {
  if (category === "mammals") return "🐾";
  if (category === "birds") return "🪶";
  if (category === "reptiles") return "🦎";
  if (category === "amphibians") return "🐸";
  if (category === "invertebrates") return "🪲";
  return "🐟";
}

export function InteractiveMap({ animals }: InteractiveMapProps) {
  const [activeFilters, setActiveFilters] = useState<Set<MapCategory>>(
    new Set(DEFAULT_FILTERS)
  );
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

  const counts = useMemo<Record<MapCategory, number>>(() => ({ ...DISPLAY_COUNTS }), []);

  const visibleMarkers = useMemo(
    () => markers.filter((marker) => activeFilters.has(marker.category)),
    [markers, activeFilters]
  );

  const selectedMarker = useMemo(() => {
    if (!visibleMarkers.length || !selectedId) return null;
    return visibleMarkers.find((item) => item.animal.id === selectedId) ?? null;
  }, [selectedId, visibleMarkers]);

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
    if (zoom <= 1) return;
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
  const contentW = imageRef.current.clientWidth;
  const contentH = imageRef.current.clientHeight;

  const scaledW = contentW * zoom;
  const scaledH = contentH * zoom;

  // X axis clamp: if content narrower than viewport, center it
  let minX: number, maxX: number;
  if (scaledW <= vw) {
    const centerX = (vw - scaledW) / 2;
    minX = maxX = centerX;
  } else {
    minX = vw - scaledW; // negative
    maxX = 0;
  }

  // Y axis clamp: if content shorter than viewport, center it
  let minY: number, maxY: number;
  if (scaledH <= vh) {
    const centerY = (vh - scaledH) / 2;
    minY = maxY = centerY;
  } else {
    minY = vh - scaledH;
    maxY = 0;
  }

  const clampedX = Math.max(minX, Math.min(maxX, nextX));
  const clampedY = Math.max(minY, Math.min(maxY, nextY));

  setPan({ x: clampedX, y: clampedY });
}

function handlePointerUp() {
  drag.current.active = false;
}

return (
  <section className="imap-screen">
    <header className="imap-topbar">
      <Link to="/" className="imap-back-btn" aria-label="Back to home">
        <img src={ARROW_ICON_DEFAULT} alt="" className="imap-back-btn-icon" />
      </Link>
      <h1 className="imap-title">World Wildlife Map</h1>
      <p className="imap-total">Total species: 250</p>
    </header>

    <div className="imap-stage">   {/* ← restore this, remove the comment */}

      <div
        className={zoom > 1 ? "imap-map-pan imap-map-pan-active" : "imap-map-pan"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >

        {/* imap-map} */} 
        
        <div className="imap-map">
          <div className="imap-map-oval" ref={ovalRef}>
            <div
              className="imap-map-inner"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "top left" }}
            >
              <img ref={imageRef} className="imap-map-image" src="/world-map.svg" alt="World map" />
              <div className="imap-map-marker-layer">
                {visibleMarkers.map((marker, index) => {
                  const id = marker.animal.id.trim();
                  const key = id || marker.animal.commonName + "-" + index;
                  
                  const selected = selectedMarker?.animal.id === marker.animal.id;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={selected ? "imap-marker imap-marker-selected" : "imap-marker"}
                      style={{
                        left: marker.position.x + "%",
                        top: marker.position.y + "%",
                        transform: `translate(-50%, -50%)`,
                        transformOrigin: "center",
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => setSelectedId(marker.animal.id)}
                      aria-label={"Select " + marker.animal.commonName}
                    >
                      <span
                        className="imap-marker-visual"
                        aria-hidden="true"
                        style={{ transform: `scale(${1 / zoom})`, transformOrigin: "center" }}
                      >
                        {markerIcon(marker.category)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedMarker &&
                (selectedMarker.animal.id.trim() ? (
                  <Link
                    className="imap-selected-tag"
                    to={"/map/" + selectedMarker.animal.id}
                    style={{
                      left: selectedMarker.position.x + "%",
                      top: selectedMarker.position.y + "%",
                    }}
                  >
                    {selectedMarker.animal.commonName.toUpperCase()}
                  </Link>
                ) : (
                  <span
                    className="imap-selected-tag"
                    style={{
                      left: selectedMarker.position.x + "%",
                      top: selectedMarker.position.y + "%",
                    }}
                  >
                    {selectedMarker.animal.commonName.toUpperCase()}
                  </span>
                ))}
            </div>
          </div>

          <aside className="imap-categories">
            <h2 className="imap-panel-title">Categories</h2>
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
                          {markerIcon(category)}
                        </span>
                        {CATEGORY_LABELS[category]}
                      </span>
                      <span className="imap-category-count">{counts[category]}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="imap-panel-note">Toggle icons to filter map view</p>
          </aside>

        </div>   {/* ← the imap-map closing div */}
      </div>   {/* ← close imap-map-pan HERE, before categories */}

      <div className="imap-zoom-controls">  {/* ← outside pan wrapper */}
        <button type="button" onClick={zoomIn}>+</button>
        <button type="button" onClick={zoomOut}>−</button>
      </div>

    </div>   {/* ← close imap-stage */}
  </section>
  );
}
