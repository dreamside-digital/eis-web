import {useTranslations} from 'next-intl';

export default function TagButton({ tag, isSelected, onClick=null }) {
  const clickable = Boolean(onClick)
  const t = useTranslations('tags')

  if (clickable) {
    return (
      <button className={`${isSelected ? 'bg-dark text-white' : 'bg-white text-dark'} hover:bg-highlight border border-dark px-2 inline-flex nowrap items-center`} onClick={onClick}>
        <span className="">{t(tag.slug)}</span>
      </button>
    )
  } else {
    return (
      <button className={`border border-dark px-2 inline-flex nowrap items-center`} disabled={true}>
        <span className="">{t(tag.slug)}</span>
      </button>
    )
  }
}
