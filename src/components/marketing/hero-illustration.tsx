import React from 'react';

export function HeroIllustration() {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 md:right-12 lg:right-20 pointer-events-none select-none">
      <div className="relative h-48 w-48 rotate-45 transform opacity-15 sm:h-64 sm:w-64 md:h-80 md:w-80 lg:h-96 lg:w-96">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full text-white filter drop-shadow-[0_20px_50px_rgba(255,255,255,0.3)]"
        >
          <path
            d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l8 2.5z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
