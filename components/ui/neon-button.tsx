'use client'

import React from 'react'

interface NeonButtonProps {
  href: string
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
  onClick?: () => void
}

/**
 * HEBS premium neon CTA button.
 * Provides gold/pink glow on hover against a white pill base.
 * All sizing, display, and spacing must be passed via className.
 */
export default function NeonButton({
  href,
  children,
  className = '',
  target = '_blank',
  rel = 'noopener noreferrer',
  onClick,
}: NeonButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center whitespace-nowrap',
        'rounded-full bg-white text-black font-sans font-medium tracking-wide',
        'transition-all duration-300 ease-out',
        'hover:shadow-[0_0_14px_rgba(212,175,55,0.5),0_0_28px_rgba(233,30,140,0.22)]',
        'hover:scale-[1.02] active:scale-[0.98]',
        'touch-manipulation select-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </a>
  )
}
