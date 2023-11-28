import MapViewer from "./_components/map-viewer"
import NavigationBar from "./_components/navigation-bar"

export default function Home() {
  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden">
        <NavigationBar />
        <MapViewer token={process.env.MAPBOX_TOKEN} apiKey={process.env.API_KEY ?? ""} />
    </div>
  )
}
    