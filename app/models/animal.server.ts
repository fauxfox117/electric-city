import db from "~/database/database.server";

export interface AnimalRow {
  id: number;
  common_name: string;
  scientific_name: string | null;
  taxonomic_group: string;
  native_region: string;
  conservation_status: string;
  threats: string | null;
  photo_url: string | null;
  fun_fact: string | null;
  facility_context: string | null;
}

export function getAnimalById(id: number | string): AnimalRow | undefined {
  return db
    .prepare("SELECT * FROM animals WHERE id = ?")
    .get(id) as AnimalRow | undefined;
}

export function getAllAnimals(): AnimalRow[] {
  return db.prepare("SELECT * FROM animals").all() as AnimalRow[];
}

export interface CreateAnimalData {
  common_name: string;
  scientific_name?: string;
  taxonomic_group: string;
  native_region: string;
  conservation_status: string;
  threats?: string[];
  photo_url?: string;
  fun_fact?: string;
  facility_context?: string;
}

export function createAnimal(data: CreateAnimalData): number {
  const result = db
    .prepare(
      `INSERT INTO animals
        (common_name, scientific_name, taxonomic_group, native_region, conservation_status, threats, photo_url, fun_fact, facility_context)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      data.common_name,
      data.scientific_name ?? null,
      data.taxonomic_group,
      data.native_region,
      data.conservation_status,
      data.threats ? JSON.stringify(data.threats) : null,
      data.photo_url ?? null,
      data.fun_fact ?? null,
      data.facility_context ?? null
    );
  return result.lastInsertRowid as number;
}
