import { useTranslations } from 'next-intl';

export default function Stage6({ profile, setProfile, tags }) {
  const t = useTranslations('profile_form');
  console.log({profile})

  const updateTags = (tag, e) => {
    e.preventDefault()
    const tagIndex = profile.tags.findIndex(t => t.id === tag.id)
    if (tagIndex === -1) {
      setProfile({
        ...profile,
        tags: profile.tags.concat(tag)
      })
    } else {
      const newTags = [...profile.tags]
      newTags.splice(tagIndex,1)
      setProfile({
        ...profile,
        tags: newTags
      })
    }
  }

  return (
    <div className="mb-6">
        <label className="font-semibold mb-1 block" htmlFor="tags">
        {t('tags')}
        </label>
        <div className="flex flex-wrap gap-2">
        {
        tags.map(tag => {
            const selected = profile.tags.findIndex(t => t.tags_id === tag.id)
            return (
                <button key={tag.id} onClick={(e) => updateTags(tag, e)} className={`py-1 px-3 shadow text-sm ${selected >= 0 ? 'bg-highlight text-white' : 'bg-white hover:bg-lavendar'}`}>{tag.name}</button>
            )
        })
        }
        </div>
    </div>
  )
}