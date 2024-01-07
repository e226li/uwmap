import MapViewer from "./_components/map-viewer"
import NavigationBar from "./_components/navigation-bar"
import RingRoadSvg from "./_components/ring-road"

export default function Home() {
  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden relative">
        <NavigationBar />
        <RingRoadSvg className="absolute z-[20] ring-road scale-[1.13] animate-line-and-hide"/>
        <div className="absolute z-[10] bg-darkbg w-[100%] h-[100vh] animate-hide"></div>
        <MapViewer token={process.env.MAPBOX_TOKEN} apiKey={process.env.API_KEY ?? ""} />
    </div>
  )
}