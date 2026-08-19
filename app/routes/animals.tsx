import { data, useLoaderData } from "react-router";
import { getAllAnimals } from "~/utils/api";
import { InteractiveMap } from "~/components/InteractiveMap/InteractiveMap";

export async function loader() {
  const animals = getAllAnimals();
  return data({ animals });
}

export default function AnimalsIndex() {
  const { animals } = useLoaderData<typeof loader>();

  return (
    <main>
      <InteractiveMap animals={animals} />
    </main>
  );
}