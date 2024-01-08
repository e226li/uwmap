import MapViewer from "./_components/map-viewer"
import NavigationBar from "./_components/navigation-bar"
import RingRoadAnimation from "./_components/ring-road"

export default function Home() {

  const isPageLoaded = false

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden relative">
        <NavigationBar />
        <RingRoadAnimation />
        <MapViewer token={process.env.MAPBOX_TOKEN} apiKey={process.env.API_KEY ?? ""} />
    </div>
  )
}