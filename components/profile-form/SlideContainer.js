export default function SlideContainer({ children, title, description }) {
  return (
    <div className="mb-6">
        <label className="block text-2xl font-semibold mb-4 text-center">
            {title}
        </label>
        {description && (
            <p className="mb-6 block text-lg text-center italic">{description}</p>
        )}
        {children}
    </div>
  )
}