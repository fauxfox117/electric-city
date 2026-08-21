export type ConservationStatus = 
| 'Least Concern'
| 'Near Threatened'
| 'Vulnerable'
| 'Endangered'
| 'Critically Endangered';

export type TaxonomicGroup =
| 'fish'
| 'reptile'
| 'amphibian'
| 'mammal'
| 'bird'
| 'invertebrate';

export interface Animal {
    id: string;
    commonName: string;
    scientificName?: string;
    description?: string;
    photoUrl: string;
    taxonomicGroup: TaxonomicGroup;
    nativeRegion: string;
    habitatDescription: string;
    conservationStatus: ConservationStatus;
    conservationStatusIcon: string;
    weight?: string;
    length?: string;
    lifespan?: string;
    diet?: string;
    relatedSpecies?: string[];
    threats: string[];
    funFact: string;
    estimatedWildPopulation?: string;
}