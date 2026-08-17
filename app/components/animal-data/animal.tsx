import { useState } from "react";
import { data, Link } from "react-router";
import { getAnimalById } from "~/utils/api";
import type { Route } from "./+types/animal";
import "./animal.css";

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

const PLACEHOLDER = "/Large%20Image%20Placeholder.png";

export default function AnimalDetail({ loaderData }: Route.ComponentProps) {
  const animal = loaderData.animal as typeof loaderData.animal & AnimalDetailOptionalFields;
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMedia, setActiveMedia] = useState<"video" | "photo" | "audio">("video");

  const description = animal.description ?? animal.habitatDescription;
  const shownDescription = isExpanded ? description : truncate(description);

  return (
    <main className="animal-screen">
      <header className="animal-topbar">
        <Link to="/map" className="animal-back-btn" aria-label="Back to map">
          ←
        </Link>
        <h1 className="animal-title">{animal.commonName.toUpperCase()}</h1>
      </header>

      <section className="animal-layout">
        <aside className="animal-media-column">
          <div className="animal-hero-media">
            {animal.photoUrl ? (
              <img
                className="animal-photo"
                src={animal.photoUrl}
                alt={animal.commonName}
              />
            ) : (
              <div className="animal-photo-placeholder">
                <span>IMAGE NOT AVAILABLE</span>
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

        <div className="animal-info-column">
          <div className="animal-header-row">
            <div className="animal-header-block">
              <p className="animal-header-label">SCIENTIFIC NAME</p>
              <p className="animal-header-value animal-scientific-name">
                {animal.scientificName ?? "Unknown"}
              </p>
            </div>
            <div className="animal-header-block">
              <p className="animal-header-label">CONSERVATION STATUS</p>
              <p className="animal-header-value animal-conservation-status">{animal.conservationStatus.toUpperCase()}</p>
            </div>
          </div>
{/* 
          <section className="animal-section">
            <h2 className="section-title">DESCRIPTION</h2>
            <p className="section-body">{shownDescription}</p>
            {description.length > 260 && (
              <button
                type="button"
                className="read-more-btn"
                onClick={() => setIsExpanded((v) => !v)}
              >
                {isExpanded ? "READ LESS" : "READ MORE"}
              </button>
            )}
          </section> */}
          <section className="animal-fact-section">
            <div className="animal-fun-fact">
              {animal.funFact && (
            <section className="animal-fact-section">
              <h2 className="section-title">FUN FACT</h2>
              <p className="section-body">{animal.funFact}</p>
            </section>
          )}
          {animal.threats.length > 0 && (
            <section className="animal-section">
              <h2 className="section-title">THREATS</h2>
              <ul className="threats-list">
                {animal.threats.map((threat) => (
                  <li key={threat}>{threat}</li>
                ))}
              </ul>
            </section>
          )}

            </div>
          </section>

          <section className="animal-section">
            <div className="quick-stats-header">
              <h2 className="section-title">QUICK STATS</h2>
            </div>
            <div className="quick-stats-grid">
              <article className="stat-card">
                <p className="stat-label">WEIGHT</p>
                <p className="stat-value">{animal.weight ?? "Unknown"}</p>
              </article>
              <article className="stat-card">
                <p className="stat-label">LENGTH</p>
                <p className="stat-value">{animal.length ?? "Unknown"}</p>
              </article>
              <article className="stat-card">
                <p className="stat-label">LIFESPAN</p>
                <p className="stat-value">{animal.lifespan ?? "Unknown"}</p>
              </article>
              <article className="stat-card">
                <p className="stat-label">DIET</p>
                <p className="stat-value">{animal.diet ?? "Unknown"}</p>
              </article>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}