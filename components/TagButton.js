import { CheckIcon } from '@heroicons/react/24/solid'

export default function TagButton({ tag, isSelected, onClick=null }) {
  const clickable = Boolean(onClick)
  return (
    <button className={`${isSelected ? 'bg-dark text-white' : ''} border border-dark px-2 inline-flex nowrap items-center`} onClick={onClick} disabled={!clickable}>
      {
        clickable && 
        <>
        { isSelected ? (
            <span className="h-4 w-4 rounded-full bg-orange border border-white mr-1" />
          ) : (
            <span className="h-4 w-4 rounded-full border border-dark mr-1" /> 
          )
        }
        </>
      }
      <span className="">{tag.name}</span>
    </button>
  )
}
