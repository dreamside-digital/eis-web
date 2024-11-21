export default function TagButton({ tag, isSelected, onClick=null }) {
  const clickable = Boolean(onClick)

  if (clickable) {
    return (
      <button className={`${isSelected ? 'bg-dark text-white' : 'bg-white text-dark'} hover:bg-primary border border-dark px-2 inline-flex nowrap items-center`} onClick={onClick}>
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
