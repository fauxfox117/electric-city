import { getAllAnimals } from '../../utils/api';
import './HomeMapPreview.css';

interface HomeMapPreviewProps {
  selectedAnimalId: string | null;
  onSelectAnimal: (id: string) => void;
}

export function HomeMapPreview({ selectedAnimalId, onSelectAnimal }: HomeMapPreviewProps) {
  const previewAnimals = getAllAnimals().slice(0, 3);

  return (
    <>
      <div className="home-map-preview__globe" />
      {previewAnimals.map((animal, index) => (
        <button
          key={animal.id}
          type="button"
          onClick={() => onSelectAnimal(animal.id)}
          className={`home-map-preview__icon home-map-preview__icon--${index} ${
            selectedAnimalId === animal.id ? 'home-map-preview__icon--selected' : ''
          }`}
        >
          <img
            src={animal.photoUrl}
            alt={animal.commonName}
            className="home-map-preview__icon-img"
          />
        </button>
      ))}
      <p className="home-map-preview__hint">tap the map to learn more</p>
    </>
  );
}