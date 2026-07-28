import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'auto',
  size = 'md',
  showSubtitle = true
}) => {
  // Size classes
  const arabicTextSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-4xl sm:text-5xl'
  };

  const englishTextSizes = {
    sm: 'text-[9px] tracking-[0.35em]',
    md: 'text-[11px] tracking-[0.45em]',
    lg: 'text-[14px] tracking-[0.55em]'
  };

  const textColors = {
    dark: 'text-slate-950', // for light backgrounds
    light: 'text-white',     // for dark backgrounds
    auto: 'text-slate-900 dark:text-white'
  };

  const subtitleColors = {
    dark: 'text-slate-800',
    light: 'text-slate-300',
    auto: 'text-slate-700 dark:text-slate-300'
  };

  return (
    <div className="inline-flex flex-col items-center justify-center select-none font-['Tajawal'] text-center">
      {/* Arabic Main Typography matching uploaded brand logo */}
      <span className={`font-black leading-none tracking-tight ${arabicTextSizes[size]} ${textColors[variant]}`}>
        ســيــروان
      </span>
      
      {/* English Tracked Subtitle matching uploaded brand logo */}
      {showSubtitle && (
        <span className={`font-semibold uppercase mt-1 ${englishTextSizes[size]} ${subtitleColors[variant]}`}>
          S I R W A N
        </span>
      )}
    </div>
  );
};
