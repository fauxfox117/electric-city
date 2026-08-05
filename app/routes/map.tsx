import { Link } from "react-router";
import { getAllAnimals } from "~/models/animal.server";
import type { Route } from "./+types/map";

export async function loader() {
  const animals = getAllAnimals();
  return { animals };
}

export default function Map({ loaderData }: Route.ComponentProps) {
  const { animals } = loaderData;

  return (
    <main>
      <h1>Animal Map</h1>

      {animals.length === 0 ? (
        <p>No animals added yet. <Link to="/animals/new">Add one</Link>.</p>
      ) : (
        <ul>
          {animals.map((animal) => (
            <li key={animal.id}>
              <Link to={`/animals/${animal.id}`}>
                {animal.common_name}
                {animal.taxonomic_group && (
                  <span> — {animal.taxonomic_group}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link to="/animals/new">+ Add Animal</Link>
    </main>
  );
}
