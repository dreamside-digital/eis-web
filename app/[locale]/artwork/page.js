import { getUserArtworks } from '@/lib/data-access'
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import { getUser } from '@/lib/auth/session'
import {redirect} from 'next/navigation';
import Image from 'next/image'
import { PencilIcon } from '@heroicons/react/24/solid'

const statusColors = {
  'draft': 'border-slate-200',
  'review': 'border-lavendar',
  'private': 'border-beige',
  'published': 'border-medium'
}

const statusColorsBg = {
  'draft': 'bg-slate-200',
  'review': 'bg-lavendar',
  'private': 'bg-beige',
  'published': 'bg-medium'
}

export default async function ArtworkListPage({params}) {
  const {locale} = await params;
  const user = await getUser()
  if (!user) {
    redirect(`/${locale}/login`)
  }
  const artworks = await getUserArtworks()
  const t = await getTranslations('account_page');

  return (
    <>
      <section className="text-dark p-6 py-12 pt-20 relative">
        <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-2/3 w-full">
        </div>
        <div className="container max-w-screen-lg mx-auto relative">
          <div className="p-6 bg-beige text-dark">
            <h1 className="uppercase text-3xl mb-4 md:mb-6 font-medium">My Artwork</h1>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'} uploaded
              </p>
              <Link href="/artwork/new" className="btn">
                Upload New Artwork
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="text-dark relative p-6">
        <div className="container max-w-screen-lg mx-auto">
          {artworks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven&apos;t uploaded any artwork yet.</p>
              <Link href="/artwork/new" className="btn">
                Upload Your First Artwork
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {artworks.map(artwork => {
                const borderColor = statusColors[artwork.status]
                const bbColor = statusColorsBg[artwork.status]

                return (
                  <div key={artwork.id} className={`border-2 ${borderColor} bg-white text-dark relative flex flex-col`}>
                    {/* Status Header */}
                    <div className={`${bbColor} text-dark px-6 py-2 uppercase font-medium text-sm`}>
                      <span>{t(artwork.status)}</span>
                    </div>

                    {/* Artwork Image */}
                    {artwork.images && artwork.images.length > 0 ? (
                      <Image
                        className="relative w-full h-auto aspect-video object-cover"
                        src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${artwork.images[0].id}`}
                        alt={artwork.title}
                        width={500}
                        height={500}
                      />
                    ) : (
                      <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}

                    {/* Artwork Details */}
                    <div className="p-6 flex flex-col flex-auto justify-between">
                      <div>
                        <h1 className="font-title text-xl mb-4">
                          {artwork.title}
                        </h1>

                        <div className="mb-4">
                          <div className="space-y-1 text-sm">
                            <p className="mb-0"><span className="font-medium">Medium:</span> {artwork.medium}</p>
                            <p className="mb-0"><span className="font-medium">Type:</span> {artwork.type}</p>
                            {artwork.year_created && (
                              <p className="mb-0"><span className="font-medium">Year:</span> {artwork.year_created}</p>
                            )}
                            {artwork.width && artwork.height && (
                              <p className="mb-0"><span className="font-medium">Dimensions:</span> {artwork.width}&quot; × {artwork.height}&quot;
                                {artwork.depth && ` × ${artwork.depth}"`}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-1 border pt-4 border-l-0 border-r-0 border-b-0">
                        <div>
                          <Link
                            className="inline-flex gap-1 text-sm btn grow-0"
                            href={`/artwork/${artwork.id}/edit`}
                            aria-label="Edit artwork"
                          >
                            <PencilIcon className="w-4 h-4" />
                            {t("edit")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
