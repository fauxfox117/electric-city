import { useNavigate } from 'react-router';
import './HomeHero.css';



export function HomeHero() {
  const navigate = useNavigate();

  return (
    <div className="home-hero">
      <div className="home-hero__top-row">
        <div className="home-hero__logo-wrapper">
  <img src="/images/logo.png" alt="Electric City Aquarium & Reptile Den" className="home-hero__logo" />
</div>
        <h1 className="home-hero__title">Explore Our World</h1>
      </div>
      <p className="home-hero__welcome">
       Welcome to Electric City Aquarium & Reptile Den, your ultimate spot for exploring vibrant aquatic life and fascinating reptiles. Dive in and discover a world of wonder!
      </p>
      <button
        type="button"
        onClick={() => navigate('/map')}
        className="home-hero__cta-btn"
      >
        Start Exploring
      </button>
    </div>
  );
}

