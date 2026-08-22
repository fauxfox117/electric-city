import { useEffect, useState } from "react";
import { data, Link } from "react-router";
import { getAnimalById } from "~/utils/api";
import type { Route } from "./+types/animal";
import "./animal.css";

const ARROW_ICON = "/round-arrow-back.png";
const CLOSE_ICON = "/close-btn.png";
const TAXONOMIC_ICONS: Record<string, string> = {
  fish: "/images/fish-active.png",
  reptile: "/images/reptile-active.png",
  amphibian: "/images/amphibian-active.png",
  mammal: "/images/mammal-active.png",
  bird: "/images/bird-active.png",
  invertebrate: "/images/invertebrate-active.png",
};

type AnimalDetailOptionalFields = {
  description?: string;
  weight?: string;
  length?: string;
  lifespan?: string;
  diet?: string;
};

export async function loader({ params }: Route.LoaderArgs) {
  const animal = getAnimalById(params.id);
  if (!animal) {
    throw data("Animal not found", { status: 404 });
  }
  return { animal };
}

function truncate(text: string, max = 260) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

function normalizePhotoUrl(raw?: string) {
  if (!raw || !raw.trim()) return "/Missing-Data.svg";
  if (/^https?:\/\//i.test(raw)) return raw;
  const normalized = raw.trim().replace(/^\.?\//, "");
  return `/${normalized}`;
}

function normalizeIconUrl(raw?: string) {
  if (!raw || !raw.trim()) return "/Least-Concern.svg";
  if (/^https?:\/\//i.test(raw)) return raw;
  const normalized = raw.trim().replace(/^\.?\//, "");
  return `/${normalized}`;
}

const CONSERVATION_STATUS_ICONS: Record<string, string> = {
  "least concern": "/Least-Concern.svg",
  "near threatened": "/Near-Threatened.svg",
  "vulnerable": "/Vulnerable.svg",
  "endangered": "/Endangered.svg",
  "critically endangered": "/Critically-Endangered.svg",
  "extinct in the wild": "/Extinct-in-the-Wild.svg",
  extinct: "/Extinct.svg",
};

export default function AnimalDetail({ loaderData }: Route.ComponentProps) {
  const animal = loaderData.animal as typeof loaderData.animal & AnimalDetailOptionalFields;
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [activeMedia, setActiveMedia] = useState<"video" | "photo" | "audio">("video");

  const description = animal.description ?? animal.habitatDescription ?? "";
  const photoSource = normalizePhotoUrl(animal.photoUrl);
  const statusKey = animal.conservationStatus?.toLowerCase() ?? "least concern";
  const resolvedStatusIcon = CONSERVATION_STATUS_ICONS[statusKey] ?? animal.conservationStatusIcon ?? "/Least-Concern.svg";
  const statusIconSource = normalizeIconUrl(resolvedStatusIcon);
  const statusText = animal.conservationStatus.toUpperCase();
  const taxonomicLabel = animal.taxonomicGroup.toUpperCase();
  const keyThreats = (animal.threats ?? []).slice(0, 4);
  const photoAvailable = Boolean(animal.photoUrl?.trim());

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

  function expandableText(section: string, text: string, className: string) {
    const expanded = expandedSections.has(section);
    const canExpand = text.length > 180;

    return (
      <>
        <div className={`${className}${expanded ? " is-expanded" : ""}`}>{text}</div>
        {canExpand && (
          <button
            type="button"
            className="read-more-btn"
            onClick={() => setExpandedSections((previous) => {
              const next = new Set(previous);
              if (next.has(section)) next.delete(section);
              else next.add(section);
              return next;
            })}
          >
            {expanded ? "READ LESS" : "READ MORE"}
          </button>
        )}
      </>
    );
  }

  return (
    <main className="animal-screen">
      <header className="animal-topbar">
        <Link to="/map" className="animal-back-btn" aria-label="Back to map">
          <img src={ARROW_ICON} alt="" className="animal-back-btn-icon" />
        </Link>
        <h1 className="animal-title">{animal.commonName.toUpperCase()}</h1>
        <Link to="/map" className="animal-close-btn" aria-label="Close animal details">
          <img src={CLOSE_ICON} alt="" />
        </Link>
      </header>

      <section className="animal-layout">
        <aside className="animal-media-column">
          <div className="animal-hero-media">
            {photoAvailable ? (
              <img className="animal-photo" src={photoSource} alt={animal.commonName} />
            ) : (
              <div className="animal-empty-state">
                <img src="/Missing-Data.svg" alt="" />
                <div>
                  <strong>No Photo Available</strong>
                  <p>We’re currently updating this animal’s image.</p>
                  <p>Please explore another species.</p>
                </div>
              </div>
            )}
          </div>

          <div className="animal-media-controls" role="tablist" aria-label="Media type">
            <button
              type="button"
              className={`media-btn ${activeMedia === "video" ? "media-btn--active" : ""}`}
              onClick={() => setActiveMedia("video")}
            >
              Video
            </button>
            <button
              type="button"
              className={`media-btn ${activeMedia === "photo" ? "media-btn--active" : ""}`}
              onClick={() => setActiveMedia("photo")}
            >
              Photo
            </button>
            <button
              type="button"
              className={`media-btn ${activeMedia === "audio" ? "media-btn--active" : ""}`}
              onClick={() => setActiveMedia("audio")}
            >
              Audio
            </button>
          </div>
        </aside>

        <div className="animal-detail-panel">
          <div className="animal-data-card">
            <div className="content">
              <div className="div-2">
                <div className="section-name">
                  <div className="text-wrapper-4">SCIENTIFIC NAME / CONSERVATION STATUS</div>
                </div>
                <div className="section-content">
                  <div className="species-name">
                    <div className="animal-common-name">{animal.commonName}</div>
                    <div className="animal-scientific">
                      {animal.scientificName ?? "Unknown scientific name"}
                    </div>
                  </div>
                  <div className="species-conservation">
                    <div className="iucn-status-row">
                      {[
                        ["EX", "extinct"], ["EW", "extinct in the wild"], ["CR", "critically endangered"],
                        ["EN", "endangered"], ["VU", "vulnerable"], ["NT", "near threatened"], ["LC", "least concern"],
                      ].map(([code, key]) => (
                        <span key={code} className={`status-pill status-pill--${key.replaceAll(" ", "-")} ${key === statusKey ? "status-pill--selected" : ""}`}>
                          {code}
                        </span>
                      ))}
                      <span className="status-caption">{statusText}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="div-2">
                <div className="section-name">
                  <div className="text-wrapper-4">NATIVE HABITAT / TAXONOMIC CATEGORY</div>
                </div>
                <div className="section-content-2">
                  <div className="habitat">
                    <div className="country-territory">{animal.nativeRegion ?? "Unknown region"}</div>
                    <div className="specific-region-of">
                      {expandableText("habitat", animal.habitatDescription ?? "No habitat description available", "habitat-copy")}
                    </div>
                  </div>
                  <div className="taxonomic-badge" aria-label={taxonomicLabel}>
                    <img src={TAXONOMIC_ICONS[animal.taxonomicGroup]} alt="" />
                    <span>{taxonomicLabel}</span>
                  </div>
                </div>
              </div>

              {description && (
                <div className="div-3">
                  <div className="section-name">
                    <div className="text-wrapper-4">DESCRIPTION</div>
                  </div>
                  <div className="fun-fact-card">
                    <div className="fun-fact-container">
                      {expandableText("description", description, "add-fun-fact-here")}
                    </div>
                  </div>
                </div>
              )}

              {animal.funFact && (
                <div className="div-3">
                  <div className="section-name">
                    <div className="text-wrapper-4">FUN FACT</div>
                  </div>
                  <div className="fun-fact-card">
                    <div className="fun-fact-container">
                      {expandableText("funFact", animal.funFact, "add-fun-fact-here")}
                    </div>
                  </div>
                </div>
              )}

              {keyThreats.length > 0 && (
                <div className="div-3 threats-panel">
                  <div className="section-name">
                    <div className="text-wrapper-5">KEY THREATS</div>
                  </div>
                  <div className="threats-grid">
                    {keyThreats.map((threat) => (
                      <div key={threat} className="bullet">
                        <span className="threat-dot" aria-hidden="true" />
                        <div className="bullet-point">{threat}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="div-3">
                <div className="section-name">
                  <div className="text-wrapper-4">QUICK STATS</div>
                </div>
                <div className="quick-stats">
                  <div className="stat-card">
                    <img className="icon" alt="Weight icon" src="/weight.svg" />
                    <div className="card-content">
                      <div className="div-wrapper-2">
                        <div className="text-wrapper-6">WEIGHT</div>
                      </div>
                      <div className="div-wrapper-2">
                        <div className="text-wrapper-7">{animal.weight ?? "Unknown"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card-2">
                    <img className="img" alt="Length icon" src="/length.svg" />
                    <div className="card-content">
                      <div className="div-wrapper-2">
                        <div className="text-wrapper-6">LENGTH</div>
                      </div>
                      <div className="div-wrapper-2">
                        <div className="text-wrapper-7">{animal.length ?? "Unknown"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card-3">
                    <img className="icon-2" alt="Lifespan icon" src="/lifespan.svg" />
                    <div className="card-content">
                      <div className="div-wrapper-2">
                        <div className="text-wrapper-6">LIFESPAN</div>
                      </div>
                      <div className="div-wrapper-2">
                        <div className="number-of-years">{animal.lifespan ?? "Unknown"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card-4">
                    <img className="icon-3" alt="Diet icon" src="/Icon.svg" />
                    <div className="card-content">
                      <div className="div-wrapper-2">
                        <div className="text-wrapper-6">DIET</div>
                      </div>
                      <div className="div-wrapper-2">
                        <div className="text-wrapper-7">{animal.diet ?? "Unknown"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}