import Image from "next/image";


export default function ImageWithCaption({image, className, ...props}) {
  
  return (
    <div className="w-full">
      <Image
        className={`${className}`}
        src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${image.id}`}
        width={image.width}
        height={image.height}
        alt={image.description || ""}
        {...props}
      />
      {image.description && <p className="py-3 text-slate-500">{image.description}</p>}
    </div>
  )
}
