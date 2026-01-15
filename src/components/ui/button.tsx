'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded font-semibold transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variants
          variant === 'default' && 'btn',
          variant === 'primary' && 'btn btn-primary',
          variant === 'secondary' && 'btn btn-secondary',
          variant === 'ghost' && 'hover:bg-background-elevated hover:text-foreground',
          // Sizes
          size === 'default' && 'px-4 py-2 text-xs tracking-wider uppercase',
          size === 'sm' && 'px-3 py-1.5 text-xs',
          size === 'lg' && 'px-6 py-3 text-sm',
          size === 'icon' && 'h-10 w-10',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
