import { useEffect, useState } from "react";
import { data, Link } from "react-router";
import { useIdleRedirect } from "~/hooks/useIdleRedirect";
import { getAnimalById } from "~/utils/api";
import type { Route } from "./+types/AnimalDetail";
import "./AnimalDetail.css";

const ARROW_ICON = "/round-arrow-back.png";
const CLOSE_ICON = "/close-btn.png";
const TAXONOMIC_ICONS: Record<string, string> = {
  fish: "/images/fish.png",
  reptile: "/images/reptiles.png",
  amphibian: "/images/amphibians.png",
  mammal: "/images/mammals.png",
  bird: "/images/birds.png",
  invertebrate: "/images/invertebretes.png",
};
const MISSING_PHOTO_ICON = "/Missing-photo.svg";
const PHOTO_BACK_ICON = "/photo-back-btn.svg";
const PHOTO_FORWARD_ICON = "/photo-forward-btn.svg";

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
  const normalized = raw.trim().replace(/^\.?\/public\//, "").replace(/^\.?\//, "");
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
  const [readMoreContent, setReadMoreContent] = useState<{ title: string; text: string } | null>(null);
  const [activeMedia, setActiveMedia] = useState<"video" | "photo" | "audio">("video");

  const description = animal.description ?? "";
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

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setReadMoreContent(null);
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  function expandableText(title: string, text: string, className: string, threshold = 180) {
    const canExpand = text.length > threshold;

    return (
      <>
        <div className={className}>{canExpand ? truncate(text) : text}</div>
        {canExpand && (
          <button
            type="button"
            className="read-more-btn"
            onClick={() => setReadMoreContent({ title, text })}
          >
            READ MORE
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
                <button type="button" className="photo-nav-button" aria-label="Previous photo">
                  <img src={PHOTO_BACK_ICON} alt="" />
                </button>
                <img className="missing-photo-icon" src={MISSING_PHOTO_ICON} alt="" />
                <div className="missing-photo-copy">
                  <strong>No Photo Available</strong>
                  <p>We’re currently updating this animal’s image.</p>
                  <p>Please explore another species.</p>
                </div>
                <button type="button" className="photo-nav-button" aria-label="Next photo">
                  <img src={PHOTO_FORWARD_ICON} alt="" />
                </button>
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
                    <div className={`iucn-status-row status-row--${statusKey.replaceAll(" ", "-")}`}>
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
                    {expandableText("nativeRegion", animal.nativeRegion ?? "Unknown region", "country-territory")}
                    <div className="specific-region-of">
                      {expandableText("Habitat", animal.habitatDescription ?? "No habitat description available", "habitat-copy")}
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
                      {expandableText("Description", description, "add-fun-fact-here")}
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
                      {expandableText("Fun Fact", animal.funFact, "add-fun-fact-here")}
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
                        {expandableText("Key Threat", threat, "bullet-point")}
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
                        {expandableText("Weight", animal.weight ?? "Unknown", "text-wrapper-7", 25)}
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
                        {expandableText("Length", animal.length ?? "Unknown", "text-wrapper-7", 25)}
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
                        {expandableText("Lifespan", animal.lifespan ?? "Unknown", "number-of-years", 25)}
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
                        {expandableText("Diet", animal.diet ?? "Unknown", "text-wrapper-7", 25)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {readMoreContent && (
        <div
          className="read-more-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setReadMoreContent(null);
          }}
        >
          <section
            className="read-more-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="read-more-modal-title"
          >
            <button
              type="button"
              className="read-more-modal-close"
              onClick={() => setReadMoreContent(null)}
              aria-label="Close expanded content"
            >
              <img src={CLOSE_ICON} alt="" />
            </button>
            <h2 id="read-more-modal-title">{readMoreContent.title}</h2>
            <p>{readMoreContent.text}</p>
          </section>
        </div>
      )}
    </main>
  );
}