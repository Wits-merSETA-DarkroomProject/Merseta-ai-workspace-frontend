import React from "react";

interface InstitutionBrandingProps {
  variant?: "header" | "hero" | "footer" | "compact";
  className?: string;
}

export const InstitutionBranding: React.FC<InstitutionBrandingProps> = ({
  variant = "header",
  className = "",
}) => {
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2.5 select-none ${className}`}>
        <img
          src="/wits-logo-dark.svg"
          alt="University of the Witwatersrand"
          className="w-[84px] h-[26px] object-contain shrink-0 logo-dark"
        />
        <img
          src="/wits-logo.svg"
          alt="University of the Witwatersrand"
          className="w-[84px] h-[26px] object-contain shrink-0 logo-light"
        />
        <div className="w-[1px] h-[22px] bg-line shrink-0" />
        <img
          src="/Mersetalogo-1.png"
          alt="merSETA"
          className="w-[66px] h-[22px] object-contain shrink-0"
        />
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={`flex items-center justify-center gap-4 sm:gap-6 select-none ${className}`}>
        <img
          src="/wits-logo-dark.svg"
          alt="University of the Witwatersrand"
          className="w-[120px] sm:w-[136px] h-[36px] sm:h-[42px] object-contain shrink-0 logo-dark"
        />
        <img
          src="/wits-logo.svg"
          alt="University of the Witwatersrand"
          className="w-[120px] sm:w-[136px] h-[36px] sm:h-[42px] object-contain shrink-0 logo-light"
        />
        <div className="w-[1px] h-[32px] sm:h-[36px] bg-line shrink-0" />
        <img
          src="/Mersetalogo-1.png"
          alt="merSETA"
          className="w-[96px] sm:w-[108px] h-[32px] sm:h-[36px] object-contain shrink-0"
        />
      </div>
    );
  }

  // Default: 'header' and 'footer' adhering to Skills Mapping specification:
  // Wits: Width ~104px, Height ~32px | Divider: 1px × 28px border-line | merSETA: Width ~82px, Height ~28px
  return (
    <div className={`flex items-center gap-3 sm:gap-3.5 select-none ${className}`}>
      <img
        src="/wits-logo-dark.svg"
        alt="University of the Witwatersrand"
        className="w-[96px] sm:w-[104px] h-[28px] sm:h-[32px] object-contain shrink-0 logo-dark"
      />
      <img
        src="/wits-logo.svg"
        alt="University of the Witwatersrand"
        className="w-[96px] sm:w-[104px] h-[28px] sm:h-[32px] object-contain shrink-0 logo-light"
      />
      <div className="w-[1px] h-[24px] sm:h-[28px] bg-line shrink-0" />
      <img
        src="/Mersetalogo-1.png"
        alt="merSETA"
        className="w-[74px] sm:w-[82px] h-[24px] sm:h-[28px] object-contain shrink-0"
      />
    </div>
  );
};

export default InstitutionBranding;
