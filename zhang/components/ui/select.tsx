'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// Lightweight replacement for Radix Select used only to avoid pulling @radix-ui
// into server bundles during trouble-shooting. This provides the same named
// exports with a simple native <select>-based implementation.

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  value?: string
  onValueChange?: (v: string) => void
}

export function Select({ value, onValueChange, children, className, ...rest }: SelectProps) {
  // Render a visible native select. The children should be SelectItem elements.
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange?.(e.target.value)
  }

  return (
    <select
      data-slot="select"
      className={cn('w-full rounded-md border px-3 py-2 text-sm', className)}
      value={value}
      onChange={handleChange}
      {...rest}
    >
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return null
        // If child is a SelectItem, render it as an <option>
        // We detect by displayName which SelectItem sets below.
        const type = child.type as any
        if (type && type.displayName === 'SelectItem') {
          const props: any = child.props
          return <option value={props.value}>{props.children}</option>
        }
        return null
      })}
    </select>
  )
}

export const SelectTrigger: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div data-slot="select-trigger" className={cn('', className)} {...rest}>
      {children}
    </div>
  )
}

export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  return <>{children}</>
}

export const SelectValue: React.FC = () => null

type SelectItemProps = { value: string; children?: React.ReactNode }
const SelectItem: React.FC<SelectItemProps> = ({ children }) => {
  return <>{children}</>
}
SelectItem.displayName = 'SelectItem'

export { SelectItem as SelectItem, SelectItem as SelectLabel }

export const SelectGroup = ({ children }: { children?: React.ReactNode }) => <>{children}</>

export const SelectSeparator = ({ className }: { className?: string }) => (
  <div className={cn('h-px bg-border my-1', className)} />
)

export const SelectScrollUpButton = () => null
export const SelectScrollDownButton = () => null

// Named exports already declared above; no additional re-export needed.
