import { Link } from 'react-router';

import './HomeHero.css';

export function HomeHero () {
    return (
<div className='home-hero'>
    <div className='home-hero__logo'>
        LOGO
    </div>
    <h1 className='home-hero__title'>
        Explore Our World
    </h1>
    <p className='home-hero__welcome'>
        Discover the animals of Electric City Aquarium & Reptile Den and learn about their conservation status around the world.
    </p>
    <Link to="/map" className='home-hero__cta-btn'>
    Start Exploring
    </Link>
</div>
    );
}