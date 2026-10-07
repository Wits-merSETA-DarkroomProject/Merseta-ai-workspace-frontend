import React from "react";
import "./Strands.css";

export interface StrandsProps {
  colors?: string[];
  count?: number;
  speed?: number;
  amplitude?: number;
  waviness?: number;
  thickness?: number;
  glow?: number;
  taper?: number;
  spread?: number;
  intensity?: number;
  saturation?: number;
  opacity?: number;
  scale?: number;
  glass?: boolean;
  className?: string;
  mask?: "radial" | "horizontal" | "none";
}

export const Strands: React.FC<StrandsProps> = ({
  className = "",
}) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-navy/20 via-transparent to-gold/10 opacity-60" />
    </div>
  );
};

export default Strands;
