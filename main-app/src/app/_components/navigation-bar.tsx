import Image from 'next/image'
import Link from 'next/link'

export default function NavigationBar() {

    const pages = [
        { name: "Map", link: "/" },
        { name: "About", link: "/about" },
        { name: "Code", link: "https://github.com/e226li/uwmap" },
    ]

    return (
        <div className="h-[60px] w-full">
            <div className="flex flex-row items-center justify-between h-full w-full">
                <div className="flex flex-row items-center gap-5 ml-6">
                    <Image 
                        className="w-auto h-auto"
                        src="/logo.webp"
                        alt="UW Map Logo"
                        width={40}
                        height={40}
                        priority={true}
                    />
                    <div className="flex flex-row items-center gap-[4px]">
                        <div className="font-semibold text-xl">UW</div>
                        <div className="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-br from-lightblue to-blue-500">Map</div>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-5 mr-6">
                    {
                        pages.map((page, index) => {
                            return (
                                <Link href={page.link} key={index}>
                                    <div className="text-sm">{page.name}</div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}