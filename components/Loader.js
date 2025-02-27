import Image from "next/image";
import {Link} from '@/i18n/navigation';;


export default function Loader({loading, text, className}) {
  
  return (
    <div className="inline-flex gap-2 animate-pulse">
      <div className={`${className} animate-spin-slow`}>
        <Image 
          src="/shapes/loader.png" 
          height={150}
          width={150}
          alt="Loading"
        />
      </div>
      {text && <p className="">{text}</p>}
    </div>
  )
}
