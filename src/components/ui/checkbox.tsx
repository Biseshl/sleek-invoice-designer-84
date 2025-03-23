
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    indeterminate?: boolean
  }
>(({ className, indeterminate, ...props }, ref) => {
  const innerRef = React.useRef<React.ElementRef<typeof CheckboxPrimitive.Root>>(null)
  
  React.useEffect(() => {
    if (innerRef.current) {
      // @ts-ignore - 'indeterminate' is a valid DOM property but not in TypeScript's HTMLInputElement type
      innerRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])
  
  return (
    <CheckboxPrimitive.Root
      ref={(node) => {
        // Handle both refs
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
        innerRef.current = node
      }}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        {indeterminate ? (
          <Minus className="h-4 w-4" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
