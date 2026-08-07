import { useNavigate } from 'react-router';
import './HomeHero.css';

interface HomeHeroProps {
  isExploreEnabled: boolean;
}

export function HomeHero({ isExploreEnabled }: HomeHeroProps) {
  const navigate = useNavigate();

  return (
    <div className="home-hero">
      <div className="home-hero__top-row">
        <div className="home-hero__logo">LOGO</div>
        <h1 className="home-hero__title">Explore Our World</h1>
      </div>
      <p className="home-hero__welcome">
       Discover the animals of Electric City Aquarium & Reptile Den and learn about their conservation status around the world.
      </p>
      <button
        type="button"
        disabled={!isExploreEnabled}
        onClick={() => navigate('/map')}
        className="home-hero__cta-btn"
      >
        Start Exploring
      </button>
    </div>
  );
}

