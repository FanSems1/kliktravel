import * as React from "react"
import { cn } from "@/lib/utils"

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "div"
  variant?: "base" | "large" | "small" | "caption" | "price"
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
        variant === "base" && "typography-body",
        variant === "large" && "typography-package-title",
        variant === "small" && "typography-body text-slate-500/80 !text-xs",
        variant === "caption" && "typography-caption",
        variant === "price" && "typography-price",
        balance && "text-balance",
        className
      )}
      {...props}
    />
  )
}
