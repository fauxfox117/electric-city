import type { Animal, TaxonomicGroup } from './types';
import animalsData from './animals.json';

// NOTE: photoUrl and conservationStatusIcon values in animals.json are placeholders
// pending real assets from the UX/UI team


const animals = animalsData.animals as Animal[];

export function getAllAnimals(): Animal[] {
    return animals;
}

export function getAnimalById(id: string): Animal | undefined {
    return animals.find((animal) => animal.id === id);
}

export function getAnimalsByTaxonomicGroup(group: TaxonomicGroup): Animal[] {
    return animals.filter((animal) => animal.taxonomicGroup === group);
}
