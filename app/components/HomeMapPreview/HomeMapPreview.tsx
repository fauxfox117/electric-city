  import { useNavigate } from 'react-router';
  import { withBase } from '~/utils/publicPath';
  import './HomeMapPreview.css';
  import { TaxonomicIcon } from '../TaxonomicIcon/TaxonomicIcon';

  const categories = [
  { id: 'amphibians', label: 'Amphibians', icon: withBase('/images/amphibians.png'), iconActive: withBase('/images/amphibians.png') },
  { id: 'fish', label: 'Fish', icon: withBase('/images/fish.png'), iconActive: withBase('/images/fish.png') },
  { id: 'reptiles', label: 'Reptiles', icon: withBase('/images/reptiles.png'), iconActive: withBase('/images/reptiles.png') },
  { id: 'mammals', label: 'Mammals', icon: withBase('/images/mammals.png'), iconActive: withBase('/images/mammals.png') },
  { id: 'birds', label: 'Birds', icon: withBase('/images/birds.png'), iconActive: withBase('/images/birds.png') },
  { id: 'invertebrates', label: 'Invertebrates', icon: withBase('/images/invertebrates.png'), iconActive: withBase('/images/invertebrates.png') },
];

  export function HomeMapPreview() {
  const navigate = useNavigate();

  return (
    <>
      <img src={withBase('/images/globe.png')} className="home-map-preview__globe" alt="World map" />
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
      <img src={withBase('/images/arrow-hint.png')} className="home-map-preview__arrow" alt="" />
      <p className="home-map-preview__hint">tap to learn more</p>
    </>
  );
}