import { useEffect, useRef, useState, useCallback } from 'react';

function useCountUp(target, duration, active) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  const startAnimation = useCallback(() => {
    // Cancel any in-progress animation before starting a new one
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out for a smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [target, duration]);

  useEffect(() => {
    if (!active) return;
    startAnimation();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, startAnimation]);

  // Reset if target changes while not yet active
  useEffect(() => {
    if (!active) setCount(0);
  }, [target, active]);

  return count;
}

export default function CharityCounter({
  value,
  label,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const [hasEntered, setHasEntered] = useState(false);
  const containerRef = useRef(null);
  const count = useCountUp(value, 2000, hasEntered);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          // Only fire once — disconnect after triggering
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center text-center ${className}`}
    >
      <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-hex-green tabular-nums leading-none">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </span>
      {label && (
        <span className="mt-2 text-sm font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
