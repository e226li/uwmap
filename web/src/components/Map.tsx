import Map from "react-map-gl" ;


export default function Mapbox() {
  const token = "pk.eyJ1IjoiZmxvd2VyYm9iNjY2IiwiYSI6ImNsb3RldzBpODA4NzcyaXBrbThoNzhsbXMifQ.RMK1LNHf-weJDAll0x7VGg"

  return (
    <Map
      mapboxAccessToken={token}
      initialViewState={{
        longitude: -80.54496456634195, 
        latitude: 43.471885360593646,
        zoom: 17
      }}
      style={{width: "100%", height: "100%", margin: 0, position: "absolute", top: 0, bottom: 0}}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    />
  )
}