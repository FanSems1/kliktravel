import * as React from "react"
import { cn } from "@/lib/utils"

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "div"
  variant?: "base" | "large" | "small" | "caption"
  balance?: boolean
}

export function Text({ 
  className, 
  as: Component = "p", 
  variant = "base", 
  balance = false,
  ...props 
}: TextProps) {
  return (
    <Component
      className={cn(
        "font-sans",
        variant === "base" && "text-base leading-relaxed text-foreground/80",
        variant === "large" && "text-lg md:text-2xl md:leading-relaxed text-foreground",
        variant === "small" && "text-sm leading-relaxed text-foreground/70",
        variant === "caption" && "text-xs tracking-widest uppercase text-foreground/50 font-medium",
        balance && "text-balance",
        className
      )}
      {...props}
    />
  )
}
