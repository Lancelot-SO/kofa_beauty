import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] rounded-full font-bold tracking-[0.2em] transition-all duration-300 uppercase shadow-lg shadow-black/5 font-megante",
        "premium-dark": "bg-black text-white hover:bg-neutral-900 hover:scale-[1.02] active:scale-[0.98] rounded-full font-bold tracking-[0.2em] transition-all duration-300 uppercase shadow-lg shadow-black/20 border border-white/10 font-megante",
        "premium-outline": "bg-transparent text-white border border-white/30 hover:bg-white hover:text-black hover:border-white rounded-full font-bold tracking-[0.2em] transition-all duration-300 uppercase font-megante",
        "premium-outline-dark": "bg-transparent text-black border border-black/30 hover:bg-black hover:text-white hover:border-black rounded-full font-bold tracking-[0.2em] transition-all duration-300 uppercase font-megante",
      },
      size: {
        default: "h-11 px-6 px-10 py-6",
        xs: "h-8 gap-1 rounded-full px-3 text-[10px] has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 rounded-full gap-1.5 px-6 text-[10px] has-[>svg]:px-4",
        lg: "h-14 rounded-full px-12 text-xs has-[>svg]:px-8",
        premium: "h-16 px-12 text-sm",
        icon: "size-10 rounded-full",
        "icon-xs": "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
