import { useState } from 'react';
import { getAllAnimals } from '../../utils/api';
import type { Animal } from '../../utils/types';
import './HomeMapPreview.css';

function AnimalIcon({ animal, index }: { animal: Animal; index: number }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`home-map-preview__icon home-map-preview__icon--${index}`}>
      <div className="home-map-preview__bubble">
        {imageError ? (
          <span className="home-map-preview__icon-fallback">
            {animal.commonName.charAt(0)}
          </span>
        ) : (
          <img
            src={animal.photoUrl}
            alt={animal.commonName}
            onError={() => setImageError(true)}
            className="home-map-preview__icon-img"
          />
        )}
      </div>
      <span className="home-map-preview__label">{animal.commonName}</span>
    </div>
  );
}

export function HomeMapPreview() {
  const previewAnimals = getAllAnimals().slice(0, 3);

  return (
    <div className="home-map-preview">
      <div className="home-map-preview__globe">
        {previewAnimals.map((animal, index) => (
          <AnimalIcon key={animal.id} animal={animal} index={index} />
        ))}
      </div>
      <p className="home-map-preview__hint">
        Tap the map to learn more
      </p>
    </div>
  );
}