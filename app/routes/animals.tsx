import { data, useLoaderData } from "react-router";
import { getAllAnimals } from "~/utils/api";
import { InteractiveMap } from "~/components/InteractiveMap/InteractiveMap";

export async function clientLoader() {
  const animals = getAllAnimals();
  return data({ animals });
}

export default function AnimalsIndex() {
  const { animals } = useLoaderData<typeof clientLoader>();

  return (
    <main>
      <InteractiveMap animals={animals} />
    </main>
  );
}