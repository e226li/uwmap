import Image from "next/image"

export default function NotFound() {
  return (
    <div className="items-center flex flex-col absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <p className="font-bold text-9xl">404</p>
        <p className="font-bold text-xl mb-8">Honk Honk! Could not find requested resource</p>
        <Image 
            src="/honk.webp"
            alt="404"
            width={400}
            height={400}
            priority={true}
            style={{width: 'auto', height: 'auto'}}
        />
    </div>
  )
}