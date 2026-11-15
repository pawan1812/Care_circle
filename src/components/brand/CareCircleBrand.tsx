import React, { useEffect, useState } from 'react';

interface MarkProps {
  size?: number | string;
  className?: string;
  variant?: 'light' | 'dark' | 'color';
}

/**
 * CareCircle Logomark
 * Concept: A protective outer circle (the Care Circle) cradling two joined hands
 * forming a heart silhouette, with a subtle pill & 8 AM clock tick nested in the negative space.
 */
export const CareCircleMark: React.FC<MarkProps> = ({
  size = 40,
  className = '',
  variant = 'color',
}) => {
  const isLight = variant === 'light';
  const primaryStroke = isLight ? '#FAF7F2' : '#14382C';
  const accentStroke = isLight ? '#F2CC8F' : '#E07A5F';
  const pillFill = isLight ? 'rgba(242, 204, 143, 0.25)' : 'rgba(45, 106, 79, 0.15)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CareCircle Logomark"
    >
      {/* Outer Protective Care Circle (Organic curved envelope) */}
      <path
        d="M32 7C45.8 7 57 18.2 57 32C57 44.8 47.4 55.4 35 56.8"
        stroke={primaryStroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 56.8C15.8 55.2 7 44.6 7 32C7 19.5 16.1 9.1 28 7.3"
        stroke={accentStroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Two Cupped Hands meeting to form an organic Heart */}
      {/* Left cupping hand */}
      <path
        d="M17 31C17 23.5 23 19 28.5 22.5C31 24.2 32 27 32 29"
        stroke={accentStroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Right cupping hand */}
      <path
        d="M47 31C47 23.5 41 19 35.5 22.5C33 24.2 32 27 32 29"
        stroke={primaryStroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Base of Heart / Embracing palms meeting below */}
      <path
        d="M20 34.5C21 41 26 47 32 49C38 47 43 41 44 34.5"
        stroke={primaryStroke}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Negative Space Capsule Pill (Nested in the heart center) */}
      <rect
        x="28.5"
        y="25"
        width="7"
        height="14"
        rx="3.5"
        fill={pillFill}
        stroke={accentStroke}
        strokeWidth="2"
      />
      
      {/* Pill divider line & subtle 8 AM clock tick */}
      <line x1="28.5" y1="32" x2="35.5" y2="32" stroke={accentStroke} strokeWidth="1.5" />
      {/* 8:00 AM clock tick hand */}
      <line x1="32" y1="28.5" x2="30.2" y2="30.5" stroke={primaryStroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

/**
 * Animated SVG version of the Logomark
 * Draws its strokes sequentially on mount with smooth spring physics
 */
export const CareCircleMarkAnimated: React.FC<MarkProps> = ({
  size = 48,
  className = '',
  variant = 'color',
}) => {
  const [isDrawn, setIsDrawn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsDrawn(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const isLight = variant === 'light';
  const primaryStroke = isLight ? '#FAF7F2' : '#14382C';
  const accentStroke = isLight ? '#F2CC8F' : '#E07A5F';

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-700 ease-out hover:scale-105"
      >
        <circle
          cx="32"
          cy="32"
          r="28"
          fill={isLight ? 'rgba(255,255,255,0.06)' : 'rgba(45,106,79,0.04)'}
        />
        
        {/* Animated Outer Circle */}
        <path
          d="M32 7C45.8 7 57 18.2 57 32C57 44.8 47.4 55.4 35 56.8"
          stroke={primaryStroke}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="160"
          strokeDashoffset={isDrawn ? '0' : '160'}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        <path
          d="M27 56.8C15.8 55.2 7 44.6 7 32C7 19.5 16.1 9.1 28 7.3"
          stroke={accentStroke}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="160"
          strokeDashoffset={isDrawn ? '0' : '160'}
          style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.15s' }}
        />

        {/* Animated Inner Heart & Hands */}
        <path
          d="M17 31C17 23.5 23 19 28.5 22.5C31 24.2 32 27 32 29"
          stroke={accentStroke}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="60"
          strokeDashoffset={isDrawn ? '0' : '60'}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s' }}
        />
        <path
          d="M47 31C47 23.5 41 19 35.5 22.5C33 24.2 32 27 32 29"
          stroke={primaryStroke}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="60"
          strokeDashoffset={isDrawn ? '0' : '60'}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s' }}
        />

        <path
          d="M20 34.5C21 41 26 47 32 49C38 47 43 41 44 34.5"
          stroke={primaryStroke}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="80"
          strokeDashoffset={isDrawn ? '0' : '80'}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s' }}
        />

        {/* Center Pill pop-in */}
        <g
          style={{
            opacity: isDrawn ? 1 : 0,
            transform: isDrawn ? 'scale(1)' : 'scale(0.5)',
            transformOrigin: '32px 32px',
            transition: 'opacity 0.6s ease-out 0.7s, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s',
          }}
        >
          <rect
            x="28.5"
            y="25"
            width="7"
            height="14"
            rx="3.5"
            fill={isLight ? 'rgba(242, 204, 143, 0.3)' : 'rgba(45, 106, 79, 0.2)'}
            stroke={accentStroke}
            strokeWidth="2"
          />
          <line x1="28.5" y1="32" x2="35.5" y2="32" stroke={accentStroke} strokeWidth="1.5" />
          <line x1="32" y1="28.5" x2="30.2" y2="30.5" stroke={primaryStroke} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

/**
 * Full CareCircle Logo Lockup
 * Rounded humanist wordmark with subtle heart dot on the 'i'
 */
export const CareCircleLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'color';
  animated?: boolean;
  className?: string;
}> = ({ size = 'md', variant = 'color', animated = false, className = '' }) => {
  const isLight = variant === 'light';
  const markSize = size === 'sm' ? 32 : size === 'lg' ? 52 : 40;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';

  return (
    <div className={`inline-flex items-center space-x-3 select-none ${className}`}>
      {animated ? (
        <CareCircleMarkAnimated size={markSize} variant={variant} />
      ) : (
        <CareCircleMark size={markSize} variant={variant} />
      )}
      
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span
            className={`font-extrabold tracking-tight ${textSize}`}
            style={{
              fontFamily: "'Figtree', sans-serif",
              color: isLight ? '#FAF7F2' : '#14382C',
            }}
          >
            Care
          </span>
          <span
            className={`font-semibold tracking-tight italic ml-0.5 ${textSize}`}
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              color: isLight ? '#F2CC8F' : '#2D6A4F',
            }}
          >
            Circle
          </span>
          {/* Warm small pill accent */}
          <span
            className="w-1.5 h-1.5 rounded-full ml-1"
            style={{ backgroundColor: isLight ? '#E07A5F' : '#E07A5F' }}
          />
        </div>
        <span
          className="text-[10px] font-bold tracking-wider uppercase mt-0.5"
          style={{
            fontFamily: "'Figtree', sans-serif",
            color: isLight ? '#81B29A' : '#6B7F74',
          }}
        >
          Shared Elder Care
        </span>
      </div>
    </div>
  );
};

/**
 * App Icon deliverable (Squircle with inner glow and centered mark)
 */
export const CareCircleAppIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 64,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-[22%] shadow-xl ${className}`}
    >
      <defs>
        <linearGradient id="appIconBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1B4332" />
          <stop offset="1" stopColor="#14382C" />
        </linearGradient>
        <radialGradient id="appIconGlow" cx="50" cy="35" r="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#52B788" stopOpacity="0.25" />
          <stop offset="1" stopColor="#14382C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Squircle Background */}
      <rect width="100" height="100" rx="22" fill="url(#appIconBg)" />
      <rect width="100" height="100" rx="22" fill="url(#appIconGlow)" />
      {/* 1px inner border highlight */}
      <rect
        x="1"
        y="1"
        width="98"
        height="98"
        rx="21"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1.5"
      />

      {/* Center Care Circle Mark */}
      <g transform="translate(18, 18)">
        <path
          d="M32 7C45.8 7 57 18.2 57 32C57 44.8 47.4 55.4 35 56.8"
          stroke="#FAF7F2"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <path
          d="M27 56.8C15.8 55.2 7 44.6 7 32C7 19.5 16.1 9.1 28 7.3"
          stroke="#F2CC8F"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <path
          d="M17 31C17 23.5 23 19 28.5 22.5C31 24.2 32 27 32 29"
          stroke="#E07A5F"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <path
          d="M47 31C47 23.5 41 19 35.5 22.5C33 24.2 32 27 32 29"
          stroke="#FAF7F2"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <path
          d="M20 34.5C21 41 26 47 32 49C38 47 43 41 44 34.5"
          stroke="#FAF7F2"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* Center Pill */}
        <rect x="28.5" y="25" width="7" height="14" rx="3.5" fill="rgba(242, 204, 143, 0.4)" stroke="#F2CC8F" strokeWidth="2" />
        <line x1="28.5" y1="32" x2="35.5" y2="32" stroke="#F2CC8F" strokeWidth="1.5" />
      </g>
    </svg>
  );
};

/* =========================================================
   HAND-DRAWN ACCENTS (Scribble underline, circled word, etc.)
   ========================================================= */

/**
 * Organic scribbled underline SVG accent
 */
export const ScribbleUnderline: React.FC<{
  color?: string;
  className?: string;
  width?: number;
}> = ({ color = '#E07A5F', className = '', width = 240 }) => (
  <svg
    width={width}
    height="16"
    viewBox="0 0 240 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    preserveAspectRatio="none"
  >
    <path
      d="M3 11C35 4 80 13 115 8C155 3 195 12 237 9C210 14 170 12 140 14C105 16 70 13 4 14"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Hand-drawn imperfect circled word highlight
 */
export const CircledHighlight: React.FC<{
  children: React.ReactNode;
  color?: string;
  className?: string;
}> = ({ children, color = '#2D6A4F', className = '' }) => (
  <span className={`relative inline-block ${className}`}>
    <span className="relative z-10">{children}</span>
    <svg
      viewBox="0 0 160 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute -inset-x-3 -inset-y-2 w-[calc(100%+24px)] h-[calc(100%+16px)] pointer-events-none z-0"
      preserveAspectRatio="none"
    >
      <path
        d="M18 24C15 10 32 4 75 4C125 4 154 9 155 24C156 42 120 50 68 50C25 50 5 43 5 28C5 18 16 12 36 9"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="400"
        className="opacity-80"
      />
    </svg>
  </span>
);

/**
 * Subtle paper grain texture overlay using inline SVG feTurbulence
 * (Zero external image file dependencies)
 */
export const PaperGrainOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.035 }) => (
  <div
    className="fixed inset-0 pointer-events-none z-40 mix-blend-multiply"
    style={{ opacity }}
    aria-hidden="true"
  >
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <filter id="carecircle-paper-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#carecircle-paper-grain)" />
    </svg>
  </div>
);
