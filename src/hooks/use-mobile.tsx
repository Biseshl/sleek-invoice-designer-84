
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
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < BREAKPOINTS.md : false
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Set initial value
    setIsMobile(window.innerWidth < BREAKPOINTS.md);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };
    
    // Add listener for window resize with debounce for performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', debouncedResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
}

export function useBreakpoint(breakpoint: Breakpoint) {
  const [isAboveBreakpoint, setIsAboveBreakpoint] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth >= BREAKPOINTS[breakpoint] : false
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Set initial value
    setIsAboveBreakpoint(window.innerWidth >= BREAKPOINTS[breakpoint]);
    
    const checkBreakpoint = () => {
      setIsAboveBreakpoint(window.innerWidth >= BREAKPOINTS[breakpoint]);
    };

    // Add listener for window resize with debounce
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkBreakpoint, 100);
    };

    window.addEventListener('resize', debouncedResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
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
    if (typeof window === 'undefined') return;
    
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

    // Add listener for window resize with debounce
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkBreakpoint, 100);
    };
    
    window.addEventListener('resize', debouncedResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return activeBreakpoint;
}
