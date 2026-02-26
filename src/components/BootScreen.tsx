import { useState, useEffect, useRef, useCallback } from 'react';

interface BootScreenProps {
  onComplete: () => void;
}

type BootPhase = 'black' | 'logo-in' | 'progress' | 'filling' | 'done';

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [phase, setPhase] = useState<BootPhase>('black');
  const [progress, setProgress] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(0);
  const [screenBrightness, setScreenBrightness] = useState(0);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Phase sequencing — mimics real Mac boot timing
  useEffect(() => {
    // Phase 1: Pure black (simulates POST/EFI)
    const t1 = setTimeout(() => {
      setPhase('logo-in');
      setScreenBrightness(1);
    }, 600);

    // Phase 2: Logo fades in
    const t2 = setTimeout(() => {
      setLogoOpacity(1);
    }, 900);

    // Phase 3: Progress bar appears
    const t3 = setTimeout(() => {
      setPhase('progress');
    }, 2000);

    // Phase 4: Start filling
    const t4 = setTimeout(() => {
      setPhase('filling');
      startTimeRef.current = performance.now();
    }, 2400);

    return () => {
      [t1, t2, t3, t4].forEach(clearTimeout);
    };
  }, []);

  // Realistic progress simulation using requestAnimationFrame
  const simulateProgress = useCallback(
    (timestamp: number) => {
      if (phase !== 'filling') return;

      const elapsed = timestamp - startTimeRef.current;
      const totalDuration = 3500; // Total boot time in ms

      // Easing function that mimics real boot behavior:
      // Fast at start (kernel), slows in middle (drivers), speeds up at end (loginwindow)
      const t = Math.min(elapsed / totalDuration, 1);

      let easedProgress: number;

      if (t < 0.15) {
        // Fast initial burst (0-20%)
        easedProgress = t * (20 / 0.15);
      } else if (t < 0.4) {
        // Slow crawl through middle (20-45%) — loading extensions
        const segT = (t - 0.15) / 0.25;
        easedProgress = 20 + segT * 25;
        // Add micro-stutters
        if (Math.random() > 0.92) {
          easedProgress -= Math.random() * 2;
        }
      } else if (t < 0.65) {
        // Medium speed (45-70%)
        const segT = (t - 0.4) / 0.25;
        easedProgress = 45 + segT * 25;
      } else if (t < 0.85) {
        // Brief pause/slow zone around 70-85% (loading WindowServer)
        const segT = (t - 0.65) / 0.2;
        easedProgress = 70 + segT * 15;
        // Occasional tiny stutter
        if (Math.random() > 0.95) {
          easedProgress -= Math.random() * 1;
        }
      } else {
        // Fast finish sprint (85-100%)
        const segT = (t - 0.85) / 0.15;
        // Accelerate curve for the final push
        easedProgress = 85 + segT * segT * 15;
      }

      easedProgress = Math.max(progressRef.current, Math.min(easedProgress, 100));
      progressRef.current = easedProgress;
      setProgress(easedProgress);

      if (easedProgress >= 100) {
        // Hold at 100% briefly, then fade
        setTimeout(() => {
          setPhase('done');
          setTimeout(onComplete, 900);
        }, 400);
        return;
      }

      rafRef.current = requestAnimationFrame(simulateProgress);
    },
    [phase, onComplete]
  );

  useEffect(() => {
    if (phase === 'filling') {
      rafRef.current = requestAnimationFrame(simulateProgress);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, simulateProgress]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#000000',
        // Fade to white at the end (like real Mac boot → login screen)
        opacity: phase === 'done' ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* ===== Screen brightness simulation ===== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 45%, rgba(20,20,22,${
            screenBrightness * 0.15
          }) 0%, transparent 70%)`,
          transition: 'all 1s ease-out',
        }}
      />

      {/* ===== Centered Boot Content ===== */}
      <div className="relative flex flex-col items-center">
        {/* Apple Logo */}
        <div
          className="relative"
          style={{
            opacity: logoOpacity,
            transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `scale(${logoOpacity === 1 ? 1 : 0.95})`,
          }}
        >
          {/* Logo glow/bloom effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              filter: 'blur(30px)',
              opacity: phase === 'filling' || phase === 'progress' ? 0.08 : 0,
              transition: 'opacity 2s ease',
            }}
          >
            <svg width="80" height="96" viewBox="0 0 56 56" fill="white">
              <path d="M42.5 18.7c-.3.2-5.5 3.2-5.5 9.7 0 7.6 6.7 10.3 6.9 10.3-.1.2-1.1 3.6-3.5 7.2-2.2 3.2-4.5 6.3-8 6.3s-4.4-2-8.4-2c-3.9 0-5.3 2.1-8.5 2.1s-5.5-2.9-7.9-6.5C4.7 41 2.5 35 2.5 29.3c0-9.2 6-14.1 11.9-14.1 3.1 0 5.7 2.1 7.7 2.1 1.8 0 4.8-2.2 8.3-2.2 1.5 0 6.7.1 10.1 5.6zM34.4 10c1.6-1.9 2.8-4.6 2.8-7.3 0-.4 0-.7-.1-1-2.7.1-5.8 1.8-7.7 4-1.5 1.7-2.9 4.4-2.9 7.1 0 .4.1.8.1.9.2 0 .4.1.6.1 2.4 0 5.4-1.6 7.2-3.8z" />
            </svg>
          </div>

          {/* Main logo */}
          <svg
            width="80"
            height="96"
            viewBox="0 0 56 56"
            fill="none"
            className="relative z-10"
          >
            <path
              d="M42.5 18.7c-.3.2-5.5 3.2-5.5 9.7 0 7.6 6.7 10.3 6.9 10.3-.1.2-1.1 3.6-3.5 7.2-2.2 3.2-4.5 6.3-8 6.3s-4.4-2-8.4-2c-3.9 0-5.3 2.1-8.5 2.1s-5.5-2.9-7.9-6.5C4.7 41 2.5 35 2.5 29.3c0-9.2 6-14.1 11.9-14.1 3.1 0 5.7 2.1 7.7 2.1 1.8 0 4.8-2.2 8.3-2.2 1.5 0 6.7.1 10.1 5.6zM34.4 10c1.6-1.9 2.8-4.6 2.8-7.3 0-.4 0-.7-.1-1-2.7.1-5.8 1.8-7.7 4-1.5 1.7-2.9 4.4-2.9 7.1 0 .4.1.8.1.9.2 0 .4.1.6.1 2.4 0 5.4-1.6 7.2-3.8z"
              fill="white"
              style={{
                filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.3))',
              }}
            />
          </svg>
        </div>

        {/* ===== Progress Bar ===== */}
        <div
          className="mt-[52px] flex flex-col items-center"
          style={{
            opacity:
              phase === 'progress' || phase === 'filling' ? 1 : 0,
            transform: `translateY(${
              phase === 'progress' || phase === 'filling' ? 0 : 6
            }px)`,
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* Progress bar track */}
          <div
            className="relative overflow-hidden"
            style={{
              width: '216px',
              height: '5px',
              borderRadius: '100px',
              background: 'rgba(255,255,255,0.12)',
              boxShadow:
                'inset 0 0.5px 1px rgba(0,0,0,0.4), 0 0.5px 0 rgba(255,255,255,0.03)',
            }}
          >
            {/* Progress fill */}
            <div
              className="absolute top-0 left-0 h-full"
              style={{
                width: `${progress}%`,
                borderRadius: '100px',
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.95) 100%)',
                boxShadow: '0 0 8px rgba(255,255,255,0.15)',
                transition: 'width 50ms linear',
              }}
            >
              {/* Subtle shine on the fill */}
              <div
                className="absolute inset-0"
                style={{
                  borderRadius: '100px',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 60%)',
                }}
              />

              {/* Leading edge glow */}
              <div
                className="absolute top-[-2px] right-[-1px] bottom-[-2px] w-[12px]"
                style={{
                  background:
                    'radial-gradient(ellipse at right center, rgba(255,255,255,0.2), transparent 70%)',
                  opacity: progress < 100 ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
              />
            </div>

            {/* Track inner highlight */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: '100px',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
              }}
            />
          </div>

          {/* Loading text (appears after a delay, subtle) */}
          <div
            className="mt-6 text-center"
            style={{
              opacity: progress > 30 ? 0.25 : 0,
              transition: 'opacity 1s ease',
            }}
          >
            <p
              className="text-[10.5px] text-white font-light tracking-[0.04em]"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >
              {progress < 40
                ? 'Loading Portfolio...'
                : progress < 70
                  ? 'Starting services...'
                  : progress < 90
                    ? 'Preparing Experience...'
                    : 'Almost ready...'}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Very subtle screen edge vignette ===== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 150px 50px rgba(0,0,0,0.4)',
        }}
      />

      {/* ===== Bottom "keyboard backlight" ambient ===== */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '60%',
          height: '200px',
          background:
            'radial-gradient(ellipse at center bottom, rgba(255,255,255,0.015) 0%, transparent 70%)',
          opacity: screenBrightness,
          transition: 'opacity 2s ease',
        }}
      />

      {/* ===== Completion flash ===== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'white',
          opacity: phase === 'done' ? 0.03 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
    </div>
  );
};

export default BootScreen;