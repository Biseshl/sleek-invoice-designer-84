
import * as React from "react";

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };
    
    // Initial check
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return !!isMobile;
}

export function useBreakpoint(breakpoint: Breakpoint) {
  const [isAboveBreakpoint, setIsAboveBreakpoint] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const checkBreakpoint = () => {
      setIsAboveBreakpoint(window.innerWidth >= BREAKPOINTS[breakpoint]);
    };

    // Initial check
    checkBreakpoint();

    // Add listener for window resize
    window.addEventListener('resize', checkBreakpoint);

    // Cleanup
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [breakpoint]);

  return isAboveBreakpoint;
}

/**
 * Hook to detect current active breakpoint
 * @returns The current active breakpoint: 'sm', 'md', 'lg', 'xl', or '2xl'
 */
export function useActiveBreakpoint() {
  const [activeBreakpoint, setActiveBreakpoint] = React.useState<Breakpoint>('sm');

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= BREAKPOINTS['2xl']) {
        setActiveBreakpoint('2xl');
      } else if (width >= BREAKPOINTS.xl) {
        setActiveBreakpoint('xl');
      } else if (width >= BREAKPOINTS.lg) {
        setActiveBreakpoint('lg');
      } else if (width >= BREAKPOINTS.md) {
        setActiveBreakpoint('md');
      } else {
        setActiveBreakpoint('sm');
      }
    };

    // Initial check
    checkBreakpoint();

    // Add listener for window resize
    window.addEventListener('resize', checkBreakpoint);

    // Cleanup
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return activeBreakpoint;
}
