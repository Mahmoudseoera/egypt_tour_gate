'use client'

import { useEffect } from 'react'
import { useScrollAnimation } from '../lib/hooks/useScrollAnimation';

export default function Providers({ children }: { children: React.ReactNode }) {
  useScrollAnimation()
  useEffect(() => {
    const removeAttributes = () => {
      const html = document.documentElement
      if (html.hasAttribute('cz-shortcut-listen')) {
        html.removeAttribute('cz-shortcut-listen')
      }
    }

    removeAttributes()

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'cz-shortcut-listen') {
          removeAttributes()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['cz-shortcut-listen']
    })

    return () => observer.disconnect()
  }, [])

  return <>{children}</>
} 