import * as React from 'react';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 'bg-[#1351B4] text-white hover:bg-[#5985CA]',
        destructive:
          'bg-transparent border border-red-600 text-red-600 hover:bg-red-100 focus-visible:ring-red-500',
        outline:
          'border border-[#1351B4] bg-white text-[#1351B4] hover:bg-[#D9E3F3]',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'bg-transparent text-[#1351B4] hover:bg-[#D9E3F3]',
        link: 'text-[#1351B4] underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-lg',
        icon: 'size-9'
      },
      shape: {
        default: '',
        pill: '',
        square: 'rounded-none'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'default'
    }
  }
);

function Button({
  className,
  variant,
  size,
  shape,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
