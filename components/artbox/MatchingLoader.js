'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function MatchingLoader() {
  const t = useTranslations('artbox_discover')
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '.' : prev + '.'))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
      <div className="animate-spin-slow">
        <Image
          src="/shapes/loader.png"
          height={140}
          width={140}
          alt="Loading"
        />
      </div>
      <p className="text-2xl text-gray-600 font-title italic">
        {t('matching_loader')}{dots}
      </p>
    </div>
  )
}
