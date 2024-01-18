"use client"

import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '../config/site';
import { FaGithub } from "react-icons/fa";

export default function NavigationBar() {

    const reloadPage = () => {
        window.location.reload()
    }

    const pages = siteConfig.pages;

    return (
        <div className="h-[60px] w-full bg-darkdarkbg relative z-[50]">
            <div className="flex flex-row items-center justify-between h-full w-full">
                <div className="flex flex-row items-center gap-5 ml-6">
                    <Link href="/" onClick={reloadPage} className='max-sm:hidden' >
                        <Image 
                            src="/logo.webp"
                            alt="UW Map Logo"
                            width={44}
                            height={44}
                            priority={true}
                            style={{width: 'auto', height: 'auto'}}
                        />
                    </Link>
                    <div className="flex flex-row items-center gap-[4px] cursor-default font-bold text-xl">
                        <div>UW</div>
                        <div className="bg-clip-text text-transparent bg-gradient-to-br from-lightblue to-blue-500 gradient-wipe hover:gradient-wipe-fast">Map</div>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-5 max-sm:gap-3 h-full mr-6">
                    {
                        pages.map((page, index) => {
                            if (page.name === "Code") {
                                return (
                                    <Link href={page.link} key={index} target='_blank'>
                                        <FaGithub className="h-5 w-5 hover:fill-neutral-400 transition-all cursor-pointer" />
                                    </Link>
                                )
                            } else {
                                return (
                                    <Link href={page.link} key={index}>
                                        <div className="text-[15px] font-semibold hover:text-neutral-400 transition-all cursor-pointer">{page.name}</div>
                                    </Link>
                                )
                            }
                        })
                    }
                </div>
            </div>
        </div>
    )
}