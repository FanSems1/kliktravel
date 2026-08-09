import * as React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  variant?: "editorial" | "utility" | "display"
}

export function Heading({ 
  className, 
  as: Component = "h2", 
  variant = "editorial", 
  ...props 
}: HeadingProps) {
  return (
    <Component
      className={cn(
        variant === "editorial" && "font-serif tracking-tight",
        variant === "utility" && "font-sans uppercase tracking-widest text-sm font-medium text-foreground/80",
        variant === "display" && "font-serif text-5xl md:text-7xl lg:text-[10rem] leading-none tracking-tighter",
        className
      )}
      {...props}
    />
  )
}
