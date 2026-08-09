import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  container?: boolean
}

export function Section({ 
  className, 
  children, 
  container = true,
  ...props 
}: SectionProps) {
  return (
    <section
      className={cn("py-24 md:py-32", className)}
      {...props}
    >
      {container ? (
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {children}
        </div>
      ) : children}
    </section>
  )
}
