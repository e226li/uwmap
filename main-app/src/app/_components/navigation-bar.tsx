import Image from 'next/image'
import Link from 'next/link'

export default function NavigationBar() {

    const pages = [
        { name: "Live Map", link: "/" },
        { name: "About", link: "/about" },
    ]

    return (
        <div className="h-[60px] w-full">
            <div className="flex flex-row items-center justify-between h-full w-full">
                <div className="flex flex-row items-center gap-5 ml-6">
                    <Image 
                        src="/logo.webp"
                        alt="UW Map Logo"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-row items-center gap-[4px]">
                        <div className="font-semibold text-xl">UW</div>
                        <div className="font-semibold text-xl text-[#58a9db]">Map</div>
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