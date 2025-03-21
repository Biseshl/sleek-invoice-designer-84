
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  className,
  variant = 'default',
  size = 'default',
  children,
  icon,
  ...props
}) => {
  return (
    <Button
      variant={variant === 'primary' ? 'default' : variant}
      size={size}
      className={cn(
        'relative overflow-hidden transition-all duration-300 ease-out active:scale-[0.98]',
        'before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        variant === 'primary' && 'bg-primary hover:bg-primary/90 text-white shadow-md',
        icon && 'flex items-center gap-1.5',
        className
      )}
      {...props}
    >
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </Button>
  );
};

export default AnimatedButton;
