import { Link } from "react-router";
import { getAllAnimals } from "~/utils/api";

export default function AnimalsIndex() {
  const animals = getAllAnimals();

  return (
    <main>
      <h1>Animals</h1>
      <ul>
        {animals.map((animal) => (
          <li key={animal.id}>
            <Link to={`/animals/${animal.id}`}>{animal.commonName}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}