import * as React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  variant?: "display" | "editorial" | "utility" | "card"
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
        variant === "display" && "typography-hero",
        variant === "editorial" && "typography-section",
        variant === "utility" && "typography-caption",
        variant === "card" && "typography-card",
        className
      )}
      {...props}
    />
  )
}
