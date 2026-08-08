import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import type { Animal } from "~/utils/types";
import "./InteractiveMap.css";

type MapCategory = "mammals" | "birds" | "reptiles" | "marine";

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
  mammals: "Mammals",
  birds: "Birds",
  reptiles: "Reptiles",
  marine: "Marine",
};

const DEFAULT_FILTERS: MapCategory[] = ["mammals", "birds", "reptiles", "marine"];

const ID_POSITIONS: Record<string, MarkerPoint> = {
  "orinoco-crocodile-001": { x: 30, y: 58 },
  "venezuelan-harlequin-frog-001": { x: 32, y: 55 },
  "spectacled-bear-001": { x: 28, y: 60 },
  "venezuelan-troupial-001": { x: 33, y: 54 },
};

function mapCategory(group: Animal["taxonomicGroup"]): MapCategory {
  if (group === "mammal") return "mammals";
  if (group === "bird") return "birds";
  if (group === "reptile") return "reptiles";
  return "marine";
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
  if (category === "reptiles") return "🐍";
  return "🐟";
}

export function InteractiveMap({ animals }: InteractiveMapProps) {
  const [activeFilters, setActiveFilters] = useState<Set<MapCategory>>(
    new Set(DEFAULT_FILTERS)
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

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

  const counts = useMemo(() => {
    return markers.reduce(
      (acc, marker) => {
        acc[marker.category] += 1;
        return acc;
      },
      {
        mammals: 0,
        birds: 0,
        reptiles: 0,
        marine: 0,
      } as Record<MapCategory, number>
    );
  }, [markers]);

  const visibleMarkers = useMemo(
    () => markers.filter((marker) => activeFilters.has(marker.category)),
    [markers, activeFilters]
  );

  const selectedMarker = useMemo(() => {
    if (!visibleMarkers.length) return null;
    if (selectedId) {
      const found = visibleMarkers.find((item) => item.animal.id === selectedId);
      if (found) return found;
    }
    return visibleMarkers[0];
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
    setZoom((value) => Math.max(1, Number((value - 0.1).toFixed(2))));
  }

  return (
    <section className="imap-screen">
      <header className="imap-topbar">
        <Link to="/" className="imap-back-btn" aria-label="Back to home">
          ←
        </Link>
        <h1 className="imap-title">World Wildlife Map</h1>
        <p className="imap-total">Total species: {animals.length.toLocaleString()}</p>
      </header>

      <div className="imap-stage">
    

        <div className="imap-map" style={{ transform: "scale(" + zoom + ")" }}>
          <div className="imap-map-oval">
            <img className="imap-map-image" src="/world-map.png" alt="World map" />
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
                    style={{ left: marker.position.x + "%", top: marker.position.y + "%" }}
                    onClick={() => setSelectedId(marker.animal.id)}
                    aria-label={"Select " + marker.animal.commonName}
                  >
                    <span aria-hidden="true">{markerIcon(marker.category)}</span>
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

        <div className="imap-zoom-controls">
          <button type="button" onClick={zoomIn} aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={zoomOut} aria-label="Zoom out">
            −
          </button>
        </div>
      </div>
    </section>
  );
}
