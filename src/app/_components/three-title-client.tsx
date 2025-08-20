'use client';

import dynamic from 'next/dynamic';

const ThreeTitleComponent = dynamic(() => import('./three-title-scene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mb-2">
          BANANDRE
        </h1>
        <p className="text-sm md:text-base text-gray-400 uppercase tracking-wider">
          NO ONE CARES ABOUT CODE
        </p>
      </div>
    </div>
  ),
});

export function ThreeTitle() {
  return <ThreeTitleComponent />;
}