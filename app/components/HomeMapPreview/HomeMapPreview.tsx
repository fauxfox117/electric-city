  import { useNavigate } from 'react-router';
  import './HomeMapPreview.css';

  const categories = [
    { id: 'amphibians', label: 'Amphibians', icon: '/images/amphibian.png' },
    { id: 'fish', label: 'Fish', icon: '/images/fish.png' },
    { id: 'reptiles', label: 'Reptiles', icon: '/images/reptile.png' },
    { id: 'mammals', label: 'Mammals', icon: '/images/mammal.png' },
    { id: 'birds', label: 'Birds', icon: '/images/bird.png' },
  ];

  export function HomeMapPreview() {
  const navigate = useNavigate();

  return (
    <>
      <img src="/images/globe.png" className="home-map-preview__globe" alt="World map" />
      {categories.map((category, index) => (
        <button
          key={category.id}
          type="button"
          onClick={() => navigate(`/map?category=${category.id}`)}
          className={`home-map-preview__icon home-map-preview__icon--${index}`}
        >
          <img src={category.icon} alt={category.label} className="home-map-preview__icon-img" />
        </button>
      ))}
      <img src="/images/arrow-hint.png" className="home-map-preview__arrow" alt="" />
      <p className="home-map-preview__hint">tap the map to learn more</p>
    </>
  );
}