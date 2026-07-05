import { useState } from 'react';
import { cn } from '../lib/utils';

interface MealImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

const COLORS = [
  'from-orange-200 to-amber-200 dark:from-orange-900/40 dark:to-amber-900/40',
  'from-blue-200 to-indigo-200 dark:from-blue-900/40 dark:to-indigo-900/40',
  'from-green-200 to-emerald-200 dark:from-green-900/40 dark:to-emerald-900/40',
  'from-purple-200 to-pink-200 dark:from-purple-900/40 dark:to-pink-900/40',
  'from-red-200 to-rose-200 dark:from-red-900/40 dark:to-rose-900/40',
  'from-teal-200 to-cyan-200 dark:from-teal-900/40 dark:to-cyan-900/40',
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function MealImage({ src, alt, className, wrapperClassName }: MealImageProps) {
  const [error, setError] = useState(false);
  const gradient = getColor(alt);

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName)}>
      {!error ? (
        <img
          src={src}
          alt={alt}
          className={cn('w-full h-full object-cover', className)}
          onError={() => setError(true)}
        />
      ) : null}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-gradient-to-br transition-opacity duration-300',
          gradient,
          error ? 'opacity-100' : 'opacity-0 hover:opacity-100',
        )}
      >
        <span className="text-3xl sm:text-4xl select-none">
          {alt.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
        </span>
      </div>
    </div>
  );
}
