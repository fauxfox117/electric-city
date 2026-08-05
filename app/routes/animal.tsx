import { data, Link } from "react-router";
import { getAnimalById } from "~/utils/api";
import type { Route } from "./+types/animal";

export async function loader({ params }: Route.LoaderArgs) {
  const animal = getAnimalById(params.id);
  if (!animal) {
    throw data("Animal not found", { status: 404 });
  }
  return { animal };
}

export default function AnimalDetail({ loaderData }: Route.ComponentProps) {
  const { animal } = loaderData;

  return (
    <main>
      <Link to="/map">← Back to Map</Link>

      <h1>{animal.commonName}</h1>

      {animal.scientificName && (
        <p><em>{animal.scientificName}</em></p>
      )}

      {animal.photoUrl ? (
        <img src={animal.photoUrl} alt={animal.commonName} />
      ) : (
        <p>[No photo available]</p>
      )}

      <section>
        <h2>Details</h2>
        <p><strong>Taxonomic Group:</strong> {animal.taxonomicGroup}</p>
        <p><strong>Native Region:</strong> {animal.nativeRegion}</p>
        <p><strong>Habitat:</strong> {animal.habitatDescription}</p>
        <p>
          <strong>Conservation Status:</strong>{" "}
          <span>{animal.conservationStatus}</span>
        </p>
      </section>

      {animal.threats.length > 0 && (
        <section>
          <h2>Threats</h2>
          <ul>
            {animal.threats.map((threat) => (
              <li key={threat}>{threat}</li>
            ))}
          </ul>
        </section>
      )}

      {animal.funFact && (
        <section>
          <h2>Fun Fact</h2>
          <p>{animal.funFact}</p>
        </section>
      )}
    </main>
  );
}
