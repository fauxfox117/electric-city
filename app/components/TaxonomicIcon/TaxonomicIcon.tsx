  import { useState } from 'react';
  import './TaxonomicIcon.css';

  interface TaxonomicIconProps {
    label: string;
    iconSrc: string;
    onClick?: () => void;
    className?: string;
  }

  export function TaxonomicIcon({ label, iconSrc, onClick, className = '' }: TaxonomicIconProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`taxonomic-icon ${isHovered ? 'taxonomic-icon--active' : ''} ${className}`}
      >
        <img src={iconSrc} alt="" className={`taxonomic-icon__img ${isHovered ? 'taxonomic-icon__img--active' : ''}`} />
        <span className="taxonomic-icon__label">{label}</span>
      </button>
    );
  }