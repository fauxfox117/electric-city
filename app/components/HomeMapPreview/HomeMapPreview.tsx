  import { useNavigate } from 'react-router';
  import './HomeMapPreview.css';
  import { TaxonomicIcon } from '../TaxonomicIcon/TaxonomicIcon';

  const categories = [
  { id: 'amphibians', label: 'Amphibians', icon: '/images/amphibians.png', iconActive: '/images/amphibians.png' },
  { id: 'fish', label: 'Fish', icon: '/images/fish.png', iconActive: '/images/fish.png' },
  { id: 'reptiles', label: 'Reptiles', icon: '/images/reptiles.png', iconActive: '/images/reptiles.png' },
  { id: 'mammals', label: 'Mammals', icon: '/images/mammals.png', iconActive: '/images/mammals.png' },
  { id: 'birds', label: 'Birds', icon: '/images/birds.png', iconActive: '/images/birds.png' },
  { id: 'invertebrates', label: 'Invertebrates', icon: '/images/invertebrates.png', iconActive: '/images/invertebrates.png' },
];

  export function HomeMapPreview() {
  const navigate = useNavigate();

  return (
    <>
      <img src="/images/globe.png" className="home-map-preview__globe" alt="World map" />
      {categories.map((category, index) => (
       <TaxonomicIcon
  key={category.id}
  label={category.label}
  iconSrc={category.icon}
  iconSrcActive={category.iconActive}
  onClick={() => navigate(`/map?category=${category.id}`)}
  className={`home-map-preview__icon home-map-preview__icon--${index}`}
/>
      ))}
      <img src="/images/arrow-hint.png" className="home-map-preview__arrow" alt="" />
      <p className="home-map-preview__hint">tap to learn more</p>
    </>
  );
}