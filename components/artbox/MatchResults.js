'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function MatchResults({ matches }) {
  const t = useTranslations('artbox_discover')

  if (!matches?.length) {
    return (
      <p className="text-center text-gray-500 py-8">
        {t('no_matches')}
      </p>
    )
  }

  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {matches.map((match, index) => (
        <div
          key={match.id}
          className="bg-white rounded-lg overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="relative aspect-square">
            <Image
              src={`${directusUrl}/assets/${match.image.id}`}
              alt={match.title || t('artwork')}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg">{match.title}</h3>
            <p className="text-sm text-gray-500">{match.artist}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
