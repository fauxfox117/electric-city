import { useState } from "react";
import { data, Link } from "react-router";
import { useIdleRedirect } from "~/hooks/useIdleRedirect";
import { getAnimalById } from "~/utils/api";
import type { Route } from "./+types/animal";
import "./animal.css";

// Figma back button arrow icon (default state)
const ARROW_ICON_DEFAULT = "https://www.figma.com/api/mcp/asset/648dddff-2472-4d23-9b97-50f302d71e7e.svg";
// Figma back button arrow icon (hover state)
const ARROW_ICON_HOVER = "https://www.figma.com/api/mcp/asset/3360e184-8e39-4f1a-8542-4b46a03cdecd.svg";
// Figma back button arrow icon (on-click state)
const ARROW_ICON_ACTIVE = "https://www.figma.com/api/mcp/asset/6ae8ede4-e473-4712-83ec-241033bc82a8.svg";

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

  useIdleRedirect(120000);

  const animal = loaderData.animal as typeof loaderData.animal & AnimalDetailOptionalFields;
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMedia, setActiveMedia] = useState<"video" | "photo" | "audio">("video");

  const description = animal.description ?? animal.habitatDescription ?? "";
  const shownDescription = isExpanded ? description : truncate(description);
  const photoSource = normalizePhotoUrl(animal.photoUrl);
  const statusKey = animal.conservationStatus?.toLowerCase() ?? "least concern";
  const resolvedStatusIcon = CONSERVATION_STATUS_ICONS[statusKey] ?? animal.conservationStatusIcon ?? "/Least-Concern.svg";
  const statusIconSource = normalizeIconUrl(resolvedStatusIcon);
  const statusText = animal.conservationStatus.toUpperCase();
  const taxonomicLabel = animal.taxonomicGroup.toUpperCase();
  const keyThreats = (animal.threats ?? []).slice(0, 4);

  return (
    <main className="animal-screen">
      <header className="animal-topbar">
        <Link to="/map" className="animal-back-btn" aria-label="Back to map">
          <img src={ARROW_ICON_DEFAULT} alt="" className="animal-back-btn-icon" />
        </Link>
        <h1 className="animal-title">{animal.commonName.toUpperCase()}</h1>
      </header>

      <section className="animal-layout">
        <aside className="animal-media-column">
          <div className="animal-hero-media">
            <img className="animal-photo" src={photoSource} alt={animal.commonName} />
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
                      <img className="iucn-status-icon" src={statusIconSource} alt={statusText} />
                      <span className="iucn-status-text">{statusText}</span>
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
                      {animal.habitatDescription ?? "No habitat description available"}
                    </div>
                  </div>
                  <div className="taxonomic-badge" aria-label={taxonomicLabel}>
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
                      <div className="add-fun-fact-here">{shownDescription}</div>
                    </div>
                  </div>
                  {description.length > 260 && (
                    <button
                      type="button"
                      className="read-more-btn"
                      onClick={() => setIsExpanded((value) => !value)}
                    >
                      {isExpanded ? "READ LESS" : "READ MORE"}
                    </button>
                  )}
                </div>
              )}

              {animal.funFact && (
                <div className="div-3">
                  <div className="section-name">
                    <div className="text-wrapper-4">FUN FACT</div>
                  </div>
                  <div className="fun-fact-card">
                    <div className="fun-fact-container">
                      <div className="add-fun-fact-here">{animal.funFact}</div>
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
                    <img className="icon" alt="Weight icon" src="/length.svg" />
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