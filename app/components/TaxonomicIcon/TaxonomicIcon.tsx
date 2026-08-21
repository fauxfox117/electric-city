import { useState } from 'react';
import './TaxonomicIcon.css';

interface TaxonomicIconProps {
  label: string;
  iconSrc: string;
  iconSrcActive: string;
  onClick?: () => void;
  className?: string;
}

export function TaxonomicIcon({ label, iconSrc, iconSrcActive, onClick, className = '' }: TaxonomicIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`taxonomic-icon ${isHovered ? 'taxonomic-icon--active' : ''} ${className}`}
    >
      <img
        src={isHovered ? iconSrcActive : iconSrc}
        alt=""
        className="taxonomic-icon__img"
      />
      <span className="taxonomic-icon__label">{label}</span>
    </button>
  );
}