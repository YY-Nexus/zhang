'use client'

import * as React from 'react'

// Minimal, robust RadioGroup used as a temporary safe fallback during build
// investigation. Avoids using Context or other APIs that could be affected
// during server-side prerendering in this repo's build environment.

type RadioGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string
  defaultValue?: string
  onValueChange?: (v: string) => void
}

export function RadioGroup({
  children,
  className,
  value,
  onValueChange,
  ...rest
}: RadioGroupProps) {
  return (
    <div data-slot="radio-group" className={className} {...rest}>
      {children}
    </div>
  )
}

type RadioGroupItemProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  value?: string
  checked?: boolean
}

export function RadioGroupItem({
  value,
  className,
  children,
  checked,
  ...rest
}: RadioGroupItemProps) {
  return (
    <label className={className} {...rest}>
      <input type="radio" value={value} defaultChecked={checked} />
      <span>{children}</span>
    </label>
  )
}

export default RadioGroup
