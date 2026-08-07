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
| 'bird';

export interface Animal {
    id: string;
    commonName: string;
    scientificName?: string;
    photoUrl: string;
    taxonomicGroup: TaxonomicGroup;
    nativeRegion: string;
    habitatDescription: string;
    conservationStatus: ConservationStatus;
    conservationStatusIcon: string;
    threats: string[];
    funFact: string;
    estimatedWildPopulation?: string;
}