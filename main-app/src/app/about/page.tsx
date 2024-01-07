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
                className="w-auto h-auto scale-75 mb-10 md:scale-100 md:mb-0 fade-in max-[360px]:px-10"
                src="/logo.webp"
                alt="UW Map Logo"
                width={200}
                height={200}
                priority={true}
                style={{'--order': '1'} as React.CSSProperties}
              />
              <div className="gap-3 flex flex-col justify-center text-center md:text-left md:justify-start mt-[-50px] md:mt-0">
                <div className="flex flex-row items-center gap-[4px] justify-center md:justify-start fade-in" style={{"--order": "2"} as React.CSSProperties}>
                    <div className="font-semibold md:text-8xl text-6xl">UW</div>
                    <div className="font-semibold md:text-8xl text-6xl bg-clip-text text-transparent bg-gradient-to-br from-lightblue to-blue-500 gradient-wipe hover:gradient-wipe-fast">Map</div>
                </div>
                <h2 className="md:text-2xl text-lg font-semibold fade-in" style={{"--order": "3"} as React.CSSProperties}>A modern map for a modern campus.</h2>
              </div>
            </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-2 text-[11px] md:text-lg fade-in max-[360px]:text-[10px]" style={{"--order": "4"} as React.CSSProperties}>
          <div>A project</div>
          <code className="font-mono bg-clip-text text-transparent bg-gradient-to-br from-lightblue to-blue-500 ">
            <Suspense fallback={null}>{formatter.format(getAge(time))}</Suspense>
          </code>
          <div>hours in the making, made by</div>
        </div>
        <div className="flex flex-row justify-center items-center text-[10px] md:text-lg md:gap-[4px] gap-[2px] max-[360px]:text-[8px] ">
          <div className="fade-in" style={{"--order": "5"} as React.CSSProperties}>Anthony Chen,</div>
          <div className="fade-in" style={{"--order": "6"} as React.CSSProperties}>Christine Li,</div>
          <div className="fade-in" style={{"--order": "7"} as React.CSSProperties}>Eric Li,</div>
          <div className="fade-in" style={{"--order": "8"} as React.CSSProperties}>Alex Starosta,</div>
          <div className="fade-in" style={{"--order": "9"} as React.CSSProperties}>and</div>
          <div className="fade-in" style={{"--order": "10"} as React.CSSProperties}> Elizabeth Xiong</div>
        </div>
    </div>
  )
}
    