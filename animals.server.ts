import db from "../database.server";

export interface AnimalRow {
    id: number;
    scientific_name: string | null;
    taxonomic_group: string;
    native_region: string;
    conservation_status: string;
    threats: string | null;
    photo_url: string | null;
    fun_fact: string | null;
    facility_context: string | null;
}

export function getAnimalById(id: string | number): AnimalRow | undefined {
  return db.prepare("SELECT * FROM animals WHERE id = ?").get(id) as AnimalRow | undefined;
}

export function getAllAnimals(): AnimalRow[] {
  return db.prepare("SELECT * FROM animals").all() as AnimalRow[];
}

export function createAnimal(data: {
  common_name: string;
  scientific_name?: string | null;
  taxonomic_group: string;
  native_region: string;
  conservation_status: string;
  threats: string[]; // will be JSON.stringify'd here
  photo_url?: string | null;
  fun_fact?: string | null;
  facility_context?: string | null;
}) {
  const insert = db.prepare(`
    INSERT INTO animals (common_name, scientific_name, taxonomic_group, native_region, conservation_status, threats, photo_url, fun_fact, facility_context)
    VALUES (@common_name, @scientific_name, @taxonomic_group, @native_region, @conservation_status, @threats, @photo_url, @fun_fact, @facility_context)
  `);

  return insert.run({
    common_name: data.common_name,
    scientific_name: data.scientific_name ?? null,
    taxonomic_group: data.taxonomic_group,
    native_region: data.native_region,
    conservation_status: data.conservation_status,
    threats: JSON.stringify(data.threats),
    photo_url: data.photo_url ?? null,
    fun_fact: data.fun_fact ?? null,
    facility_context: data.facility_context ?? null,
  });
}