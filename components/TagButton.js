export default function TagButton({ tag, isSelected, onClick=null }) {
  const clickable = Boolean(onClick)

  if (clickable) {
    return (
      <button className={`${isSelected ? 'bg-dark text-white' : ''} ${(isSelected) ? 'hover:bg-highlight' : 'hover:bg-primary'} border border-dark px-2 inline-flex nowrap items-center`} onClick={onClick}>
        { isSelected ? (
            <span className="h-4 w-4 rounded-full bg-orange border border-white mr-1" />
          ) : (
            <span className="h-4 w-4 rounded-full border border-dark bg-white mr-1" /> 
          )
        }
        <span className="">{tag.name}</span>
      </button>
    )
  } else {
    return (
      <button className={`border border-dark px-2 inline-flex nowrap items-center`} disabled={true}>
        <span className="">{tag.name}</span>
      </button>
    )
  }
}
