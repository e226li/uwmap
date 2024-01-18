import MapViewer from "./components/map-viewer"
import RingRoadAnimation from "./components/ring-road"

export default function Home() {
  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden fixed">
        <RingRoadAnimation />
        <MapViewer token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} />
    </div>
  )
}