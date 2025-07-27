'use client'

import { useEffect } from 'react'
import Hotjar from '@hotjar/browser'

const siteId = 6476280
const hotjarVersion = 6

export default function HotjarComponent() {
  useEffect(() => {
    // Initialize Hotjar only on the client side
    if (typeof window !== 'undefined') {
      try {
        Hotjar.init(siteId, hotjarVersion)
        console.log('Hotjar initialized successfully')
      } catch (error) {
        console.error('Failed to initialize Hotjar:', error)
      }
    }
  }, [])

  return null
} 