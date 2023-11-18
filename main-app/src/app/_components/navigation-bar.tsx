import Image from 'next/image'
import Link from 'next/link'

export default function NavigationBar(current: any) {

    const pages = [
        { name: "Live Map", link: "/" },
        { name: "Archive", link: "/archive" },
        { name: "About", link: "/about" },
    ]

    return (
        <div className="h-[60px] w-full">
            <div className="flex flex-row items-center justify-between h-full w-full">
                <div className="flex flex-row items-center gap-5 ml-6">
                    <div className="font-semibold text-xl">UW Map</div>
                </div>
                <div className="flex flex-row items-center gap-5 mr-6">
                    {
                        pages.map((page, index) => {
                            return (
                                <Link href={page.link} key={index}>
                                    <div className="text-sm">{page.name}</div>
                                    {page.name == current &&
                                        <div className="border-b-2 border-black">Hello</div>
                                    }
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}