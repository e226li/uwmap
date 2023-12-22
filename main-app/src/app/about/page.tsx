"use client"

import NavigationBar from "../_components/navigation-bar";
import Image from 'next/image'
import { Suspense, useEffect, useState } from "react";

function getAge(now: Date): number {
  const hours = 1000 * 60 * 60;

  const date1 = new Date("2023-10-30");
  const date2 = now;
  const timeDiff = date2.getTime() - date1.getTime();
  let diff = timeDiff / hours;
  diff = parseFloat((Math.round(diff * 1000000000) / 1000000000).toFixed(7));
  return diff;
}

export default function Home() {

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const formatter = new Intl.NumberFormat('en-US', { 
    minimumFractionDigits: 6,
    useGrouping: false
  })

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden">
        <NavigationBar />
        <div className="my-auto h-[80vh] flex flex-col justify-center items-center gap-3">
            <div className="flex md:flex-row flex-col gap-10 justify-center items-center">
              <Image 
                className="w-auto h-auto scale-75 md:scale-100"
                src="/logo.webp"
                alt="UW Map Logo"
                width={200}
                height={200}
                priority={true}
              />
              <div className="gap-3 flex flex-col justify-center text-center md:text-left md:justify-start mt-[-50px] md:mt-0">
                <div className="flex flex-row items-center gap-[4px] justify-center md:justify-start">
                    <div className="font-semibold md:text-8xl text-6xl">UW</div>
                    <div className="font-semibold md:text-8xl text-6xl bg-clip-text text-transparent bg-gradient-to-br from-lightblue to-blue-500">Map</div>
                </div>
                <h2 className="md:text-2xl text-lg font-semibold">A modern map for a modern campus.</h2>
              </div>
            </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-2 text-[11px] md:text-lg">
          <div>A project</div>
          <code className="font-mono bg-clip-text text-transparent bg-gradient-to-br from-lightblue to-blue-500">
            <Suspense fallback={null}>{formatter.format(getAge(time))}</Suspense>
          </code>
          <div>hours in the making, made by</div>
        </div>
        <div className="flex flex-row justify-center items-center text-[10px] md:text-lg md:gap-2 gap-1">
          <div>Anthony Chen,</div>
          <div>Christine Li,</div>
          <div>Eric Li,</div>
          <div>Alex Starosta,</div>
          <div>and Elizabeth Xiong</div>
        </div>
    </div>
  )
}
    