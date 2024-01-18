"use client"

import { useEffect, useState } from 'react';

const RingRoadSvg = (props: import("react").JSX.IntrinsicAttributes & import("react").SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={568.249}
    height={688.11}
    {...props}
  >
    <path
      fill="none"
      stroke="#585b5f"
      strokeMiterlimit={100}
      strokeWidth={4}
      d="M42.613 109.555 256.091 6.608c26.746-8.81 44.858.367 54.201 7.79 4.132 3.281 7.472 7.434 9.924 12.106 8.135 15.501 34.081 64.853 44.24 83.05 36.362 65.14 109.54 139.699 156.045 175.551 43.105 33.232 42.518 41.083 43.346 44.205 1.75 6.6 1.986 13.53 0 27.316 0 0-16.021 35.869-21.673 47.68-9.392 19.626-25.105 33.235-34.421 43.512-34.451 38.002-37.1 49.682-37.1 49.682s-40.54 121.285-57.433 160.38c-4.535 10.494-14.81 29.017-36.844 27.09-96.742-8.458-118.117-113.783-118.117-113.783L239.476 428.99l-29.38-83.2c-5.779-28.777-27.933-33.834-27.933-33.834L55.497 269.091S3 251.753 3 180.473c0-48.162 39.613-70.918 39.613-70.918Z"
    />
  </svg>
)

export default function RingRoadAnimation() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  return (
    <>
        <RingRoadSvg className={`absolute z-[20] ring-road scale-[1.13] ${isPageLoaded ? 'animate-line-and-hide' : 'opacity-0'}`}/>
        <div className={`absolute z-[10] bg-darkbg w-[100%] h-[100%] ${isPageLoaded ? 'animate-hide' : ''}`}></div>
    </>
  )
}