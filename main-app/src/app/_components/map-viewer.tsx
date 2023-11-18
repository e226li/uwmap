"use client"

import Map from 'react-map-gl';

export default function MapViewer(){
  const token = "pk.eyJ1IjoiYWxleHN0YXJvc3RhIiwiYSI6ImNscDNoYmdyZDB4OWsyaXQyYXZ5Y3h5ZTgifQ.dmngOhy0-UsGvBJyjwPD4g"

  return (
    <Map
      mapboxAccessToken={token}
      initialViewState={{
        longitude: -80.542556, 
        latitude: 43.47,
        zoom: 15.25
      }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    />
  );
}